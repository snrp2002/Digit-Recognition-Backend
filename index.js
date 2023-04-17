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
app.post('/', async (req, res)=>{
    const encoded_b64 = req.body.file;
    try{
        const base64Data = encoded_b64.split(',')[1];
        const decodedData = Buffer.from(base64Data, 'base64');
        fs.writeFile('image.jpg', decodedData, (err) => {
            if (err) throw err;
        });
        const pythonProcess = spawn('python', ['./index.py']);
        pythonProcess.stdout.on('data', (data) => {
            res.status(200).json({output: data.toString()});
        });
        pythonProcess.stderr.on('data', (data) => {
            throw new Error(data);
        });
    }catch(err){
        res.status(400).json({message: err.message});
    }
})
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));