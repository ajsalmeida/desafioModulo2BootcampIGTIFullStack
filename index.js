import express from 'express';
import routerGrades from './routes/grades.js';
import { promises as fs } from 'fs';
import winston from 'winston';
const { readFile, writeFile } = fs;

global.arquivoJSON = "grades.json";

const { combine, timestamp, label, printf} = winston.format;
const myFormat = printf(({level, message, label, timestamp})=>{
    return `${timestamp} [${label}] ${level} : ${message} `;
});
global.logger = winston.createLogger({
    level: "silly",
    transports:[
        new (winston.transports.Console)(),
        new (winston.transports.File)({filename:"my-grades-api.log"})
    ],
    format:combine(
        label({label: "my-grades-api"}),
        timestamp(),
        myFormat
    )
});
const app = express();
app.use(express.json());

app.use("/grades",routerGrades);


app.listen(3337, async () => {
    try {
        await readFile(global.arquivoJSON);
    } catch (error) {
        const initialJson = {
            nextId: 49,
            grades: []
        }
        writeFile(global.arquivoJSON, JSON.stringify(initialJson)).then(() => {
            logger.info("API started and file created");
        }).catch(err => {
            logger.info(err);
        });
    }
    logger.info("API started");
});