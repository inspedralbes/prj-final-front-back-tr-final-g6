import express from 'express';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3020;

import { createServer } from 'http';
import mysql2 from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
import ampq from 'amqplib';
import { MongoClient } from 'mongodb';
import moment from 'moment-timezone';
import path from 'path'; // Importa el mòdul path

app.use(cors());
app.use(express.json());

app.use("/api/fileSensor", express.static(path.join(__dirname, 'sensor'))); // Serveix fitxers estàtics des de la carpeta 'sensor'
console.log("Serving static files from:", path.join(__dirname, 'sensor'));

const server = createServer(app);
dotenv.config();

const connexioBD = mysql2.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

function connectToDB() {
  connexioBD.connect(err => {
    console.log(process.env.MYSQL_HOST);
    console.log(process.env.MYSQL_USER);
    console.log(process.env.MYSQL_PASSWORD);
    console.log(process.env.MYSQL_DATABASE);
    if (err) {
      console.error('Error de connexió a la base de dades: ' + err.stack);
      return;
    }

    console.log('Connexió a la base de dades correcta');
  });
}

const mongoClient = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let collection;

async function connectToMongoDB() {
  try {
    await mongoClient.connect();
    console.log('Connected to MongoDB successfully');
    const db = mongoClient.db(process.env.MONGO_DATABASE);

    const collections = await db.listCollections({ name: 'dades' }).toArray();
    if (collections.length === 0) {
      await db.createCollection('dades');
      console.log('Colección "dades" creada correctamente');
    } else {
      console.log('La colección "dades" ya existe');
    }

    collection = db.collection('dades');
    console.log('Colección "dades" inicializada correctamente');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}

await connectToMongoDB();

connectToDB();

// Socket.IO setup

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

// Socket.IO events

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

//ENDPOINTS API

app.post('/api/login', (req, res) => {
  const { correu, contrasenya } = req.body;

  if (!correu || !contrasenya) {
    return res.status(400).send({ message: 'correu i contrasenya són necessaris' });
  }

  // Primero buscamos el usuario solo por correo
  const query = 'SELECT * FROM usuari WHERE correu = ?';
  connexioBD.execute(query, [correu], (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de dades: ' + err.stack);
      res.status(500).send('Error en la consulta a la base de dades');
      return;
    }

    if (results.length > 0) {
      const user = results[0];
      // Comparamos la contraseña proporcionada con la almacenada
      if (user.contrasenya === contrasenya) {
        // Eliminamos la contraseña antes de enviar los datos del usuario
        const { contrasenya, ...userWithoutPassword } = user;
        res.status(200).send({ 
          message: 'Login successful', 
          user: userWithoutPassword 
        });
      } else {
        res.status(401).send({ message: 'Credencials incorrectes' });
      }
    } else {
      // No revelamos si el correo existe o no por seguridad
      res.status(401).send({ message: 'Credencials incorrectes' });
    }
  });
});

app.get('/api/aules', (req, res) => {
  const query = 'SELECT * FROM aula';
  connexioBD.execute(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de dades: ' + err.stack);
      res.status(500).send('Error en la consulta a la base de dades');
      return;
    }
    res.status(200).send(results);
  });
});

app.get('/api/aules/actives', (req, res) => {
  const query = 'SELECT * FROM aula WHERE activa = 1';
  connexioBD.execute(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de dades: ' + err.stack);
      res.status(500).send('Error en la consulta a la base de dades');
      return;
    }

    res.status(200).send(results);
  });
});

app.get('/api/aules/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM aula WHERE id = ?';
  connexioBD.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de dades: ' + err.stack);
      res.status(500).send('Error en la consulta a la base de dades');
      return;
    }

    if (results.length > 0) {
      res.status(200).send(results[0]);
    } else {
      res.status(404).send('Aula not found');
    }
  });
});

app.post('/api/aules', (req, res) => {
  const { curs, classe, etapa } = req.body;

  if (!curs || !classe || !etapa) {
    return res.status(400).send({ message: 'curs, classe i etapa són necessaris' });
  }

  const query = 'INSERT INTO aula (curs, classe, etapa) VALUES (?, ?, ?)';
  connexioBD.execute(query, [curs, classe, etapa], (err, results) => {
    if (err) {
      console.error('Error en la inserció a la base de dades: ' + err.stack);
      res.status(500).send('Error en la inserció a la base de dades');
      return;
    }

    res.status(201).send({ message: 'Aula creada correctament', id: results.insertId });
  });
});

