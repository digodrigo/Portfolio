import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { Db } from 'mongodb';

const {Schema} = mongoose;

const app = express();

app.use(cors());

app.use(express.json());

app.listen(3000, ()=>{
    console.log('Banco conectado');
})

//Cada Schema mapeia para uma coleção no mongodb e define a forma dos documentos dentro dessa coleção
const porfolioSenhas = new Schema({
    senha: String,
    servico: String
}, { collection: 'portfolio' });
//Pelo que eu entendi a linha acima força o mongoose a utilizar a colection


await mongoose.connect('mongodb://127.0.0.1:27017/admin');
const senha = mongoose.model("portfolio", porfolioSenhas);


app.post("/carteira", async (req,res)=>{ 
    //try como o nome ja diz vai tentar realizar os comandos que estão dentro do bloco e caso falhe vai cair no catch
    try{
        const novaSenha = new senha(req.body);
        await novaSenha.save();
        res.status(201).json({mensagem:"Dados salvos com sucesso!"})
    }catch{
        res.status(500).json({mensagem:"Dados NÃO salvos com sucesso!"})
    }
    //req.body recebe os dados que vieram do front-end

})

app.get("/carteira", async (req,res)=>{
    try{
        const buscarDados = await senha.find();
        res.status(200).json(buscarDados)
    }catch{
        console.log("Deu erro na busca de dados");
        res.status(500).json({mensagem: "Erro"})
    }
})

app.delete("/carteira/:id", async (req,res)=>{
    try {    
        const idDadosDeletar = req.params.id;
        const reqDadosDeletar = await senha.findOneAndDelete(idDadosDeletar);
        res.status(200).json(reqDadosDeletar)       
    } catch {
        
    }
})

app.put("/carteira/:id", async (req,res)=>{
    try{
        console.log("cheguei aqui");
        console.log(req.params.id);
        
        const idDadosAlterar = req.params.id; //Pega o id enviado via URL
        const dadosAlterar = req.body;
        const reqDadosAlterar = await senha.findByIdAndUpdate(idDadosAlterar, dadosAlterar, {new:true});
        res.status(200).json(reqDadosAlterar);
        if(!reqDadosAlterar){
            return res.status(404).json({mensagem:"Id não cadastrado"})
        }
    }catch{
        res.status(500).json({mensagem:"Falha ao editar o item"})
    }
})
