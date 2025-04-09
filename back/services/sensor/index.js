const amqp = require('amqplib');
const dotenv = require('dotenv');

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

async function sendMessage(volume, temperature, id_aula, date) {
    const queue = 'SensorData';
    const msg = { volume, temperature, id_aula, date};
  
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();
  
      await channel.assertQueue(queue, { durable: false });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
      console.log(`🟢 Mensaje enviado: ${msg}`);
  
      setTimeout(() => {
        connection.close();
      }, 500);
    } catch (error) {
      console.error('❌ Error al enviar mensaje', error);
    }
  }

  async function logData() {
    const volume = getVolumeInDecibels();
    const temperature = getTemperatureInCelsius();
    const id_aula = getRandomAulaId();
    const date = new Date().toISOString();

    console.log(`Volum: ${volume} dB, Temperatura: ${temperature}°C, Aula: ${id_aula}`);

    sendMessage(volume, temperature, id_aula, date)
}

// Configurar l'interval per executar la funció cada 10 segons
setInterval(logData, 10000);