app.put('/api/aules/:id', (req, res) => {
  const id = req.params.id;
  const { Curs, Classe, Etapa, Planta, Aula, activa, turn } = req.body;

  const query = 'UPDATE aula SET Curs = ?, Classe = ?, Etapa = ?, Planta = ?, Aula = ?, activa = ?, turn = ? WHERE id = ?';
  const values = [Curs, Classe, Etapa, Planta, Aula, activa, turn, id];

  connexioBD.query(query, values, (err, results) => {
    if (err) {
      console.error('Error en la actualización de la base de datos:', err);
      return res.status(500).json({ message: 'Error en actualizar el aula' });
    }
    res.json({ message: 'Aula actualizada con éxito' });
  });
});


app.delete('/api/aules/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM aula WHERE id = ?';
  connexioBD.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Error en l\'esborrat a la base de dades: ' + err.stack);
      res.status(500).send('Error en l\'esborrat a la base de dades');
      return;
    }

    if (results.affectedRows > 0) {
      res.status(200).send({ message: 'aula esborrada correctament' });
    } else {
      res.status(404).send('aula not found');
    }
  });
});

app.put('/api/aules/:id/activa', (req, res) => {
  const { id } = req.params;
  const { activa } = req.body;  // El valor de activa (1 o 0)

  if (activa === undefined) {
    return res.status(400).send({ message: 'El estado "activa" es necesario' });
  }

  const query = 'UPDATE aula SET activa = ? WHERE id = ?';
  connexioBD.execute(query, [activa, id], (err, results) => {
    if (err) {
      console.error('Error en la actualización a la base de datos: ' + err.stack);
      res.status(500).send('Error en la actualización a la base de datos');
      return;
    }

    if (results.affectedRows > 0) {
      res.status(200).send({ message: `El estado del aula ha sido actualizado a ${activa === 1 ? 'habilitada' : 'deshabilitada'}` });
    } else {
      res.status(404).send('Aula no encontrada');
    }
  });
});

