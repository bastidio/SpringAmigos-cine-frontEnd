import { createContext, useContext } from 'react';

export const CarritoContext = createContext({ refrescarCantidad: () => {} });

export const useCarrito = () => useContext(CarritoContext);
