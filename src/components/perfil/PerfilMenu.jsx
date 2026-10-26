import { useEffect, useState } from 'react';
import PerfilAvatarBoton from './PerfilAvatarBoton';
import PerfilDetalle from './PerfilDetalle';








const PerfilMenu = ({ token, onLogout, onIrAEntradas }) => {
  const [abierto, setAbierto] = useState(false);
  
  const [usuarioNav, setUsuarioNav] = useState(null);

  
  
  
  useEffect(() => {
    if (token === '') return;

    const controller = new AbortController();
    fetch('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status} al cargar el perfil`);
        }
        return res.json();
      })
      .then((data) => setUsuarioNav({ nombre: data.nombre, fotoPerfil: data.fotoPerfil }))
      .catch((err) => {
        
        if (err.name !== 'AbortError') console.error('No se pudo cargar la foto del nav', err);
      });

    return () => controller.abort();
  }, [token]);

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
      <PerfilAvatarBoton abierto={abierto} usuario={token === '' ? null : usuarioNav} onClick={alternar} />

      {abierto && <PerfilDetalle token={token} onLogout={onLogout} onIrAEntradas={irAEntradas} />}
    </div>
  );
};

export default PerfilMenu;