// Get mitjanes de dades
app.get('/api/mapa', async (req, res) => {
  const { aules, tipus, data } = req.body;

  if (!aules || !tipus || !data) {
    return res.status(400).json({ message: 'aules, tipus i data són necessaris' });
  }

  const formattedDate = `${data}%`;
  const response = [];

  const promises = aules.map(aula => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT d.idAula, a.Curs, d.average 
        FROM dia d
        JOIN aula a ON d.idAula = a.id
        WHERE d.idAula = ? AND d.tipus = ? AND d.dataIni LIKE ?
      `;

      connexioBD.execute(query, [aula, tipus, formattedDate], (err, results) => {
        if (err) {
          console.error('Error en la consulta a la base de dades:', err);
          return reject('Error en la consulta a la base de dades');
        }
        console.log('Dades rebudes de la base de dades: ', results);
        if (results.length > 0) {
          response.push(results[0]);
        }
        resolve();
      });
    });
  });

  try {
    await Promise.all(promises);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Get dades per gràfics
app.get('/api/aules/:id/grafic', (req, res) => {
  const { taula, tipus, dataIni, dataFi } = req.query;
  const idAula = req.params.id;

  if (!taula || !tipus || !idAula || !dataIni || !dataFi) {
    return res.status(400).json({ message: 'taula, tipus, idAula, dataIni i dataFi són necessaris' });
  }

  const query = `
    SELECT idAula, average, max, min, dataIni
    FROM ${taula}
    WHERE idAula = ? AND tipus = ? AND dataIni BETWEEN ? AND ?
  `;

  connexioBD.execute(query, [idAula, tipus, dataIni, dataFi], (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de dades:', err);
      return res.status(500).json({ message: 'Error en la consulta a la base de dades' });
    }
    res.json(results);
  });
});

app.get('/api/sensors', (req, res) => {
  const query = 'SELECT * FROM sensor';
  connexioBD.execute(query, (err, results) => {
      if (err) {
          console.error('Error en la consulta a la base de dades: ' + err.stack);
          res.status(500).send('Error en la consulta a la base de dades');
          return;
      }
      console.log('Resultados obtenidos:', results); // Log para depuración
      res.status(200).send(results);
  });
});

app.put('/api/sensors', (req, res) => {
  const { MAC, nombre, ubicacion, x, y } = req.body;
  const query = 'UPDATE sensor SET nombre = ?, ubicacion = ?, x = ?, y = ? WHERE mac = ?';
  connexioBD.execute(query, [nombre, ubicacion, x, y, MAC], (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de dades: ' + err.stack);
      res.status(500).send('Error en la consulta a la base de dades');
      return;
    }
    if (results.affectedRows > 0) {
      res.status(200).send({ message: 'Sensor actualitzat correctament' });
    } else {
      res.status(404).send('Sensor no trobat');
    }
  });
});

app.delete('/api/sensors/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM sensor WHERE idSensor = ?';
  connexioBD.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Error en la eliminación del sensor:', err.stack);
      return res.status(500).send({ message: 'Error en la eliminación del sensor' });
    }
    if (results.affectedRows > 0) {
      res.status(200).send({ message: 'Sensor eliminado correctamente' });
    } else {
      res.status(404).send({ message: 'Sensor no encontrado' });
    }
  });
});

// Actualizar un sensor
app.put('/api/sensors/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, ubicacion, x, y } = req.body;
  const query = 'UPDATE sensor SET nombre = ?, ubicacion = ?, x = ?, y = ? WHERE idSensor = ?';
  connexioBD.execute(query, [nombre, ubicacion, x, y, id], (err, results) => {
    if (err) {
      console.error('Error en la actualización del sensor:', err.stack);
      return res.status(500).send({ message: 'Error en la actualización del sensor' });
    }
    if (results.affectedRows > 0) {
      res.status(200).send({ message: 'Sensor actualizado correctamente' });
    } else {
      res.status(404).send({ message: 'Sensor no encontrado' });
    }
  });
});

app.get('/api/newsensors', (req, res) => {
  const query = 'SELECT * FROM newsensor WHERE accepted = 0 AND banned = 0'; // Updated query
  connexioBD.execute(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de dades: ' + err.stack);
      res.status(500).send('Error en la consulta a la base de dades');
      return;
    }
    res.status(200).send(results);
  });
});

app.put('/api/newsensors/:id/accept', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE newsensor SET accepted = 1 WHERE id = ?';
  connexioBD.execute(query, [id], (err, results) => {
      if (err) {
          console.error('Error en la consulta a la base de dades:', err);
          return res.status(500).send('Error en la consulta a la base de dades');
      }
      res.status(200).send({ message: 'Sensor acceptat correctament' });
  });
});

app.put('/api/newsensors/:id/reject', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE newsensor SET accepted = 0, banned = 1 WHERE id = ?';
  connexioBD.execute(query, [id], (err, results) => {
      if (err) {
          console.error('Error en la consulta a la base de dades:', err);
          return res.status(500).send('Error en la consulta a la base de dades');
      }
      res.status(200).send({ message: 'Sensor rebutjat correctament' });
  });
});

app.put('/api/newsensors/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // status should be 'accept' or 'reject'

  if (!['accept', 'reject'].includes(status)) {
    return res.status(400).send({ message: 'El estado debe ser "accept" o "reject"' });
  }

  const query =
    status === 'accept'
      ? 'UPDATE newsensor SET accepted = 1, banned = 0 WHERE idSensor = ?'
      : 'UPDATE newsensor SET accepted = 0, banned = 1 WHERE idSensor = ?';

  console.log('Executing query:', query, 'with idSensor:', id); // Debugging log

  connexioBD.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de dades:', err); // Log the error
      return res.status(500).send({ message: 'Error en la consulta a la base de dades', error: err.message });
    }

    if (results.affectedRows > 0) {
      const message =
        status === 'accept'
          ? 'Sensor acceptat correctament'
          : 'Sensor rebutjat correctament';
      res.status(200).send({ message });
    } else {
      res.status(404).send({ message: 'Sensor no trobat' });
    }
  });
});

app.put('/api/newsensors/:id/unban', (req, res) => {
  const { id } = req.params;

  const query = 'UPDATE newsensor SET banned = 0 WHERE idSensor = ?';

  console.log('Executing query:', query, 'with idSensor:', id); // Debugging log

  connexioBD.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de dades:', err); // Log the error
      return res.status(500).send({ message: 'Error en la consulta a la base de dades', error: err.message });
    }

    if (results.affectedRows > 0) {
      res.status(200).send({ message: 'Sensor desbannejat correctament' });
    } else {
      res.status(404).send({ message: 'Sensor no trobat' });
    }
  });
});

app.get('/api/newsensors/banned', (req, res) => {
  const query = 'SELECT * FROM newsensor WHERE banned = 1';
  connexioBD.execute(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de dades: ' + err.stack);
      res.status(500).send({ message: 'Error en la consulta a la base de dades', error: err.message });
      return;
    }
    res.status(200).send(results);
  });
});

app.post('/api/newsensors', (req, res) => {
  const { MAC } = req.body;
  const query1 = `SELECT * FROM newsensor WHERE mac = ?`;
  connexioBD.execute(query1, [MAC], (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de dades: ' + err.stack);
      res.status(500).send('Error en la consulta a la base de dades');
      return;
    }
    if (results.length === 0) {
      const query3 = 'INSERT INTO newsensor (mac, accepted) VALUES (?, ?)';
      connexioBD.execute(query3, [MAC, 0], (err, results) => {
        if (err) {
          console.error('Error en la inserció a la base de dades: ' + err.stack);
          res.status(500).send('Error en la inserció a la base de dades');
          return;
        }
        res.status(201).send({ message: 'Sensor creat correctament', id: results.insertId });
      });
    }
    else if (results.length === 1 && results[0].accepted === 1) {
      const apiKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const query2 = 'INSERT INTO sensor (mac, api_key, nombre, ubicacion, x, y) VALUES (?, ?, ?, ?, ?, ?)';
      const nombre = 'Sensor ' + MAC;
      connexioBD.execute(query2, [MAC, apiKey, nombre, 'Aula 1', 0, 0], (err, results) => {
        if (err) {
          console.error('Error en la inserció a la base de dades: ' + err.stack);
          res.status(500).send('Error en la inserció a la base de dades');
          return;
        }
        res.status(201).send({ message: 'Sensor creat correctament', id: results.insertId, apiKey });
      });
    } else if (results.length === 1 && results[0].accepted === 0) {
      res.status(400).send({ message: 'El sensor no esta acceptat' });
    }
  });
});

app.get('/api/data/mongodb', async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'startDate i endDate són necessaris' });
  }

  try {
    console.log('Dates rebudes: ', startDate, endDate);

    // Converteix les dates a objectes Date i ajusta l'hora a l'hora local de Barcelona
    const start = moment.tz(startDate, 'Europe/Madrid').add(2, 'hours').toDate();
    const end = moment.tz(endDate, 'Europe/Madrid').add(2, 'hours').toDate();

    console.log('Dates convertides i ajustades: ', start, end);

    // Afegeix validació per assegurar-te que són dates vàlides
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'El format de les dates no és vàlid' });
    }

    const results = await collection.find({
      date: {
        $gte: start.toISOString(), // Converteix a string ISO per comparar amb el camp string
        $lt: end.toISOString()
      }
    }).toArray();

    console.log('Dades rebudes de MongoDB: ', results);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error obtenint les dades de MongoDB:', error);
    res.status(500).json({ message: 'Error obtenint les dades de MongoDB' });
  }
});

app.post('/api/data/mongodb', async (req, res) => {
  console.log('Rebent dades per a MongoDB');
  const { volume, temperature, date, MAC, api_key } = req.body;
  if(volume == null || temperature == null || date == null || MAC == null || api_key == null) {
    return res.status(400).json({ message: 'Dades incompletes' });
  }

  const query = 'SELECT * FROM sensor WHERE mac = ? AND api_key = ?';
  connexioBD.execute(query, [MAC, api_key], async (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de dades: ' + err.stack);
      res.status(500).send('Error en la consulta a la base de dades');
      return;
    }
    if (results.length === 0) {
      return res.status(403).json({ message: 'API key no vàlida' });
    }
    console.log('API key vàlida, inserint dades a MongoDB');
    const id_sensor = results[0].idSensor;
    try {
      const result = await collection.insertOne({ volume, temperature, id_sensor, date });
      console.log(`Dades inserides amb l'ID: ${result.insertedId}`);

      io.emit('newRawData', { volume, temperature, id_sensor, date });

      res.status(201).json({ message: 'Dades inserides correctament', id: result.insertedId });
    } catch (error) {
      console.error('Error inserint les dades a MongoDB:', error);
      res.status(500).send({ message: 'Error inserint les dades a MongoDB' });
    }
  });
});

