const dotenv = require('dotenv');
const amqp = require('amqplib');

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
        const { api_key, volume, temperature, MAC, date } = data;
        console.log(`🔵 Mensaje recibido - Volum: ${volume} dB, Temperatura: ${temperature}°C, Data: ${date}`);
        insertDataToMongoDB(volume, temperature, date, MAC, api_key);
      }, {
        noAck: true
      });
    } catch (error) {
      console.error('❌ Error al recibir mensaje', error);
    }
  }


async function insertDataToMongoDB(volume, temperature, date, MAC, api_key) {
  console.log('🔵 Enviando datos a MongoDB...')
  console.log(`🔵 Volum: ${volume} dB, Temperatura: ${temperature}°C, Api_key: ${api_key}, MAC:${MAC} Data: ${date}`);
  const url = process.env.BACK_URL + "/api/data/mongodb";

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Asegura que el servidor interprete el cuerpo como JSON
      },
      body: JSON.stringify({
        volume,
        temperature,
        date,
        MAC,
        api_key
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Data successfully sent to MongoDB');
  } catch (error) {
    console.error('Error sending data to MongoDB:', error);
  }
}

receiveMessage();