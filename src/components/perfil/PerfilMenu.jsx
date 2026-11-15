import { useState } from 'react';
import { useSelector } from 'react-redux';
import PerfilAvatarBoton from './PerfilAvatarBoton';
import PerfilDetalle from './PerfilDetalle';








const PerfilMenu = ({ onLogout, onIrAEntradas }) => {
  const [abierto, setAbierto] = useState(false);
  // El perfil lo pide App una sola vez (fetchPerfil); acá solo se lee del store.
  const { perfil } = useSelector((state) => state.usuario);

  const alternar = () => {
    setAbierto(!abierto);
  };

  
  
  
  const cerrarSiSaleElFoco = (evento) => {
    if (!evento.currentTarget.contains(evento.relatedTarget)) {
      setAbierto(false);
    }
  };

  
  const cerrarConEscape = (evento) => {
    if (evento.key === 'Escape') {
      setAbierto(false);
    }
  };

  
  const irAEntradas = () => {
    setAbierto(false);
    onIrAEntradas();
  };

  return (
    
    
    <div
      className="relative"
      onClick={(evento) => evento.stopPropagation()}
      onBlur={cerrarSiSaleElFoco}
      onKeyDown={cerrarConEscape}
    >
      <PerfilAvatarBoton abierto={abierto} usuario={perfil} onClick={alternar} />

      {abierto && <PerfilDetalle onLogout={onLogout} onIrAEntradas={irAEntradas} />}
    </div>
  );
};

export default PerfilMenu;
