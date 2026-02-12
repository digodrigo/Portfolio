import sciel from './assets/sciel.jpg';
import react from './assets/logo-react-svgrepo-com.svg';
import sass from './assets/sass.jpg';
import img2 from './assets/Captura de tela 2025-11-18 113404.png';
import './app.scss';
import { Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';

function Name() {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
    >
      <SwiperSlide><img src="https://placehold.co/600x400" alt="" /></SwiperSlide>
      <SwiperSlide><img src="https://placehold.co/600x400" alt="" /></SwiperSlide>
      <SwiperSlide><img src="https://placehold.co/600x400" alt="" /></SwiperSlide>
    </Swiper>
  );
}

function Apresentacao() {
  return (
    <>
      <p className='animacao'>
          Olá, meu nome é Rodrigo e esse é um projeto de portfólio utilizando o React, estou aprendendo e esse é o meu primeiro projeto, tudo aqui será feito do zero para obter conhecimento e experiencia pratica de como se faz.
        </p>
        <img src={react} alt="logoReact" width='100px' className='reactLogo'/>
        <p>Bibliotecas usadas: Router, Swiper</p>
        <p>
          Fiz um card simples de uma personagem que eu gosto.
        </p>
        <div className='sciel'>
          <img src={sciel} className='scielImg' />
          <div className="cardText">
            <h1>Sciel</h1>
            <p>E esse é um textinho que n sei o nome</p>
          </div>
        </div>
        <div className="carrousel">
          <Name />
        </div>
    </>
  )
}

export default Apresentacao
