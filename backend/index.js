import express, { json } from 'express';

const app = express();
const PORT = 3020;

import { createServer } from 'http';
import socketIo from 'socket.io';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import cors from 'cors';
import { spawn } from 'node:child_process';

app.use(json());
app.use(cors());

const server = createServer(app);
const io = socketIo(server);

const services = [];

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

server.listen(PORT, () => {
  console.log(`Servidor en funcionament a http://localhost:${PORT}`);
});