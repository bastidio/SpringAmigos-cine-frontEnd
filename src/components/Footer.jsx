import { Link } from 'react-router-dom';
import logo from '../assets/lumiere-logo.svg';
import logotipo from '../assets/lumiere-logotipo.png';
import './Footer.css';


const Footer = () => {

  return (
    <footer className="footer">
      <div className="footer_contenido">
        <div className="footer_marca">
          <Link to="/" className="footer_logos" aria-label="Lumière Cine, ir al inicio">
            <img className="footer_logo" src={logo} alt="" />
            <img className="footer_logotipo" src={logotipo} alt="Lumière Cine" />
          </Link>
          <p className="footer_lema">Viví cada función como si fuese la primera.</p>
        </div>

        <nav className="footer_columna" aria-label="Explorar">
          <h3 className="footer_titulo">Explorar</h3>
          <Link to="/" className="footer_link">Cartelera</Link>
          <Link to="/kiosco" className="footer_link">Kiosco</Link>
        </nav>

        <nav className="footer_columna" aria-label="Mi cuenta">
          <h3 className="footer_titulo">Mi cuenta</h3>
          <Link to="/perfil" className="footer_link">Mi perfil</Link>
          <Link to="/mis-entradas" className="footer_link">Mis entradas</Link>
          <Link to="/carrito" className="footer_link">Carrito</Link>
        </nav>
      </div>

      <div className="footer_base">
        <p>© 2026 Lumière Cine. Todos los derechos reservados.</p>
        <p>Hecho por SpringAmigos</p>
      </div>
    </footer>
  );
};

export default Footer;
