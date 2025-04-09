import express from 'express';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3022;

// Use the current working directory as the base path in the Docker container
const __dirname = path.resolve('/usr/src/app');

app.use(express.json());

function executeAgregationScript(temps, interval) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'scripts', 'agregation.py');

    if (!fs.existsSync(scriptPath)) {
      return reject(`Script not found: ${scriptPath}`);
    }

    const process = spawn('./venv/bin/python3', [scriptPath, interval, temps]);

    let output = '';
    let error = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(error);
      }
    });

    process.on('error', (err) => {
      reject(`Failed to start process: ${err.message} ~ ${err.stack}`);
    });
  });
}

// Define an endpoint to execute the script
app.post('/executeAgregation', async (req, res) => {
  const { temps, interval } = req.body;

  if (!temps || !interval) {
    return res.status(400).json({ error: 'Missing required parameters: temps and interval' });
  }

  try {
    const result = await executeAgregationScript(temps, interval);
    res.status(200).json({ success: true, output: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.toString() });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});