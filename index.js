import express from "express";
import bodyParser from "body-parser";
import {PythonShell} from 'python-shell';
import cors from 'cors';
const PORT = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.urlencoded({limit: '30mb',extended: true}));
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(cors());
app.post('/', async (req, res)=>{
    const data = req.body.file;
    try{
        const pyshell = new PythonShell('index.py');
        pyshell.send(data);
        pyshell.on('message', (message) => {
            res.status(200).json({output: message});
        });
    }catch(err){
        res.status(400).json({message: err.message});
    }
})
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));