app.post('/api/data/mysql', (req, res) => {
  const { timeSpan, sensors } = req.body;

  if (!timeSpan || typeof sensors !== 'object') {
    return res.status(400).json({ message: 'Es requereix un timeSpan' });
  }

  const query = `INSERT INTO ${mysql2.escapeId(timeSpan)} (idAula, idSensor, tipus, max, min, average, dataIni, dataFi) VALUES ?`;


  const currentDate = moment.tz('Europe/Madrid');
  const dataIni = currentDate.format('YYYY-MM-DD HH:mm:ss'); 
  const dataFi = currentDate.add(1, 'minute').format('YYYY-MM-DD HH:mm:ss'); 

  const values = Object.entries(sensors).flatMap(([idSensor, { volume, temperature }]) => [
    [1, idSensor, 'volum', volume.max, volume.min, volume.avg, dataIni, dataFi],
    [1, idSensor, 'temperatura', temperature.max, temperature.min, temperature.avg, dataIni, dataFi]
  ]);

  connexioBD.query(query, [values], (err, results) => {
    console.log('Query completa: ', query);

    if (err) {
      console.error('Error en la inserció a la base de dades: ' + err.stack);
      return res.status(500).json({ message: 'Error en la inserció a la base de dades' });
    }

    io.emit('newAggregatedData', { timeSpan, sensors });

    console.log('Dades inserides correctament a MySQL: ', results);
    res.status(201).json({ message: 'Dades inserides correctament', affectedRows: results.affectedRows });
  });
});


