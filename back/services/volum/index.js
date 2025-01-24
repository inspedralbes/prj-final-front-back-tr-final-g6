import { MongoClient } from 'mongodb';

// Funció per simular la lectura del volum en decibels
function getVolumeInDecibels() {
    // Simulació d'un valor de volum en decibels
    return Math.floor(Math.random() * 100);
}

// Connexió a MongoDB
const url = 'mongodb+srv://marti:marti@cluster0.b6lov.mongodb.net/';
const dbName = 'projecte_final';
const client = new MongoClient(url);

async function logVolume() {
    const volume = getVolumeInDecibels();
    const date = new Date().toISOString();

    console.log(`El volum actual és de ${volume} dB`);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('volum');

        const result = await collection.insertOne({ volume, date });
        console.log(`Dades inserides amb l'ID: ${result.insertedId}`);
    } catch (error) {
        console.error('Error inserint les dades a MongoDB:', error);
    } finally {
        await client.close();
    }
}

// Configurar l'interval per executar la funció cada 10 segons
setInterval(logVolume, 1000);