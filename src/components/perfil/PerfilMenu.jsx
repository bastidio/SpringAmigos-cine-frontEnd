import { useEffect, useState } from 'react';
import PerfilAvatarBoton from './PerfilAvatarBoton';
import PerfilDetalle from './PerfilDetalle';

// Componente padre del menu desplegable: maneja si esta abierto o cerrado y
// el nombre y la foto del icono del nav. Los datos completos del perfil los
// pide PerfilDetalle, que se monta recien cuando se abre el menu (y se
// desmonta al cerrarlo): por eso /users/me se pide dos veces, una aca para el
// icono y otra al abrir, para tener las entradas al dia.
// Todo con eventos de React: no se escucha nada en document ni se lee el DOM
// con refs.
const PerfilMenu = ({ token, onLogout, onIrAEntradas }) => {
  const [abierto, setAbierto] = useState(false);
  // { nombre, fotoPerfil } para el icono; null hasta que llegue la respuesta.
  const [usuarioNav, setUsuarioNav] = useState(null);

  // MONTAJE: se pide el perfil para tener la foto en el nav sin abrir el menu.
  // ACTUALIZACION: si cambia el token (otro usuario inicia sesion) se vuelve a pedir.
  // DESMONTAJE: si el nav se va antes de la respuesta, se cancela el pedido.
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
        // Sin los datos el icono queda como siempre: no es un error para el usuario.
        if (err.name !== 'AbortError') console.error('No se pudo cargar la foto del nav', err);
      });

    return () => controller.abort();
  }, [token]);

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
      <PerfilAvatarBoton abierto={abierto} usuario={token === '' ? null : usuarioNav} onClick={alternar} />

      {abierto && <PerfilDetalle token={token} onLogout={onLogout} onIrAEntradas={irAEntradas} />}
    </div>
  );
};

export default PerfilMenu;
