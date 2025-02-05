# Arguments: interval de temps format datetime


import os  # Importa el mòdul os per treballar amb variables d'entorn i altres funcionalitats del sistema operatiu
import pymongo  # Importa el mòdul pymongo per treballar amb MongoDB
from dotenv import load_dotenv  # Importa la funció load_dotenv per carregar variables d'entorn des d'un fitxer .env
from datetime import datetime, timedelta  # Importa datetime i timedelta per treballar amb dates i temps
import json  # Importa el mòdul json per treballar amb dades en format JSON
from collections import defaultdict  # Importa defaultdict per crear diccionaris amb valors per defecte

# Carregar variables d'entorn des del fitxer .env
load_dotenv()

# Llegir la configuració des del fitxer .env
MONGO_URI = os.getenv("MONGO_URI")  # Obté la URI de MongoDB des de les variables d'entorn
MONGO_DB = os.getenv("MONGO_DB")  # Obté el nom de la base de dades de MongoDB des de les variables d'entorn
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION")  # Obté el nom de la col·lecció de MongoDB des de les variables d'entorn

# Diccionari de traducció dels dies de la setmana
dies_setmana = {
    'Monday': 'Dilluns',
    'Tuesday': 'Dimarts',
    'Wednesday': 'Dimecres',
    'Thursday': 'Dijous',
    'Friday': 'Divendres'
}

try:
    # Connectar a MongoDB
    client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)  # Crea un client de MongoDB amb un timeout de 5 segons
    db = client[MONGO_DB]  # Selecciona la base de dades
    collection = db[MONGO_COLLECTION]  # Selecciona la col·lecció

    # Obtenir la data d'inici de la setmana actual (dilluns) a les 8 del matí
    today = datetime.today()  # Obté la data i hora actual
    start_of_week = today - timedelta(days=today.weekday())  # Calcula el dilluns de la setmana actual
    start_of_week = start_of_week.replace(hour=8, minute=0, second=0, microsecond=0)  # Ajusta l'hora a les 8 del matí

    # Obtenir la data de final de la setmana actual (divendres) a les 23:59:00
    end_of_week = start_of_week + timedelta(days=4, hours=15, minutes=59)  # Calcula el divendres de la setmana actual a les 23:59:00

    # Convertir start_of_week i end_of_week a string en format ISO 8601
    start_of_week_iso = start_of_week.isoformat() + "Z"  # Converteix la data d'inici a format ISO 8601
    end_of_week_iso = end_of_week.isoformat() + "Z"  # Converteix la data de final a format ISO 8601

    # Filtrar les dades de la setmana actual
    query = {
        "date": {
            "$gte": start_of_week_iso,  # Filtra les dates que són majors o iguals a la data d'inici
            "$lte": end_of_week_iso  # Filtra les dates que són menors o iguals a la data de final
        }
    }

    # Obtenir les dades de la setmana actual
    dades = collection.find(query)  # Executa la consulta a la col·lecció

    # Inicialitzar diccionari per emmagatzemar volums per dia i aula
    volums_per_dia_aula = defaultdict(lambda: defaultdict(list))  # Crea un diccionari amb valors per defecte que són llistes

    # Processar les dades
    for dada in dades:  # Itera sobre les dades obtingudes
        date_obj = datetime.fromisoformat(dada['date'].replace("Z", "+00:00"))  # Converteix la data de format ISO 8601 a un objecte datetime
        day_of_week = date_obj.strftime('%A')  # Obté el dia de la setmana en format text
        aula = dada['id_aula']  # Obté l'aula de la dada
        volume = dada.get('volume', 0)  # Obté el volum de la dada, per defecte 0 si no existeix
        volums_per_dia_aula[aula][day_of_week].append(volume)  # Afegeix el volum al diccionari

    # Calcular les mitjanes
    mitjanes_per_dia_aula = defaultdict(lambda: {day: 0 for day in dies_setmana.values()})  # Crea un diccionari amb valors per defecte que són diccionaris amb els dies de la setmana en català
    for aula, volums_per_dia in volums_per_dia_aula.items():  # Itera sobre les aules i els volums per dia
        for day, volums in volums_per_dia.items():  # Itera sobre els dies i els volums
            if volums:  # Si hi ha volums
                mitjana = sum(volums) / len(volums)  # Calcula la mitjana dels volums
            else:  # Si no hi ha volums
                mitjana = 0  # La mitjana és 0
            mitjanes_per_dia_aula[aula][dies_setmana[day]] = mitjana  # Assigna la mitjana al diccionari amb el dia en català

    # Convertir les mitjanes a format JSON
    mitjanes_json = json.dumps(mitjanes_per_dia_aula, default=str, indent=4)  # Converteix el diccionari de mitjanes a format JSON

    # Mostrar les mitjanes en format JSON
    print(mitjanes_json)  # Imprimeix les mitjanes en format JSON

except pymongo.errors.ServerSelectionTimeoutError as err:  # Captura l'error de timeout de connexió a MongoDB
    print("Error connecting to MongoDB:", err)  # Imprimeix un missatge d'error

finally:
    # Tancar la connexió
    client.close()  # Tanca la connexió a MongoDB