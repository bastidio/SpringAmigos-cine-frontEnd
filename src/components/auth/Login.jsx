import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/usuarioSlice';



function Login({ onIrARegistro }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { loading: enviando } = useSelector((state) => state.usuario);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit(evento) {
    evento.preventDefault();
    setError(null);

    const res = await dispatch(login({ email, password }));
    if (!res.error) {
      navigate(res.payload.rol === 'ADMIN' ? '/admin/dashboard' : '/');
    } else {
      setError('Email o contraseña incorrectos');
    }
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
