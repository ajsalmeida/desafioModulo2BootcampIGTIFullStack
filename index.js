import express from 'express';
import routerGrades from './routes/grades.js';
import { promises as fs } from 'fs';
const { readFile, writeFile } = fs;

global.arquivoJSON = "grades.json";

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
            console.log("API started and file created");
        }).catch(err => {
            console.log(err);
        });
    }
    console.log("API started");
});