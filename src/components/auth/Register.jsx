import { useState } from 'react';
import RegisterForm from './RegisterForm';

// Vacio: las rutas /api las reenvia el proxy de Vite (ver vite.config.js).
const API_BASE = '';

// Componente padre del registro: es el unico que tiene estado y logica.
// Guarda lo que se escribe, llama al backend y avisa hacia arriba via props.
// El formulario en si lo dibuja RegisterForm (hijo).
// El backend siempre crea el usuario con rol USER.
function Register({ onAutenticado, onIrALogin }) {
  // Un solo estado con todos los campos del formulario.
  const [datos, setDatos] = useState({
    username: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // Sirve para todos los inputs: el name del input dice que campo cambio.
  // Se arma un objeto nuevo (spread) en vez de modificar el estado.
  function handleCambio(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  function handleSubmit(evento) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    fetch(`${API_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // El telefono es opcional: si quedo vacio se manda null.
      body: JSON.stringify({ ...datos, telefono: datos.telefono.trim() || null }),
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
    <RegisterForm
      datos={datos}
      error={error}
      enviando={enviando}
      onCambiar={handleCambio}
      onEnviar={handleSubmit}
      onIrALogin={onIrALogin}
    />
  );
}

export default Register;
