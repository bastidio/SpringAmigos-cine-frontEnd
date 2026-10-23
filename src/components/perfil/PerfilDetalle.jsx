import { useEffect, useState } from 'react';
import PerfilLayout from './PerfilLayout';
import PerfilHeader from './PerfilHeader';
import DatosPersonales from './DatosPersonales';
import AccionesPerfil from './AccionesPerfil';
import Spinner from './Spinner';
import MensajeError from './MensajeError';

// Componente padre del perfil: es el unico que tiene estado y logica.
// Le pide los datos del usuario al backend, maneja usuario/loading/error y
// se los pasa a los hijos por props.
const PerfilDetalle = ({ token, onLogout, onIrAEntradas }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // MONTAJE: un unico GET. PerfilMenu monta este componente cada vez que se
  // abre el desplegable, asi que los datos se piden frescos en cada apertura.
  // En el array de dependencias va token: mientras esta montado no cambia
  // (al cerrar sesion App lo desmonta).
  useEffect(() => {
    const controller = new AbortController();

    const cargarPerfil = async () => {
      try {
        // Ruta relativa: el proxy de Vite la reenvia al back (vite.config.js).
        const res = await fetch('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        // fetch solo rechaza la promesa si falla la conexion. Si el back
        // responde con un error (401, 404, 500...), hay que mandarlo al catch a mano.
        if (!res.ok) {
          throw new Error(`Error ${res.status} al cargar el perfil`);
        }

        const data = await res.json();
        setUsuario(data);
      } catch (err) {
        // Si se cancelo por el desmontaje, no es un error real: se ignora.
        if (err.name === 'AbortError') {
          return;
        }
        // El throw de arriba, o fallo la red.
        setError(err.message);
      } finally {
        // Si se cancelo, el componente ya no esta: no se toca su estado.
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    cargarPerfil();

    // DESMONTAJE: si el componente se va antes de que llegue la respuesta,
    // se cancela la peticion.
    return () => controller.abort();
  }, [token]);

  // ACTUALIZACION: cada setUsuario/setLoading/setError de arriba hace que
  // React vuelva a renderizar con el estado nuevo. El efecto solo depende de
  // token, asi que actualizar NO dispara otro GET: se refresca solo con lo
  // que ya tiene guardado.

  if (loading) {
    return (
      <PerfilLayout>
        <Spinner />
      </PerfilLayout>
    );
  }

  // Con error igual se muestran los botones, para poder cerrar sesion
  // (por ejemplo, si el token vencio y el back respondio 401).
  if (error !== null) {
    return (
      <PerfilLayout>
        <MensajeError mensaje={error} />
        <AccionesPerfil onIrAEntradas={onIrAEntradas} onLogout={onLogout} />
      </PerfilLayout>
    );
  }

  return (
    <PerfilLayout>
      <PerfilHeader
        nombre={usuario.nombre}
        email={usuario.email}
        fotoPerfil={usuario.fotoPerfil}
        entradasActivas={usuario.entradasActivas}
      />
      <DatosPersonales
        nombre={usuario.nombre}
        email={usuario.email}
        telefono={usuario.telefono}
      />
      <AccionesPerfil onIrAEntradas={onIrAEntradas} onLogout={onLogout} />
    </PerfilLayout>
  );
};

export default PerfilDetalle;
