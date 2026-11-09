import { createContext, useContext } from 'react';

export const CarritoContext = createContext({
  carrito: null,
  cantidad: 0,
  error: null,
  actualizarCarrito: () => {},
  vaciarCarritoLocal: () => {},
  recargarCarrito: () => {},
  reintentarCarrito: () => {},
  avisarVencimiento: () => {},
});

export const useCarrito = () => useContext(CarritoContext);
