import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ProfileHeader from '../components/perfil/ProfileHeader';
import PersonalInfoForm from '../components/perfil/PersonalInfoForm';
import SecurityForm from '../components/perfil/SecurityForm';
import ProfileActions from '../components/perfil/ProfileActions';

// Un JWT son tres partes separadas por puntos; la del medio (payload) es un
// JSON en base64url. No se verifica la firma: eso lo hace el backend.
function decodificarToken(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    // atob devuelve bytes sueltos; este paso los arma como UTF-8 para que
    // caracteres con tilde no salgan rotos.
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// El backend (JwtService) firma el token con sub = email, iat y exp.
// exp viene en segundos; Date.now() en milisegundos.
function tokenValido(datos) {
  return datos !== null && typeof datos.sub === 'string' && datos.exp * 1000 > Date.now();
}

// Texto del badge segun el enum Rol del backend (ADMIN o USER).
function etiquetaDeRol(rol) {
  return rol === 'ADMIN' ? 'Administrador' : 'Cliente';
}

// Vista padre de "Mi Perfil": lee el token, junta los datos del usuario y se
// los pasa a cada seccion por props. Si no hay token valido, manda al login.
// El token solo trae el email; username y rol llegan en la respuesta del
// login y App los pasa en "usuario".
function ProfileView({ token, usuario, cerrarSesion }) {
  const navigate = useNavigate();
  const [entradasActivas, setEntradasActivas] = useState(0);

  const datos = token ? decodificarToken(token) : null;
  const sesionValida = tokenValido(datos);

  // GET /entradas/mis-entradas necesita el token. Se cuentan como activas
  // las entradas de funciones que todavia no pasaron.
  useEffect(() => {
    if (!sesionValida) return;

    fetch('/entradas/mis-entradas', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar las entradas');
        }
        return respuesta.json();
      })
      .then((entradas) => {
        const ahora = new Date();
        setEntradasActivas(entradas.filter((entrada) => new Date(entrada.horario) > ahora).length);
      })
      .catch(() => {
        setEntradasActivas(0);
      });
  }, [token, sesionValida]);

  if (!sesionValida) {
    return <Navigate to="/login" replace />;
  }

  const email = datos.sub;
  const nombreUsuario = usuario?.username ?? email.split('@')[0];
  const rol = usuario?.rol ?? 'USER';

  const irAMisEntradas = () => {
    navigate('/mis-entradas');
  };

  return (
    <main className="pagina">
      <div className="mx-auto flex max-w-[470px] flex-col gap-6 px-4 py-8">
        <h1 className="text-3xl font-bold [font-family:var(--titulos)]">Mi Perfil</h1>

        <ProfileHeader
          nombre={nombreUsuario}
          email={email}
          rol={etiquetaDeRol(rol)}
          entradasActivas={entradasActivas}
        />

        {/* Sin onGuardar ni onCambiarPassword los formularios quedan de solo
            lectura: el backend todavia no tiene endpoints para editar el
            usuario ni para cambiar la contrasena. */}
        <PersonalInfoForm nombreUsuario={nombreUsuario} email={email} />

        <SecurityForm />

        <ProfileActions onMisEntradas={irAMisEntradas} onCerrarSesion={cerrarSesion} />
      </div>
    </main>
  );
}

export default ProfileView;
