import {Outlet} from 'react-router-dom'
import './anota.scss'
import { useState, useEffect } from 'react'

function teste(){
    const [active, setActive] = useState("");

    const [resultadoReq, setResultadoReq] = useState("");

    const [getPosts, getGet] = useState([]);

    const [inputSenha, setInputSenha] = useState("");

    const [inputServico, setInputServico] = useState("");

    const [idTabela, setIdTabela] = useState("")

    const isFormVisible = (x) => {
        setActive(x);
    };

    const [botaoEditar, setBotaoEditar] = useState("");

    async function buscaDados() {
        try {
            const buscarDados = await fetch("http://localhost:3000/carteira", {
                method: "GET"
            })
            const dadosGet = await buscarDados.json()
            getGet(dadosGet)
        } catch {
            console.log("Erro na busca de dados");
        }
    };

    async function salvar(a, b) {
        let y = { senha: a.value, servico: b.value };
        setInputSenha("");
        setInputServico("");
        try {
            const requestFetch = await fetch("http://localhost:3000/carteira", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(y)
            });
            const resultado = await requestFetch.json()
            console.log("resultado da requisição", requestFetch.status);
            if (requestFetch.status == 201) {
                setResultadoReq("Dados salvos com sucesso")
                setTimeout(()=>{
                    setResultadoReq("");
                }, 2000)
                buscaDados();
            } else {
                const createDivFail = document.createElement("div");
                createDivFail.classList.add("falha");
                createDivFail.innerText = "Erro ao enviar o formulario", requestFetch.status;
                document.getElementById("divFormAdd").appendChild(createDivFail);
            }
        } catch {
            console.log("Deu erro");
        }
    };

    async function deletar(idItem) {
        try {
            const deletarDados = await fetch(`http://localhost:3000/carteira/${idItem}`, {
                method: "DELETE"
            });
            if (deletarDados.status == 200) {
                console.log("entrei no if");
                const atualizarLista = getPosts.filter((senhas) => {
                    const idParaString = String(idItem);
                    return senhas._id !== idParaString;
                });
                getGet(atualizarLista)
            }
        } catch {
            console.log("Erro na busca de dados");
        }
    };

    function editar(tabelaSenha, tabelaServico, idItem) {
        setActive("Aberto");
        setBotaoEditar("Editando");
        setInputSenha(tabelaSenha);
        setInputServico(tabelaServico);
        setIdTabela(idItem);
    };

    async function enviarEditar(idItem, tabelaSenha, tabelaServico) {
        let y = {senha: tabelaSenha, servico: tabelaServico};
        console.log(y);
        console.log(idItem);
        try {
            const requestFetch = await fetch(`http://localhost:3000/carteira/${idItem}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(y)
            });
            if(requestFetch.status===200){
                
            }
        } catch {

        }
    }

    function fecharTabela() {
        setActive("Fechado");
        setInputSenha("");
        setInputServico("");
        setBotaoEditar("");
        setIdTabela("");
    }

    useEffect(() => {
        buscaDados()
    }, []);

    return (
        <>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" id='abrirForm' className="bi bi-plus-circle-fill" viewBox="0 0 16 16" onClick={() => setActive("Aberto")}>
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                </svg>
                <table>
                    <thead>
                        <tr className='trHeader'>
                            <th>Senha</th>
                            <th>Serviço</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getPosts.map((tabela) =>
                            <tr key={tabela._id}>
                                <td>{tabela.senha}</td>
                                <td>{tabela.servico}</td>
                                <td>
                                    <svg xmlns="http://www.w3.org/2000/svg" onClick={()=> editar(tabela.senha, tabela.servico, tabela._id)} width="35" height="35" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => deletar(tabela._id)} width="35" height="35" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                    </svg>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div id='divFormAdd' className={`formTable formTableCentro${active}`}>
                <p> Formulario de adição na lista</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16" id='fechaFormTable' onClick={() => fecharTabela()}>
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>
                <form>
                    <input type="text" id="senha" value={inputSenha} onChange={(e)=>setInputSenha(e.target.value)} required autoComplete="off" />
                    <label htmlFor='senha'>Senha</label>
                    <input type="text" id="serv" value={inputServico} onChange={(e)=>setInputServico(e.target.value)} required />
                    <label htmlFor='serv'>Serviço</label>
                    {botaoEditar === "" &&(
                        <input type='button' value="Enviar" onClick={() => salvar(document.getElementById("senha"), document.getElementById("serv"))} />                        
                    )}
                    {botaoEditar === "Editando" &&(
                        <input type='button' value="Editar" onClick={() => enviarEditar(idTabela, inputSenha, inputServico)} /> 
                    )}
                </form>
                {resultadoReq !== "" && (
                    <div className='sucess'>
                        {resultadoReq}
                    </div>
                )}
            </div>
            <Outlet />
        </>
    )
}

export default teste