import { useEffect, useState } from 'react';
import PerfilLayout from './PerfilLayout';
import PerfilHeader from './PerfilHeader';
import DatosPersonales from './DatosPersonales';
import AccionesPerfil from './AccionesPerfil';
import Spinner from './Spinner';
import MensajeError from './MensajeError';




const PerfilDetalle = ({ token, onLogout, onIrAEntradas }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  
  
  
  useEffect(() => {
    const controller = new AbortController();

    const cargarPerfil = async () => {
      try {
        
        const res = await fetch('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        
        
        if (!res.ok) {
          throw new Error(`Error ${res.status} al cargar el perfil`);
        }

        const data = await res.json();
        setUsuario(data);
      } catch (err) {
        
        if (err.name === 'AbortError') {
          return;
        }
        
        setError(err.message);
      } finally {
        
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    cargarPerfil();

    
    
    return () => controller.abort();
  }, [token]);

  
  
  
  

  if (loading) {
    return (
      <PerfilLayout>
        <Spinner />
      </PerfilLayout>
    );
  }

  
  
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
