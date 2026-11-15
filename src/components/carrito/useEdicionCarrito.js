import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCarrito, modificarCantidad, eliminarItem, vaciarCarrito, setVencimiento } from '../../redux/carritoSlice';

// Logica de edicion del carrito (cargar, cambiar cantidad, quitar, vaciar).
// La usan el carrito desplegable y el checkout, para no duplicarla.

// Avisa que se terminó el tiempo de reserva. Si la funcion todavia no empezo, el modal
// ofrece volver a elegir butacas en ella.
const informarVencimiento = async (funcionId, dispatch, signal) => {
  let puedeReelegir = false;
  if (funcionId !== null) {
    try {
      // GET publico: fetch simple, sin token (un token vencido haria fallar el pedido).
      const respuesta = await fetch(`/funciones/${funcionId}`, { signal });
      if (respuesta.ok) {
        const funcion = await respuesta.json();
        puedeReelegir = new Date(funcion.horario) > new Date();
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }
  dispatch(setVencimiento({ funcionId, puedeReelegir }));
};

const useEdicionCarrito = () => {
  const { carrito, error: errorCarga } = useSelector((state) => state.carrito);
  const dispatch = useDispatch();

  // El error de carga solo se muestra si no hay carrito (un error al editar va en errorAccion).
  const error = carrito === null ? errorCarga : null;
  const cargando = carrito === null && error === null;
  const [guardando, setGuardando] = useState(false);

  const [errorAccion, setErrorAccion] = useState(null);
  // Cuando el carrito vence el backend borra la funcion: la recordamos para el modal.
  const [funcionRecordada, setFuncionRecordada] = useState(null);
  if (carrito?.funcionId && carrito.funcionId !== funcionRecordada) {
    setFuncionRecordada(carrito.funcionId);
  }

  // Vencimiento: por tiempo (solo si el carrito tiene butacas) o porque el backend ya lo marco
  // (el scheduler vacio el carrito o fallo el pago). El temporizador se limpia al desmontar o
  // cuando cambia expiraEn (por ejemplo, al agregar otra butaca).
  const hayButacas = (carrito?.items ?? []).some((item) => item.tipo === 'BUTACA');
  const expiraEn = carrito?.expiraEn;
  const vencidoEnBackend = carrito?.vencido === true;
  const hayVencimiento = vencidoEnBackend || (hayButacas && Boolean(expiraEn));

  useEffect(() => {
    if (!hayVencimiento) return;

    const controller = new AbortController();
    const espera = vencidoEnBackend ? 0 : Math.max(new Date(expiraEn) - Date.now(), 0);
    const temporizador = setTimeout(
      () => informarVencimiento(funcionRecordada, dispatch, controller.signal),
      espera
    );

    return () => {
      clearTimeout(temporizador);
      controller.abort();
    };
  }, [hayVencimiento, vencidoEnBackend, expiraEn, funcionRecordada, dispatch]);

  // Cada cambio va al back con su thunk; el carrito del store se actualiza en el fulfilled.
  const ejecutar = async (accion) => {
    setGuardando(true);
    setErrorAccion(null);
    const res = await dispatch(accion);
    setGuardando(false);
    if (res.error) setErrorAccion(res.error.message);
  };

  const cambiarCantidad = (item, cantidad) => {
    ejecutar(
      cantidad === 0
        ? eliminarItem(item.itemId)
        : modificarCantidad({ itemId: item.itemId, cantidad })
    );
  };

  const quitarItem = (item) => cambiarCantidad(item, 0);

  const vaciar = () => {
    ejecutar(vaciarCarrito());
  };

  const reintentar = () => {
    dispatch(fetchCarrito());
  };

  const visible = carrito;
  const items = visible?.items ?? [];
  const cantidadTotal = items.reduce((total, item) => total + item.cantidad, 0);

  return {
    visible,
    items,
    cantidadTotal,
    cargando,
    error,
    errorAccion,
    guardando,
    cambiarCantidad,
    quitarItem,
    vaciarCarrito: vaciar,
    reintentar,
  };
};

export default useEdicionCarrito;
