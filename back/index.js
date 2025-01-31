import express from 'express';

const app = express();
const PORT = process.env.PORT || 3020;

import { createServer } from 'http';
import { Server as socketIo } from 'socket.io';
import mysql2 from 'mysql2';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import cors from 'cors';
import { spawn } from 'node:child_process';
import dotenv from 'dotenv';

app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new socketIo(server);

const services = [];

dotenv.config();

const connexioBD = mysql2.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

function connectToDB() {
  connexioBD.connect(err => {
    if (err) {
      console.error('Error de connexió a la base de dades: ' + err.stack);
      return;
    }

    console.log('Connexió a la base de dades correcta');
  });
}

connectToDB();

const __dirname = dirname(fileURLToPath(import.meta.url));
fs.readdirSync(path.join(__dirname, 'services')).forEach(file => {
  services.push({ id: uuidv4(), name: file, state: 'tancat', logs: [], errorLogs: [], process: null });

  try {
    let data = fs.readFileSync(path.join(__dirname, 'logs') + `/${file}.log`, 'utf8');

    let splitData = data.toString().split('||\n');

    splitData.forEach(element => {
      if (element.length === 0) return;
      const parsedElement = JSON.parse(element);

      services.find(service => service.name === file).logs.push(parsedElement);
    });
  } catch (error) {
    console.log(`File not found: ${error}`);
  }


  try {
    let data = fs.readFileSync(path.join(__dirname, 'logs') + `/${file}.error.log`, 'utf8');

    let splitData = data.toString().split('||\n');

    splitData.forEach(element => {
      if (element.length === 0) return;
      const parsedElement = JSON.parse(element);

      services.find(service => service.name === file).errorLogs.push(parsedElement);
    });
  } catch (error) {
    console.log(`File not found: ${error}`);
  }
});

app.get('/services', (req, res) => {
  res.send(services);
});

app.post('/changeServiceState', (req, res) => {


  const { id } = req.body

  const service = services.find(service => service.id === id);

  if (service.state === 'tancat') {
    startProcess(service);
    service.state = 'encès';
  } else {
    stopProcess(service);
    service.state = 'tancat';
  }

  res.send(services);

});

//Endpoint per a comprovar l'estat d'un servei
app.post('/api/checkServiceStatus', (req, res) => {
  const { serviceName } = req.body;
  console.log(serviceName);
  const status = checkServiceStatus(serviceName);
  res.status(200).json({ "status": status });
});

function startProcess(service) {
  const process = spawn('node', [path.join(__dirname, 'services') + `/${service.name}/index.js`], {
    cwd: path.join(__dirname, 'services') + `/${service.name}`,
  });

  service.process = process;

  process.stdout.on('data', data => {
    const date = new Date(Date.now("YYYY-MM-DD HH:mm:ss")).toISOString().split('.')[0].replace('T', ' ');
    service.logs.push({ log: data.toString(), date: date });
    saveLogs(service, { log: data.toString(), date: date });
  });

  process.stderr.on('data', data => {
    const date = new Date(Date.now("YYYY-MM-DD HH:mm:ss")).toISOString().split('.')[0].replace('T', ' ');
    service.errorLogs.push({ log: data.toString(), date: date });
    saveErrorLogs(service, { log: data.toString(), date: date });

  });

  process.on('close', code => {
    service.state = 'tancat';
    service.process = null;
    enviarServeis();
  });

  enviarServeis();
}

function stopProcess(service) {
  service.process.kill();
  service.process = null;
  service.state = 'tancat';
  enviarServeis();
}

function saveLogs(service, objectToSave) {
  const { log, date } = objectToSave;

  fs.existsSync(path.join(__dirname, 'logs')) || fs.mkdirSync(path.join(__dirname, 'logs'));

  fs.existsSync(path.join(__dirname, 'logs') + `/${service.name}.log`) || fs.writeFileSync(path.join(__dirname, 'logs') + `/${service.name}.log`, '');

  fs.appendFile(path.join(__dirname, 'logs') + `/${service.name}.log`, JSON.stringify({ log, date }) + "||\n", err => {
    if (err) {
      console.error(err);
    }
  });
}

function saveErrorLogs(service, objectToSave) {
  const { log, date } = objectToSave;

  fs.existsSync(path.join(__dirname, 'logs')) || fs.mkdirSync(path.join(__dirname, 'logs'));

  fs.existsSync(path.join(__dirname, 'logs') + `/${service.name}.error.log`) || fs.writeFileSync(path.join(__dirname, 'logs') + `/${service.name}.error.log`, '');

  fs.appendFile(path.join(__dirname, 'logs') + `/${service.name}.error.log`, JSON.stringify({ log, date }) + "||\n", err => {
    if (err) {
      console.error(err);
    }
  });
}

function enviarServeis() {
  io.emit('actualitzar serveis', JSON.stringify(services.map(service => {
    return { id: service.id, name: service.name, state: service.state, logs: service.logs, errorLogs: service.errorLogs };
  })));
};

function checkServiceStatus(serviceName) {
  const service = services.find(service => service.name === serviceName);
  if (!service) {
    return 'not found';
  } else {
    let status = "funcionant";
    if (service.state === 'tancat') {
      status = "tancat";
    }
    return status;
  }
};

//ENDPOINTS

app.post('/login', (req, res) => {
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

app.get('/aulas', (req, res) => {
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

app.get('/aula/:id', (req, res) => {
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

app.post('/createAula', (req, res) => {
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

app.put('/updateAula/:id', (req, res) => {
  const { curs, classe, etapa } = req.body;
  const { id } = req.params;

  if (!curs || !classe || !etapa) {
    return res.status(400).send({ message: 'curs, classe i etapa són necessaris' });
  }

  const query = 'UPDATE aula SET curs = ?, classe = ?, etapa = ? WHERE id = ?';
  connexioBD.execute(query, [curs, classe, etapa, id], (err, results) => {
    if (err) {
      console.error('Error en la actualització a la base de dades: ' + err.stack);
      res.status(500).send('Error en la actualització a la base de dades');
      return;
    }

    if (results.affectedRows > 0) {
      res.status(200).send({ message: 'aula actualitzada correctament' });
    } else {
      res.status(404).send('aula not found');
    }
  });
});

app.delete('/deleteAula/:id', (req, res) => {
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

server.listen(PORT, () => {
  console.log(`Servidor en funcionament a http://localhost:${PORT}`);
});