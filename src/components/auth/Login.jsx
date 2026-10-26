import { useState } from 'react';


const API_BASE = '';



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
      <h2 className="auth-form_titulo">Iniciar sesión</h2>

      <label className="auth-form_campo">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          required
        />
      </label>

      <label className="auth-form_campo">
        <span>Contraseña</span>
        <input
          type="password"
          value={password}
          onChange={(evento) => setPassword(evento.target.value)}
          required
        />
      </label>

      {error && <p className="auth-form_error">{error}</p>}

      <button type="submit" className="auth-form_boton" disabled={enviando}>
        {enviando ? 'Ingresando...' : 'Ingresar'}
      </button>

      <p className="auth-form_link">
        ¿No tenés cuenta?{' '}
        <button type="button" className="auth-form_link-boton" onClick={onIrARegistro}>
          Creá una
        </button>
      </p>
    </form>
  );
}

export default Login;
