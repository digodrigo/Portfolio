import {Outlet} from 'react-router-dom'
import './anota.scss'
import { useState } from 'react'
import jSon from './teste.json'

function salvar(a, b) {
    const x = {senha:a.value, servico:b.value}
    return x
}

function teste(){
        const [active, setActive] = useState("")

        const isFormVisible = (x) => {
            setActive(x);    
        }
    return (
       <>
       <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16" onClick={()=>isFormVisible("Aberto")}> 
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
                {jSon.tabela.map((tabela, index) =>
                    <tr key={index}>
                        <td>{tabela.senha}</td>
                        <td>{tabela.servico}</td>
                        <td onClick={(event) => {event.currentTarget.parentElement.remove();
                        }}>
                            <span className="material-symbols-outlined">
                                delete
                            </span>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
       </div>
       <div className={`formTable formTableCentro${active}`}>
        <p> Formulario de adição na lista</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16" id='fechaFormTable' onClick={()=>isFormVisible("Fechado")}>
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
        </svg>
        <form>
            <input type="text" id="senha" required autoComplete="off"/>
            <label htmlFor='senha'>Senha</label>
            <input type="text" id="serv" required/>
            <label htmlFor='serv'>Serviço</label>
            <input type='button' value="Enviar" onClick={()=>salvar(document.getElementById("senha"), document.getElementById("serv"))}/>
        </form>
       </div>
        <Outlet />
       </>
    )
}

export default teste