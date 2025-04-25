import express from 'express';

const app = express();
const PORT = process.env.PORT || 3020;

import { createServer } from 'http';
import mysql2 from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

app.use(cors());
app.use(express.json());

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

//ENDPOINTS API

app.post('/api/login', (req, res) => {
  const { correu, contrasenya } = req.body;

  if (!correu || !contrasenya) {
    return res.status(400).send({ message: 'correu i contrasenya són necessaris' });
  }

  const query = 'SELECT * FROM usuari WHERE correu = ? AND contrasenya = ?';
  connexioBD.execute(query, [correu, contrasenya], (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de dades: ' + err.stack);
      res.status(500).send('Error en la consulta a la base de dades');
      return;
    }

    if (results.length > 0) {
      res.status(200).send({ message: 'Login successful', user: results[0] });
    } else {
      res.status(401).send({ message: 'Invalid correu or contrasenya' });
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
app.post('/api/mapa', async (req, res) => {
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
app.post('/api/aules/:id/grafic', (req, res) => {
  const { taula, tipus, dataIni, dataFi } = req.body;
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

app.get('/api/newsensors', (req, res) => {
  const query = 'SELECT * FROM newsensor';
  connexioBD.execute(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de dades: ' + err.stack);
      res.status(500).send('Error en la consulta a la base de dades');
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

    // Converteix les dates a objectes Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    console.log('Dates convertides: ', start, end);

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

  const currentDate = new Date();
  const dataIni = currentDate.toISOString();
  const dataFi = new Date(currentDate.getTime() + 60000).toISOString();

  const values = Object.entries(sensors).flatMap(([idSensor, { volume, temperature }]) => [
    [1, idSensor, 'volum', volume.max, volume.min, volume.avg, dataIni, dataFi],
    [1, idSensor, 'temperatura', temperature.max, temperature.min, temperature.avg, dataIni, dataFi]
  ]);

  connexioBD.query(query, [timeSpan, values], (err, results) => {

    console.log('Query completa: ', query);

    if (err) {
      console.error('Error en la inserció a la base de dades: ' + err.stack);
      return res.status(500).json({ message: 'Error en la inserció a la base de dades' });
    }

    res.status(201).json({ message: 'Dades inserides correctament', affectedRows: results.affectedRows });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor en funcionament a http://localhost:${PORT}`);
}); 
