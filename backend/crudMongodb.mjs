import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { Db } from 'mongodb';
import joi from 'joi';

const {Schema} = mongoose;

const app = express();

app.use(cors());

app.use(express.json());

app.listen(3000, ()=>{
    console.log('Banco conectado');
})

//Cada Schema mapeia para uma coleção no mongodb e define a forma dos documentos dentro dessa coleção
const porfolioSenhas = new mongoose.Schema({
    email: {
        type: String
    },
    senha: {
        type: String,
        required: true,
        trim: 1, //Remove espaço em branco no inicio e fim.
       
    },
    tipo: {
        type: String,
        enum: ['Jogos', 'Streaming', 'Email', 'Serviços'],
        required: true
    },
    servico: {
        type: String,
        required: true,
    }
}, { collection: 'portfolio' });
//Pelo que eu entendi a linha acima força o mongoose a utilizar a colection

const middlewareTeste = function (req, res, next){
    const schema = joi.object({//validação com a biblioteca joi
        email: joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: false } })
            .required(),
        senha: joi.string()
            .alphanum()
            .required(),
        tipo: joi.string().valid('Jogos', 'Streaming', 'Email').required(),

        servico: joi.string().required(),
    })

    const salvar = schema.validate(req.body);
    if (salvar.error){
        return res.status(400).json(salvar);
    }
    next();
} 

await mongoose.connect('mongodb://127.0.0.1:27017/admin');
const senha = mongoose.model("portfolio", porfolioSenhas);

app.post("/carteira", middlewareTeste, async (req,res)=>{//se eu entendi o middlewareTeste vai ser chamado sempre que tiver uma req post nova e vai executar a função  
    try{//try como o nome ja diz vai tentar realizar os comandos que estão dentro do bloco e caso falhe vai cair no catch
        const novaSenha = new senha(req.body); //req.body recebe os dados que vieram do front-end
        await novaSenha.save();
        res.status(201).json({mensagem:"Dados salvos com sucesso!"});//res.status vai ser acionado quando o status da req for 201 e vai mandar o .json() para o frontend        
    }catch (err){
        res.status(500).json({mensagem:"Dados NÃO salvos com sucesso!"})
    }
})

app.get("/carteira", async (req,res)=>{
    const pagina = parseInt(req.query.pagina) || 1; //req.query vai pegar o parâmetro enviado após uma "?"
    const limite = 5;
    const pular = (pagina - 1) * limite;
    try{
        const buscarDados = await senha.find().skip(pular).limit(limite);
        const dadosTotal = await senha.countDocuments(); //countDocuments vai contar quantos documentos tem no banco
        const paginaTotal = Math.ceil(dadosTotal / limite); //caso seja necessário vai arredondar o resultado da conta para cima
        res.status(200).json({
            dados:buscarDados,
            paginas:paginaTotal,
            paginaAtual: pagina
        })
    }catch{
        console.log("Deu erro na busca de dados");
        res.status(500).json({mensagem: "Erro"})
    }
})

app.get("/carteira/filtro", async (req, res)=>{
    try {
        const resultadoFiltrado = await senha.aggregate([{
            $group:{
            _id:"$tipo",
            quantidade:{$sum:1}  
            },
        },
        {
            $sort: {_id:1}
        }
    ])
        res.status(200).json(resultadoFiltrado)        
    } catch (error) {
        res.status(500).json({mensagem: "Erro na filtragem"})
    }

})

app.delete("/carteira/:id", async (req,res)=>{
    try {    
        const idDadosDeletar = req.params.id;
        const reqDadosDeletar = await senha.findByIdAndDelete(idDadosDeletar);
        res.status(200).json(reqDadosDeletar)       
    } catch {
        
    }
})

app.put("/carteira/:id", async (req,res)=>{
    try{       
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

/*
app.get("/carteira/filtro/:tag", async (req, res)=>{
    try {
        const filtro = req.params.tag;
        
        const resultadoFiltrado = await senha.aggregate([{
            $match:{
            tipo: filtro  
            }
        }])
        res.status(200).json(resultadoFiltrado)        
    } catch (error) {
        res.status(500).json({mensagem: "Erro na filtragem"})
    }

})*/