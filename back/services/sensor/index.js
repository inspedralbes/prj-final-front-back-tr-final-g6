const dotenv = require('dotenv');
const amqp = require('amqplib');
const { DateTime } = require("luxon");
dotenv.config();

// Funció per simular la lectura del volum en decibels en una aula de secundària
function getVolumeInDecibels() {
    return Math.floor(Math.random() * (80 - 50 + 1)) + 50; // Simula valors entre 50 i 80 dB
}

// Funció per simular la lectura de la temperatura en graus Celsius en una aula de secundària
function getTemperatureInCelsius() {
    return (Math.random() * (26 - 18) + 18).toFixed(2); // Simula temperatura entre 18 i 26 graus
}

function getHumidityInPercentage() {
    return Math.floor(Math.random() * (100 - 0 + 1)) + 0; // Simula humitat entre 0 i 100%
}

// Funció per seleccionar un id d'un sensor a l'atzar
function getRandomAulaId() {
    return Math.floor(Math.random() * 3) + 1; // Genera un id entre 1 i 3
}

const MAC = "MAMAMAM";
const api_key = "c8nlsy4955ju75tq5w3f"; 

async function sendMessage(api_key, volume, temperature, humidity, date, MAC) {
    const queue = 'SensorData';
    const msg = { api_key, volume, temperature, humidity, date, MAC };
  
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();
  
      await channel.assertQueue(queue, { durable: false });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
      console.log(`🟢 Mensaje enviado`);
  
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
    const humidity = getHumidityInPercentage();
    const date = DateTime.now().setZone("Europe/Madrid").toISO();

    console.log(`Volum: ${volume} dB, Temperatura: ${temperature}°C, Humitat: ${humidity}%, Data: ${date}`);

    sendMessage(api_key, volume, temperature, humidity, date, MAC);
}

// Configurar l'interval per executar la funció cada segon
setInterval(logData, 1000);
