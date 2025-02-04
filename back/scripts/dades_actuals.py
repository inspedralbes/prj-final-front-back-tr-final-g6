import os
import pymongo
from dotenv import load_dotenv

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

    # Llegir i mostrar tots els documents de la col·lecció
    documents = collection.find()
    for doc in documents:
        print(doc)

except pymongo.errors.ServerSelectionTimeoutError as err:
    print("Error connecting to MongoDB:", err)

finally:
    # Tancar la connexió
    client.close()