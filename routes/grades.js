import express from "express";
const router = express.Router();
import { promises as fs } from 'fs';
const { readFile, writeFile } = fs;

router.post("/", async(request, response) => {
    try {
        let userRequest = request.body;//recebe o que foi enviado por post
        const grade = JSON.parse(await readFile(global.arquivoJSON));
        let time = new Date();
        userRequest = {id: grade.nextId++, ...userRequest,  timestamp: time}
        grade.grades.push(userRequest);//asiciona os dados enviados no arquivo grades.json
        await writeFile(global.arquivoJSON,JSON.stringify(grade));
        response.send(userRequest); //encerra a resposta e comunicação
    } catch (err) {
        response.status(400).send({error: err.message}); //mensagem de erro em json
    }
});

//get standard
router.get("/", async(request, response)=>{
    try {
        const data = JSON.parse(await readFile(global.arquivoJSON));
        response.send(data);
        response.send(`Aqui estão todos os registros`);
    } catch (err) {
        response.status(400).send({error: err.message}); //mensagem de erro em json
    }
});

//get por id
router.get("/fid/:id", async (request, response) => {
    try {
        const data = JSON.parse(await readFile(global.arquivoJSON));
        const grade = data.grades.find(grades => grades.id === parseInt(request.params.id));
        response.send(grade);    
    } catch (err) {
        response.status(400).send({error: err.message}); //mensagem de erro em json
    }
});

//notas por estudante e disciplina
router.get("/gps/:student/:subject", async(request, response) => {
    try {
        let studentP = (request.params.student);
        let subjectP = (request.params.subject);
        let valueSum = 0;
        const data = JSON.parse(await readFile(global.arquivoJSON));
        const busca = data.grades.filter(grades => {
            if(grades.student === studentP && grades.subject === subjectP){
                valueSum+=grades.value;
                console.log(grades.student);
                console.log(grades.subject);
                console.log(grades.value);
            }
        });
        response.send(`Soma das notas de ${studentP} na disciplina ${subjectP}: ${valueSum}`);
    } catch (err) {
        response.status(400).send({error: err.message}); //mensagem de erro em json
    }
});

//media das disciplinas por tipo
router.get("/gos/:subject/:type", async(request, response) => {
    try {
        let subjectP = (request.params.subject);
        let typeP = (request.params.type);
        let valueMedia = 0;
        let acc = 0;
        const data = JSON.parse(await readFile(global.arquivoJSON));
        const busca = data.grades.filter(grades => {
            if(grades.subject === subjectP && grades.type === typeP){
                valueMedia+=grades.value;
                acc++;
            }
        });
        valueMedia=valueMedia/acc;
        response.send(`Média da disciplina ${subjectP}, tipo ${typeP}: ${valueMedia}`);
    } catch (err) {
        response.status(400).send({error: err.message}); //mensagem de erro em json
    }
});
//3 maiores notas de cada disciplina por tipo
router.get("/bos/:subject/:type", async(request, response) => {
    try {
        let subjectP = (request.params.subject);
        let typeP = (request.params.type);
        let grade = [];
        const data = JSON.parse(await readFile(global.arquivoJSON));
        const busca = data.grades.filter(grades => {
            if(grades.subject === subjectP && grades.type === typeP){
                grade.push(grades.value);
                grade.sort(function(a, b){return b-a});//ordena os valores numéricos do array em ordem 
            }
        });
        let sliced = grade.slice(0,3);
        response.send(sliced);
    } catch (err) {
        response.status(400).send({error: err.message}); //mensagem de erro em json
    }
});
//deleta uma entrada por um id
router.delete("/:id", async (request, response) => {
    try {
        console.log(request.params.id)
        const data = JSON.parse(await readFile(global.arquivoJSON));
        data.grades = data.grades.filter(
            grade => grade.id !== parseInt(request.params.id));//filtra todos que não sejam o id enviado
        await writeFile(global.arquivoJSON, JSON.stringify(data));//escreve todos os registros diferentes do que foi passado no arquivo
        response.send(`Registro com Id ${request.params.id} deletado`);
    } catch (error) {
        response.status(400).send({error: err.message});
    }
});

//atualizando um grade
router.put("/", async (request, response) => {
    try {
        const grade = request.body; //novos dados
        const data = JSON.parse(await readFile(global.arquivoJSON));
        const index = data.grades.findIndex(a => a.id  === grade.id);//verificando qual registro corresponde ao que foi repassado (id)
        data.grades[index] = grade;//a posição do index principal é atuaizada com os novos dados
        await writeFile(global.arquivoJSON, JSON.stringify(data));//atualiza os registros no arquivo json
        response.send(`Registro ${grade.id} atualizado com sucesso`);
    } catch (error) {
        response.status(400).send({error: err.message});
    }
});

export default router;
