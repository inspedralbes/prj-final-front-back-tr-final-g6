import os
import sys
import json
import pymongo
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Carregar variables d'entorn des del fitxer .env
load_dotenv()

# Llegir la configuració des del fitxer .env
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION")

# Llegir arguments
interval = sys.argv[1]
temps = sys.argv[2]

# Convertir temps a objecte datetime
temps_datetime = datetime.fromisoformat(temps)

# Calcular la data d'inici segons l'interval
if interval == 'minut':
    start_time = temps_datetime - timedelta(minutes=1)
elif interval == 'hora':
    start_time = temps_datetime - timedelta(hours=1)
elif interval == 'dia':
    start_time = temps_datetime - timedelta(days=1)
else:
    raise ValueError("Interval no vàlid")

try:
    # Connectar a MongoDB
    client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client[MONGO_DB]
    collection = db[MONGO_COLLECTION]

    # Agregació per calcular la mitjana, el màxim i el mínim de volum i temperatura per cada aula
    pipeline = [
    {
        "$match": {
            "date": {"$gte": start_time.isoformat(), "$lte": temps_datetime.isoformat()},
        }
    },
    {
        "$group": {
            "_id": "$id_aula",
            "averageVolume": {"$avg": "$volume"},
            "maxVolume": {"$max": "$volume"},
            "minVolume": {"$min": "$volume"},
            "averageTemperature": {"$avg": { "$toDouble": "$temperature" }},
            "maxTemperature": {"$max": "$temperature"},
            "minTemperature": {"$min": "$temperature"}
        }
    },
    {
        "$sort": {"_id": 1}
    }
]

    results = collection.aggregate(pipeline)
    output = []
    for result in results:
        aula = result["_id"]
        average_volume = result["averageVolume"]
        max_volume = result["maxVolume"]
        min_volume = result["minVolume"]
        average_temperature = result["averageTemperature"]
        max_temperature = result["maxTemperature"]
        min_temperature = result["minTemperature"]
        output.append({
            "dataIni": start_time.isoformat(),
            "dataFi": temps_datetime.isoformat(),
            "aula": aula,
            "averageVolume": average_volume if average_volume is not None else None,
            "maxVolume": max_volume if max_volume is not None else None,
            "minVolume": min_volume if min_volume is not None else None,
            "averageTemperature": average_temperature if average_temperature is not None else None,
            "maxTemperature": max_temperature if max_temperature is not None else None,
            "minTemperature": min_temperature if min_temperature is not None else None
        })

    # Retornar resultats en format JSON
    print(json.dumps(output, indent=4))

except pymongo.errors.ServerSelectionTimeoutError as err:
    print(json.dumps({"error": f"Error connecting to MongoDB: {err}"}))

finally:
    # Tancar la connexió
    client.close()