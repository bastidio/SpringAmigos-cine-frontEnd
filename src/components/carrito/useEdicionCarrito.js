import { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { useCarrito } from '../../context/CarritoContext';

// Logica de edicion del carrito (cargar, cambiar cantidad, quitar, vaciar).
// La usan el carrito desplegable y el checkout, para no duplicarla.

const SIN_CAMBIOS = { vaciar: false, cantidades: {} };

const hayCambios = (cambios) => cambios.vaciar || Object.keys(cambios.cantidades).length > 0;




const aplicarCambios = (carrito, cambios) => {
  if (carrito === null || !hayCambios(cambios)) return carrito;
  if (cambios.vaciar) return { ...carrito, items: [], total: 0 };

  const items = (carrito.items ?? [])
    .map((item) => {
      const cantidad = cambios.cantidades[item.itemId];
      if (cantidad === undefined) return item;
      return { ...item, cantidad, subtotal: item.precioUnitario * cantidad };
    })
    .filter((item) => item.cantidad > 0);

  const total = items.reduce((suma, item) => suma + item.subtotal, 0);
  return { ...carrito, items, total };
};



const borrar = async (url, opciones) => {
  try {
    await apiFetch(url, { ...opciones, method: 'DELETE' });
  } catch (err) {
    if (err.status !== 404) throw err;
  }
};

// Avisa que se terminó el tiempo de reserva. Si la funcion todavia no empezo, el modal
// ofrece volver a elegir butacas en ella.
const informarVencimiento = async (funcionId, avisarVencimiento, signal) => {
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
  avisarVencimiento({ funcionId, puedeReelegir });
};

const useEdicionCarrito = (token) => {
  const { refrescarCantidad, avisarVencimiento } = useCarrito();
  
  const [carrito, setCarrito] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  const [intento, setIntento] = useState(0);
  const [cambios, setCambios] = useState(SIN_CAMBIOS);
  
  const [errorAccion, setErrorAccion] = useState(null);
  // Cuando el carrito vence el backend borra la funcion: la recordamos para el modal.
  const [funcionRecordada, setFuncionRecordada] = useState(null);
  if (carrito?.funcionId && carrito.funcionId !== funcionRecordada) {
    setFuncionRecordada(carrito.funcionId);
  }

  
  
  
  useEffect(() => {
    const controller = new AbortController();

    const cargarCarrito = async () => {
      try {
        const data = await apiFetch('/api/carritos', { token, signal: controller.signal });
        setCarrito(data);
        setError(null);
      } catch (err) {
        
        if (err.name === 'AbortError') return;
        setError(err.message || 'No se pudo cargar el carrito.');
      } finally {
        
        if (!controller.signal.aborted) setCargando(false);
      }
    };

    cargarCarrito();

    
    return () => controller.abort();
  }, [token, intento]);

  
  
  
  
  
  useEffect(() => {
    if (!hayCambios(cambios)) return;

    const controller = new AbortController();
    const { signal } = controller;

    const enviarCambios = async () => {
      try {
        if (cambios.vaciar) {
          await borrar('/api/carritos', { token, signal });
        } else {
          await Promise.all(
            Object.entries(cambios.cantidades).map(([itemId, cantidad]) =>
              cantidad === 0
                ? borrar(`/api/carritos/items/${itemId}`, { token, signal })
                : apiFetch(`/api/carritos/items/${itemId}`, {
                    method: 'PUT',
                    body: { cantidad },
                    token,
                    signal,
                  })
            )
          );
        }
        setErrorAccion(null);
      } catch (err) {
        if (err.name === 'AbortError') return;
        
        
        setErrorAccion(err.message);
      }

      try {
        setCarrito(await apiFetch('/api/carritos', { token, signal }));
        
        refrescarCantidad();
      } catch (err) {
        if (err.name === 'AbortError') return;
        setErrorAccion(err.message);
      } finally {
        if (!signal.aborted) setCambios(SIN_CAMBIOS);
      }
    };

    enviarCambios();

    
    return () => controller.abort();
  }, [cambios, token, refrescarCantidad]);

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
      () => informarVencimiento(funcionRecordada, avisarVencimiento, controller.signal),
      espera
    );

    return () => {
      clearTimeout(temporizador);
      controller.abort();
    };
  }, [hayVencimiento, vencidoEnBackend, expiraEn, funcionRecordada, avisarVencimiento]);

  const cambiarCantidad = (item, cantidad) => {
    setCambios({ ...cambios, cantidades: { ...cambios.cantidades, [item.itemId]: cantidad } });
  };

  const quitarItem = (item) => cambiarCantidad(item, 0);

  const vaciarCarrito = () => {
    setCambios({ vaciar: true, cantidades: {} });
  };

  // Vuelve a pedir el carrito sin mostrar el spinner (no desmonta la pantalla).
  const recargar = () => setIntento((veces) => veces + 1);

  const reintentar = () => {
    setCargando(true);
    setError(null);
    recargar();
  };

  const visible = aplicarCambios(carrito, cambios);
  const items = visible?.items ?? [];
  const cantidadTotal = items.reduce((total, item) => total + item.cantidad, 0);
  
  const guardando = hayCambios(cambios);

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
    vaciarCarrito,
    reintentar,
    recargar,
  };
};

export default useEdicionCarrito;
