import { useState } from 'react';

// Vacio: las rutas /api las reenvia el proxy de Vite (ver vite.config.js).
const API_BASE = '';

// Formulario de login. No sabe nada de Register: solo pide credenciales,
// llama al backend, y avisa hacia arriba (via props) si funciono o no.
function Login({ onAutenticado, onIrARegistro }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function handleSubmit(evento) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    fetch(`${API_BASE}/api/v1/auth/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('Email o contraseña incorrectos');
        }
        return respuesta.json();
      })
      .then((data) => {
        setEnviando(false);
        onAutenticado(data.access_token);
      })
      .catch((err) => {
        setEnviando(false);
        setError(err.message);
      });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="auth-form__titulo">Iniciar sesión</h2>

      <label className="auth-form__campo">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          required
        />
      </label>

      <label className="auth-form__campo">
        <span>Contraseña</span>
        <input
          type="password"
          value={password}
          onChange={(evento) => setPassword(evento.target.value)}
          required
        />
      </label>

      {error && <p className="auth-form__error">{error}</p>}

      <button type="submit" className="auth-form__boton" disabled={enviando}>
        {enviando ? 'Ingresando...' : 'Ingresar'}
      </button>

      <p className="auth-form__link">
        ¿No tenés cuenta?{' '}
        <button type="button" className="auth-form__link-boton" onClick={onIrARegistro}>
          Creá una
        </button>
      </p>
    </form>
  );
}

export default Login;
