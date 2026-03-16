import {Outlet} from 'react-router-dom';
import './anota.scss';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useState, useEffect } from 'react'
import { log10 } from 'chart.js/helpers';
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.defaults.font.size = 18;

function teste(){
    const [active, setActive] = useState("");

    const [graficoView, setGraficoView] = useState("");

    const [resultadoReq, setResultadoReq] = useState("");

    const [dadosBD, setDadosDB] = useState([]);

    const [inputSenha, setInputSenha] = useState("");

    const [inputServico, setInputServico] = useState("");

    const [idTabela, setIdTabela] = useState("");

    const [botaoEditar, setBotaoEditar] = useState("");

    const [inputEspecifico, setInputEspecifico] = useState("");
    
    const [dadosAggregate, setDadosAggregate] = useState([]);

    const [pagina, setPagina] = useState(1);

    const [paginaTotal, setPaginaTotal] = useState()

    const dadosNomeFiltrados = dadosAggregate.map(nomes=>nomes._id);

    const dadosQntFiltrados = dadosAggregate.map(qnt=>qnt.quantidade);

    

    const grafico = {
        responsive: true,
        labels: dadosNomeFiltrados,
        datasets:[
            {
                label: 'N° de contas',
                data: dadosQntFiltrados,
                backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
            },
        ]
    }

    async function buscaDados() {
        try {
            const buscarDados = await fetch(`http://localhost:3000/carteira?pagina=${pagina}`, {//Manda uma requisição Get para a rota definida (OBS: caso queira passar algo na url pro express pegar é só colocar na url do fetch, NÃO na url do express)
                method: "GET" 
            })
            const dadosGet = await buscarDados.json();
            setDadosDB(dadosGet.dados);
            const testeArray = Array.from({length:dadosGet.paginas}, (_, index)=>index+1);//pra mim esse comando ainda é magica, eu entendi até p length, depois disso não entendi mais nada
            setPaginaTotal(testeArray);    
        } catch {
            console.log("Erro na busca de dados");
        }
    };

    async function salvar(inputValSenha, inputValServico , inputValEspecifico) {
        let arrayEnviar = { senha: inputValSenha, tipo: inputValServico, servico: inputValEspecifico};
        setInputSenha("");
        setInputServico("");
        setInputEspecifico("");
        try {
            const requestFetch = await fetch("http://localhost:3000/carteira", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(arrayEnviar)
            });
            const resultado = await requestFetch.json()
            if (requestFetch.status == 201) {
                setResultadoReq("Sucesso")
                setTimeout(()=>{
                    setResultadoReq("");
                }, 2000)
                buscaDados();
            } else {
                setResultadoReq("Falha")
                setTimeout(()=>{
                    setResultadoReq("");
                }, 2000)
            }
        } catch {
            console.log("Deu erro");
        }
    };

    async function deletar(idItem) { 
        console.log(idItem);
        
        try {
            const deletarDados = await fetch(`http://localhost:3000/carteira/${idItem}`, {
                method: "DELETE"
            });
            if (deletarDados.status == 200) {
                const atualizarLista = dadosBD.filter((senhas) => {
                    const idParaString = String(idItem);
                    return senhas._id !== idParaString;
                });
                console.log(atualizarLista);
                
                setDadosDB(atualizarLista)
            }
        } catch {
            console.log("Erro na busca de dados");
        }
    }

    function editar(tabelaSenha, tabelaServico, idItem) {
        setActive("Aberto");
        setBotaoEditar("Editando");
        setInputSenha(tabelaSenha);
        setInputServico(tabelaServico);
        setIdTabela(idItem);
    };

    async function enviarEditar(idItem, tabelaSenha, tabelaServico, tabelaEspecifico) {
        let arrayEditado = {senha: tabelaSenha, tipo: tabelaServico, servico: tabelaEspecifico};
        try {
            const requestFetch = await fetch(`http://localhost:3000/carteira/${idItem}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(arrayEditado)
            });
            if (requestFetch.status == 201) {
                setResultadoReq("Sucesso")
                setTimeout(()=>{
                    setResultadoReq("");
                }, 2000)
                buscaDados();
            } else {
                setResultadoReq("Falha")
                setTimeout(()=>{
                    setResultadoReq("");
                }, 2000)
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

    async function filtro() {
        try {
            const buscarDadosFiltrados = await fetch(`http://localhost:3000/carteira/filtro`, {
                method: "GET"
            })
            const dadosFiltrados = await buscarDadosFiltrados.json();
            setDadosAggregate(dadosFiltrados);
        } catch (error) {
            
        }
    }

    function abrirEAtualizarGrafico(comp) { //nome auto-explicativo
        filtro();
        setGraficoView(comp)
    }

    function historico(params) {
        setPagina(params);
        const url = `/carteira?pagina=${params}`;
        window.history.pushState({path:url}, "", url); //isso aqui só é visual, não envia nada ao express.
    }

    useEffect(() => {
        buscaDados();
        filtro();
    }, [pagina]);//o useEffect vai carregar as funções declaradas dentro dos {} sempre que o que estiver dentro do [] for alterado.

    return (
        <><div className="vault">
            <div className="tabela">
                <div className='botoesForm'>
                    <div className="botaoAbrirForm" onClick={() => setActive("Aberto")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" id='abrirForm' className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                        </svg>
                        <p>Adicionar</p>
                    </div>
                    <div className="botaoAbrirEstatistica" onClick={() => abrirEAtualizarGrafico("Aberto")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-clipboard-data-fill" viewBox="0 0 16 16">
                            <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z" />
                            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5zM10 8a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zm-6 4a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm4-3a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1" />
                        </svg>
                        <p>Estatistica</p>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr className='trHeader'>
                            <th>Senha</th>
                            <th>Tipo</th>
                            <th>Serviço</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dadosBD.map((tabela) =>
                            <tr key={tabela._id}>
                                <td>{tabela.senha}</td>
                                <td>{tabela.tipo}</td>
                                <td>{tabela.servico}</td>
                                <td>
                                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => editar(tabela.senha, tabela.servico, tabela._id)} width="35" height="35" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
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
                <div className="formTextos">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16" onClick={() => fecharTabela()}>
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg> 
                    <p> Formulario de adição na lista</p>                   
                </div>
                <form>
                    <input type="text" id="senha" value={inputSenha} onChange={(e) => setInputSenha(e.target.value)} required autoComplete="off" />
                    <label htmlFor='senha'>Senha</label>
                    <select name="serv" id="serv" value={inputServico} onChange={(e) => setInputServico(e.target.value)} required>
                        <option value=""></option>
                        <option value="Jogos">Jogos</option>
                        <option value="Streaming">Streaming</option>
                        <option value="Email">Email</option>
                        <option value="Serviços">Serviços</option>
                    </select>
                    <label htmlFor='serv'>Serviço</label>
                    {inputServico !== "" && (
                        <input type="text" id='especifico' value={inputEspecifico} onChange={(e) => setInputEspecifico(e.target.value)} />
                    )}
                    {inputServico !== "" && (
                        <label htmlFor='especifico'>{inputServico}</label>
                    )}
                    {botaoEditar === "" && (
                        <input type='button' value="Enviar" onClick={() => salvar(inputSenha, inputServico, inputEspecifico)} />
                    )}
                    {botaoEditar === "Editando" && (
                        <input type='button' value="Editar" onClick={() => enviarEditar(idTabela, inputSenha, inputServico)} />
                    )}
                </form>
                {resultadoReq !== "" && (
                    <div className={resultadoReq}>
                        <p>{`${resultadoReq}ao adicionar senha`}</p>
                    </div>
                )}
            </div>
            <div className={`divGrafico divGrafico${graficoView}`}>
                <div className="divCanvas">
                    <Pie data={grafico} />
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-x-circle fechaDivGrafico" viewBox="0 0 16 16" onClick={() => setGraficoView("Fechado")}>
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                </div>
            </div>
            {!!paginaTotal &&( //short-circuit para que os elementos abaixos só sejam renderizados quando a condicional for true
                <footer className="divPaginas">
                    {paginaTotal.map((numero, intex)=>
                        <p key={numero} onClick={()=>historico(numero)}>{numero}</p>
                    )}
                </footer>
            )}
            <Outlet />            
        </div>

        </>
    )
}

export default teste