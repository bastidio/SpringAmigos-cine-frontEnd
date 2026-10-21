import { useEffect, useRef, useState } from 'react';
import PerfilAvatarBoton from './PerfilAvatarBoton';
import PerfilDetalle from './PerfilDetalle';

// Componente padre del menu desplegable: solo maneja si esta abierto o
// cerrado. Los datos del usuario los pide PerfilDetalle, que se monta recien
// cuando se abre el menu (y se desmonta al cerrarlo).
const PerfilMenu = ({ token, onLogout, onIrAEntradas }) => {
  const [abierto, setAbierto] = useState(false);
  // Referencia al contenedor (icono + panel) para saber si un click fue afuera.
  const contenedorRef = useRef(null);

  // ACTUALIZACION: este efecto corre cada vez que cambia "abierto". Solo
  // mientras el menu esta abierto se escuchan los clicks afuera y la tecla
  // Escape, para cerrarlo.
  useEffect(() => {
    if (!abierto) return;

    const cerrarSiEsAfuera = (evento) => {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target)) {
        setAbierto(false);
      }
    };
    const cerrarConEscape = (evento) => {
      if (evento.key === 'Escape') setAbierto(false);
    };

    document.addEventListener('mousedown', cerrarSiEsAfuera);
    document.addEventListener('keydown', cerrarConEscape);

    // DESMONTAJE: al cerrarse el menu (o si el componente se va, por ejemplo
    // al cerrar sesion) se sacan los listeners para no dejarlos colgados.
    return () => {
      document.removeEventListener('mousedown', cerrarSiEsAfuera);
      document.removeEventListener('keydown', cerrarConEscape);
    };
  }, [abierto]);

  const alternar = () => {
    setAbierto(!abierto);
  };

  // Antes de ir a otra vista se cierra el menu.
  const irAEntradas = () => {
    setAbierto(false);
    onIrAEntradas();
  };

  return (
    // stopPropagation: en celular el icono esta dentro del menu hamburguesa,
    // que se cierra con cualquier click adentro. Asi no se cierra al abrir el perfil.
    <div ref={contenedorRef} className="relative" onClick={(evento) => evento.stopPropagation()}>
      <PerfilAvatarBoton abierto={abierto} onClick={alternar} />

      {abierto && <PerfilDetalle token={token} onLogout={onLogout} onIrAEntradas={irAEntradas} />}
    </div>
  );
};

export default PerfilMenu;
