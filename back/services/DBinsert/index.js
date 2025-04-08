const amqp = require('amqplib');
const dotenv = require('dotenv');
const MongoClient = require('mongodb').MongoClient;

dotenv.config();

async function receiveMessage() {
    const queue = 'SensorData';
  
    try {
      const connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();
  
      await channel.assertQueue(queue, { durable: false });
      console.log('🟡 Esperando mensajes...');
  
      channel.consume(queue, (msg) => {
        const data = JSON.parse(msg.content.toString());
        const { volume, temperature, id_aula, date } = data;
        console.log(`🔵 Mensaje recibido - Volum: ${volume} dB, Temperatura: ${temperature}°C, Aula: ${id_aula}, Data: ${date}`);
        insertDataToMongoDB(volume, temperature, id_aula, date);
      }, {
        noAck: true
      });
    } catch (error) {
      console.error('❌ Error al recibir mensaje', error);
    }
  }


async function insertDataToMongoDB(volume, temperature, id_aula, date) {
    const url = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB;

    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

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

receiveMessage();