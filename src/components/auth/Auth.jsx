import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './Auth.css';
import logo from '../../assets/lumiere-logo.svg';

// Componente padre: decide (con estado propio) si se muestra Login o
// Register. Cuando cualquiera de los dos hijos consigue un token, avisa
// hacia arriba con onAutenticado, que viene de App.jsx por props.
function Auth({ onAutenticado }) {
  const [modo, setModo] = useState('login'); // 'login' | 'registro'

  return (
    <div className="auth">
      <div className="auth_marca">
        <img className="auth_emblema" src={logo} alt="" />
        <h1 className="auth_logo">LUMIÈRE</h1>
        <p className="auth_logo-sub">CINE</p>
      </div>

      <div className="auth_panel">
        {modo === 'login' ? (
          <Login
            onAutenticado={onAutenticado}
            onIrARegistro={() => setModo('registro')}
          />
        ) : (
          <Register
            onAutenticado={onAutenticado}
            onIrALogin={() => setModo('login')}
          />
        )}
      </div>
    </div>
  );
}

export default Auth;
