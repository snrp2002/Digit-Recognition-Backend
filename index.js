import express from "express";
import bodyParser from "body-parser";
import {spawn} from 'child_process';
import cors from 'cors';
const PORT = process.env.PORT || 5000;
import fs from 'fs';
const app = express();
app.use(bodyParser.urlencoded({limit: '30mb',extended: true}));
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(cors());
app.post('/', async (req, res) => {
  const encoded_b64 = req.body.file;
  try {
    const base64Data = encoded_b64.split(',')[1];
    const decodedData = Buffer.from(base64Data, 'base64');
    await new Promise((resolve, reject) => {
      fs.writeFile('image.jpg', decodedData, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    const pythonProcess = spawn('python', ['./index.py'], {
        env: {
            PYTHONPATH: process.env.PYTHONPATH,
            pythonPath: '/path/to/python/executable',
        }
    });
    const output = await new Promise((resolve, reject) => {
      let data = '';
      pythonProcess.stdout.on('data', (chunk) => {
        data += chunk;
      });
      pythonProcess.stderr.on('data', (err) => {
        reject(err.toString());
      });
      pythonProcess.on('close', (code) => {
        if (code !== 0) reject(`Python process exited with code ${code}`);
        else resolve(data);
      });
    });
    console.log(output);
    res.status(200).json({ output: output });
  } catch (err) {
    res.status(400).json({ message: err});
  }
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));