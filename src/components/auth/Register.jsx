import { useState } from 'react';
import RegisterForm from './RegisterForm';


const API_BASE = '';





function Register({ onAutenticado, onIrALogin }) {
  
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
