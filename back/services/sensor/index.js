import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// Funció per simular la lectura del volum en decibels en una aula de secundària
function getVolumeInDecibels() {
    return Math.floor(Math.random() * (80 - 50 + 1)) + 50; // Simula valors entre 50 i 80 dB
}

// Funció per simular la lectura de la temperatura en graus Celsius en una aula de secundària
function getTemperatureInCelsius() {
    return (Math.random() * (26 - 18) + 18).toFixed(2); // Simula temperatura entre 18 i 26 graus
}

// Funció per seleccionar un id d'aula a l'atzar
function getRandomAulaId() {
    return Math.floor(Math.random() * 3) + 1; // Genera un id entre 1 i 3
}

// Connexió a MongoDB
const url = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;
const client = new MongoClient(url);

async function logData() {
    const volume = getVolumeInDecibels();
    const temperature = getTemperatureInCelsius();
    const id_aula = getRandomAulaId();
    const date = new Date().toISOString();

    console.log(`Volum: ${volume} dB, Temperatura: ${temperature}°C, Aula: ${id_aula}`);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('dades');

        const result = await collection.insertOne({ volume, temperature, id_aula, date });
        console.log(`Dades inserides amb l'ID: ${result.insertedId}`);
    } catch (error) {
        console.error('Error inserint les dades a MongoDB:', error);
    } finally {
        await client.close();
    }
}

// Configurar l'interval per executar la funció cada 10 segons
setInterval(logData, 10000);
