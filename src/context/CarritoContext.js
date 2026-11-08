import { createContext, useContext } from 'react';

export const CarritoContext = createContext({
  refrescarCantidad: () => {},
  version: 0,
  avisarVencimiento: () => {},
});

export const useCarrito = () => useContext(CarritoContext);
