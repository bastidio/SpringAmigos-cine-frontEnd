import Auth from '../components/auth/Auth';

// Vista de ingreso (URL "/login"). Solo renderiza el componente Auth, que
// alterna entre el formulario de login y el de registro.
const Login = ({ onAutenticado }) => {
  return <Auth onAutenticado={onAutenticado} />;
};

export default Login;
