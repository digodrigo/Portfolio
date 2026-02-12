import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Apresentacao from './App.jsx'
import Anota from './Anota.jsx'
import luaDark from './assets/luaDark.png'
import luaLight from './assets/luaLight.svg'
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import './index.scss'

let x = 0

function trocaCor(e){
  //Modo claro: Fonte preta, fundo branco com alguns elementos em cinza claro para destaque
  //Modo escuro: Fonte branca, fundo preto com alguns elementos em cinza levemente mais escuro para destaque
    if(x==0){
    document.documentElement.style.setProperty('--background', 'rgb(255, 255, 255)',);
    document.documentElement.style.setProperty('--fonte', 'black');
    e.currentTarget.children[0].attributes[0].value="iconLuaEsquerda";
    e.currentTarget.children[0].attributes[1].value="/src/assets/luaLight.png";
    x = 1
    }else if(x==1){
    document.documentElement.style.setProperty('--background', 'rgb(22, 22, 22)',);
    document.documentElement.style.setProperty('--fonte', 'white');
    e.currentTarget.children[0].attributes[0].value="iconLuaDireita";
    e.currentTarget.children[0].attributes[1].value="/src/assets/luaDark.png";
    x = 0
    }
}


function App1(){
    return (
  <BrowserRouter>

    <div className='header'>

      <div>
        <p>
        Bem vindo!
        </p>
        <div className='divModo'>
          <p>Modo:</p> <button className='tema' onClick={(e)=> trocaCor(e)}><img src={luaDark} className='iconLuaDireita'/></button>
        </div>
      </div>

      <div className="menu">
        <nav className='divModo'>
          <Link to='/'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-fill" viewBox="0 0 16 16">
              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
              <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
            </svg></Link>{" "}
          <Link to='/carteira'>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M240-126q-81 0-137.5-56.5T46-320v-320q0-81 56.5-137.5T240-834h480q81 0 137.5 56.5T914-640v320q0 81-56.5 137.5T720-126H240Zm33-527h420q26 0 50 6t45 17v-10q0-29-19.5-48.5T720-708H240q-29 0-48.5 19.5T172-640v13q23-13 48-19.5t53-6.5Zm-71 169 395 96q15 4 29.5.5T652-401l108-90q-11-17-28.5-26.5T693-527H273q-23 0-42 11.5T202-484Z"/></svg>
          </Link>{" "}
          <Link to='/senha'>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
              <path d="M280-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 151q-112 0-191.5-79.5T9-480q0-113 79-192t192-79q88 0 157.5 49.5T532-575h332l97 93-162 168-96-88-90 90-72-73h-8q-29 81-99 128.5T280-209Z"/>
            </svg>
          </Link>
        </nav>
      </div>

    </div>

    <div className='main'>
      <Routes>
        <Route index element={<Apresentacao/>} />
        <Route path='/carteira' element={<Anota/>}/>
        
      </Routes>
    </div>
  </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App1 />
  </StrictMode>,
)
