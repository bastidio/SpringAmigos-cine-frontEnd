import { useEffect, useState } from 'react';
import PerfilLayout from '../components/perfil/PerfilLayout';
import PerfilHeader from '../components/perfil/PerfilHeader';
import DatosPersonales from '../components/perfil/DatosPersonales';
import AccionesPerfil from '../components/perfil/AccionesPerfil';
import Spinner from '../components/perfil/Spinner';
import MensajeError from '../components/perfil/MensajeError';

// Vista "Mi Perfil" (URL "/perfil"). Solo lectura. Es el unico componente
// con logica: pide los datos al back, maneja usuario/loading/error y se los
// pasa a los hijos por props.
const PerfilView = ({ token, onLogout, onIrAEntradas }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // MONTAJE: un unico GET, con array de dependencias vacio.
  // El token no va en las dependencias a proposito: mientras esta vista esta
  // montada no cambia, porque al cerrar sesion App la desmonta.
  useEffect(() => {
    const controller = new AbortController();

    const cargarPerfil = async () => {
      try {
        // Ruta relativa: el proxy de Vite la reenvia al back (vite.config.js).
        const res = await fetch('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        // PROMESA NO CUMPLIDA: el back respondio, pero con error (401, 404, 500...).
        if (!res.ok) {
          throw new Error(`Error ${res.status} al cargar el perfil`);
        }

        // PROMESA CUMPLIDA: res.ok es true, se guardan los datos en el estado.
        const data = await res.json();
        setUsuario(data);
      } catch (err) {
        // Si se cancelo por el desmontaje, no es un error real: se ignora.
        if (err.name === 'AbortError') {
          return;
        }
        // PROMESA NO CUMPLIDA: el !res.ok de arriba, o fallo la red.
        setError(err.message);
      } finally {
        // Si se cancelo, la vista ya no esta: no se toca su estado.
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    cargarPerfil();

    // DESMONTAJE: si la vista se va antes de que llegue la respuesta,
    // se cancela la peticion.
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ACTUALIZACION: cada setUsuario/setLoading/setError de arriba hace que
  // React vuelva a renderizar con el estado nuevo. Ningun efecto depende de
  // esos estados, asi que actualizar NO dispara otro GET: la vista se
  // refresca solo con lo que ya tiene guardado.

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
        entradasActivas={usuario.entradasActivas}
      />
      <DatosPersonales nombre={usuario.nombre} email={usuario.email} />
      <AccionesPerfil onIrAEntradas={onIrAEntradas} onLogout={onLogout} />
    </PerfilLayout>
  );
};

export default PerfilView;
