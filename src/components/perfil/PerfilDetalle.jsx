import { useSelector } from 'react-redux';
import PerfilLayout from './PerfilLayout';
import PerfilHeader from './PerfilHeader';
import DatosPersonales from './DatosPersonales';
import MisFavoritos from './MisFavoritos';
import AccionesPerfil from './AccionesPerfil';
import Spinner from './Spinner';
import MensajeError from './MensajeError';




const PerfilDetalle = ({ onLogout, onIrAEntradas }) => {
  // El perfil ya lo pidió App (fetchPerfil); mientras no llega se muestra el spinner.
  const { perfil: usuario, error } = useSelector((state) => state.usuario);

  if (usuario === null && error === null) {
    return (
      <PerfilLayout>
        <Spinner />
      </PerfilLayout>
    );
  }

  
  
  if (usuario === null) {
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
      <MisFavoritos />
      <AccionesPerfil onIrAEntradas={onIrAEntradas} onLogout={onLogout} />
    </PerfilLayout>
  );
};

export default PerfilDetalle;
