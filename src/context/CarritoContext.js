import { createContext, useContext } from 'react';

export const CarritoContext = createContext({ refrescarCantidad: () => {}, version: 0 });

export const useCarrito = () => useContext(CarritoContext);
