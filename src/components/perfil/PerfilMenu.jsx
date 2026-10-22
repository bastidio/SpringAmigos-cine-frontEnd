import { useState } from 'react';
import PerfilAvatarBoton from './PerfilAvatarBoton';
import PerfilDetalle from './PerfilDetalle';

// Componente padre del menu desplegable: solo maneja si esta abierto o
// cerrado. Los datos del usuario los pide PerfilDetalle, que se monta recien
// cuando se abre el menu (y se desmonta al cerrarlo).
// Todo con eventos de React: no se escucha nada en document ni se lee el DOM
// con refs.
const PerfilMenu = ({ token, onLogout, onIrAEntradas }) => {
  const [abierto, setAbierto] = useState(false);

  const alternar = () => {
    setAbierto(!abierto);
  };

  // Click afuera: el foco sale del contenedor (icono + panel). relatedTarget
  // es a donde fue el foco; si sigue adentro (por ejemplo, un boton del
  // panel), el menu queda abierto.
  const cerrarSiSaleElFoco = (evento) => {
    if (!evento.currentTarget.contains(evento.relatedTarget)) {
      setAbierto(false);
    }
  };

  // Escape: funciona porque al abrir, el foco queda adentro del panel.
  const cerrarConEscape = (evento) => {
    if (evento.key === 'Escape') {
      setAbierto(false);
    }
  };

  // Antes de ir a otra vista se cierra el menu.
  const irAEntradas = () => {
    setAbierto(false);
    onIrAEntradas();
  };

  return (
    // stopPropagation: en celular el icono esta dentro del menu hamburguesa,
    // que se cierra con cualquier click adentro. Asi no se cierra al abrir el perfil.
    <div
      className="relative"
      onClick={(evento) => evento.stopPropagation()}
      onBlur={cerrarSiSaleElFoco}
      onKeyDown={cerrarConEscape}
    >
      <PerfilAvatarBoton abierto={abierto} onClick={alternar} />

      {abierto && <PerfilDetalle token={token} onLogout={onLogout} onIrAEntradas={irAEntradas} />}
    </div>
  );
};

export default PerfilMenu;
