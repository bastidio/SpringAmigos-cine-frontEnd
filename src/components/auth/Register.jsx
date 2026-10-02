import { useState } from 'react';

// Vacio: las rutas /api las reenvia el proxy de Vite (ver vite.config.js).
const API_BASE = '';

// Formulario de registro. Igual que Login: pide datos, llama al backend,
// y avisa hacia arriba via props. El backend siempre crea el usuario con rol USER.
function Register({ onAutenticado, onIrALogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function handleSubmit(evento) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    fetch(`${API_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, nombre, apellido }),
    })
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('No se pudo crear la cuenta (el email puede ya estar registrado)');
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
      <h2 className="auth-form__titulo">Crear cuenta</h2>

      <label className="auth-form__campo">
        <span>Nombre de usuario</span>
        <input
          type="text"
          value={username}
          onChange={(evento) => setUsername(evento.target.value)}
          required
        />
      </label>

      <label className="auth-form__campo">
        <span>Nombre</span>
        <input
          type="text"
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          required
        />
      </label>

      <label className="auth-form__campo">
        <span>Apellido</span>
        <input
          type="text"
          value={apellido}
          onChange={(evento) => setApellido(evento.target.value)}
          required
        />
      </label>

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
        {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="auth-form__link">
        ¿Ya tenés cuenta?{' '}
        <button type="button" className="auth-form__link-boton" onClick={onIrALogin}>
          Iniciá sesión
        </button>
      </p>
    </form>
  );
}

export default Register;
