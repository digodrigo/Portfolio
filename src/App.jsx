import onChange from './assets/onchange.jpg';
import react from './assets/logo-react-svgrepo-com.svg';
import swipper from './assets/swipper.jpg';
import param from './assets/param.jpg';
import './app.scss';
import { Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';

function Name() {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
    >
      <SwiperSlide><img src={onChange} alt="" /></SwiperSlide>
      <SwiperSlide><img src={param} alt="" /></SwiperSlide>
      <SwiperSlide><img src={swipper} alt="" /></SwiperSlide>
    </Swiper>
  );
}

function Apresentacao() {
  return (
    <>
      <p className='animacao'>
          Olá, meu nome é Rodrigo Nascimento dos Santos e esse é um projeto de portfólio utilizando o React, estou aprendendo como utilizar essa tecnologia e seus diversos pacotes. 
          Esse é o meu primeiro Portfólio, tudo aqui será feito do zero para obter conhecimento e experiencia pratica de como se faz.
        </p>
        <img src={react} alt="logoReact" width='100px' className='reactLogo'/>
        <p>Pacotes Utilizados: Router, Express, Mongoose, Swipper.</p>
        <h1>Utilização de LLM</h1>
        <p>Estou utilizando o Gemini do Google apenas para tirar dúvidas sobre comandos (Imagem 1 e 2) e pacotes que posso utilizar(Imagem 3)</p>
        <div className="carrousel">
          <Name />
        </div>
    </>
  )
}

export default Apresentacao
