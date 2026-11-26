import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerfil } from '../../redux/usuarioSlice';
import PerfilAvatarBoton from './PerfilAvatarBoton';
import PerfilDetalle from './PerfilDetalle';








const PerfilMenu = ({ onLogout, onIrAEntradas }) => {
  const [abierto, setAbierto] = useState(false);
  const dispatch = useDispatch();
  const { perfil, loading } = useSelector((state) => state.usuario);

  // El perfil se pide recién al abrir el menú, y si todavía no está en el store (después del login, o después de una compra porque cambian las entradas activas).
  // en la espera se muestra el spinner.
  const alternar = () => {
    if (!abierto && perfil === null && !loading) dispatch(fetchPerfil());
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
