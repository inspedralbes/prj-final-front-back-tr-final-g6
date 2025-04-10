import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

async function receiveMessage() {
    const queue = 'SensorData';
  
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();
  
      await channel.assertQueue(queue, { durable: false });
      console.log('🟡 Esperando mensajes...');
  
      channel.consume(queue, (msg) => {
        const data = JSON.parse(msg.content.toString());
        const { apt_key, volume, temperature, id_sensor, date } = data;
        console.log(`🔵 Mensaje recibido - APIKEY:${apt_key} Volum: ${volume} dB, Temperatura: ${temperature}°C, Aula: ${id_sensor}, Data: ${date}`);
        insertDataToMongoDB(apt_key, volume, temperature, id_sensor, date);
      }, {
        noAck: true
      });
    } catch (error) {
      console.error('❌ Error al recibir mensaje', error);
    }
  }


async function insertDataToMongoDB(apt_key, volume, temperature, id_sensor, date) {

    fetch(process.env.MONGO_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apt_key
        },
        body: JSON.stringify({
            volume,
            temperature,
            id_sensor,
            date
        })
    })
}

receiveMessage();