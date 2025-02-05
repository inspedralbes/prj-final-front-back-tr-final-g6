import os
import pymongo
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Carregar variables d'entorn des del fitxer .env
load_dotenv()

# Llegir la configuració des del fitxer .env
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION")

try:
    # Connectar a MongoDB
    client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client[MONGO_DB]
    collection = db[MONGO_COLLECTION]

    # Obtenir la data d'inici de la setmana actual (dilluns)
    today = datetime.today()
    start_of_week = today - timedelta(days=today.weekday())

    # Agregació per calcular la mitjana de volum per cada dia de la setmana actual per cada aula
    pipeline = [
        {
            "$match": {
                "date": {"$gte": start_of_week.isoformat()}
            }
        },
        {
            "$group": {
                "_id": {
                    "day": {"$dayOfWeek": "$date"},
                    "aula": "$id_aula"
                },
                "averageVolume": {"$avg": "$volume"}
            }
        },
        {
            "$sort": {"_id.day": 1, "_id.aula": 1}
        }
    ]

    results = collection.aggregate(pipeline)
    for result in results:
        day = result["_id"]["day"]
        aula = result["_id"]["aula"]
        average_volume = result["averageVolume"]
        print(f"Dia: {day}, Aula: {aula}, Mitjana de Volum: {average_volume:.2f} dB")

except pymongo.errors.ServerSelectionTimeoutError as err:
    print("Error connecting to MongoDB:", err)

finally:
    # Tancar la connexió
    client.close()