async function verifyAPI(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ message: 'API key es requerida' });
  }

  const query = 'SELECT * FROM sensor WHERE api_key = ?';
  connexioBD.execute(query, [apiKey], (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de datos:', err);
      return res.status(500).json({ message: 'Error en la consulta a la base de datos' });
    }

    if (results.length === 0) {
      return res.status(403).json({ message: 'API key no válida' });
    }
    
    next();
  });
}

app.get('/api/sensors/banned', (req, res) => {
  const query = 'SELECT * FROM sensor WHERE banned = 1'; // Ensure the correct table and column names
  connexioBD.execute(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de dades:', err.stack);
      return res.status(500).send({ message: 'Error en la consulta a la base de dades', error: err.message });
    }
    res.status(200).send(results);
  });
});

// Endpoint para obtener todos los datos de gráficos
app.get('/api/grafics/all', (req, res) => {
    const { dataIni, dataFi } = req.query;

    if (!dataIni || !dataFi) {
        return res.status(400).json({ message: 'dataIni i dataFi són necessaris' });
    }

    // Consulta para temperatura
    const queryTemp = `
        SELECT s.idSensor, s.nombre, s.ubicacion, a.id as aulaId, a.Curs, 
               t.temperatura, t.data_lectura
        FROM sensor s
        LEFT JOIN aula a ON s.idAula = a.id
        JOIN temperatura t ON s.idSensor = t.idSensor
        WHERE t.data_lectura BETWEEN ? AND ?
        ORDER BY t.data_lectura ASC`;

    // Consulta para volumen
    const queryVol = `
        SELECT s.idSensor, s.nombre, s.ubicacion, a.id as aulaId, a.Curs, 
               v.volumen, v.data_lectura
        FROM sensor s
        LEFT JOIN aula a ON s.idAula = a.id
        JOIN volumen v ON s.idSensor = v.idSensor
        WHERE v.data_lectura BETWEEN ? AND ?
        ORDER BY v.data_lectura ASC`;

    Promise.all([
        new Promise((resolve, reject) => {
            connexioBD.query(queryTemp, [dataIni, dataFi], (err, tempResults) => {
                if (err) reject(err);
                resolve(tempResults);
            });
        }),
        new Promise((resolve, reject) => {
            connexioBD.query(queryVol, [dataIni, dataFi], (err, volResults) => {
                if (err) reject(err);
                resolve(volResults);
            });
        })
    ])
    .then(([temperaturas, volumenes]) => {
        res.json({
            temperaturas,
            volumenes
        });
    })
    .catch(err => {
        console.error('Error al obtener datos:', err);
        res.status(500).json({ message: 'Error al obtener los datos', error: err.message });
    });
});

// Endpoint per enviar missatges a RabbitMQ
app.post('/api/sendMessage', async (req, res) => {
  const { api_key, volume, temperature, date, MAC } = req.body;

  if (!api_key || !volume || !temperature || !date || !MAC) {
    return res.status(400).send({ message: 'Falten dades necessàries' });
  }

  const queue = 'SensorData';
  const msg = { api_key, volume, temperature, date, MAC };

  try {
    const connection = await ampq.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
    console.log(`🟢 Missatge enviat:`, msg);

    setTimeout(() => {
      connection.close();
    }, 500);

    res.status(200).send({ message: 'Missatge enviat correctament' });
  } catch (error) {
    console.error('❌ Error al enviar el missatge:', error);
    res.status(500).send({ message: 'Error al enviar el missatge', error: error.message });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor en funcionament a http://localhost:${PORT}`);
});
