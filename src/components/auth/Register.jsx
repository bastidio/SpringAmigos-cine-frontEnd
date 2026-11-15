import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import { register } from '../../redux/usuarioSlice';





function Register({ onIrALogin }) {
  
  const [datos, setDatos] = useState({
    username: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const { loading: enviando } = useSelector((state) => state.usuario);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  
  function handleCambio(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setError(null);

    // Teléfono vacío viaja como null. Registrarse deja la sesión iniciada.
    const res = await dispatch(register({ ...datos, telefono: datos.telefono.trim() || null }));
    if (!res.error) {
      navigate(res.payload.rol === 'ADMIN' ? '/admin/dashboard' : '/');
    } else {
      setError('No se pudo crear la cuenta (el email puede ya estar registrado)');
    }
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
