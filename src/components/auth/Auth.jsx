import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './Auth.css';
import logo from '../../assets/lumiere-logo.svg';




function Auth({ onAutenticado }) {
  const [modo, setModo] = useState('login'); 

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
