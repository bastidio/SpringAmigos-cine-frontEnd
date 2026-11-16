import { configureStore } from '@reduxjs/toolkit';
import usuarioReducer from './usuarioSlice';
import carteleraReducer from './carteleraSlice';
import carritoReducer from './carritoSlice';
import favoritosReducer from './favoritosSlice';
import salasReducer from './salasSlice';
import productosReducer from './productosSlice';
import categoriasReducer from './categoriasSlice';
import ordenesReducer from './ordenesSlice';
import descuentosReducer from './descuentosSlice';

export const store = configureStore({
  reducer: {
    usuario: usuarioReducer,
    cartelera: carteleraReducer,
    carrito: carritoReducer,
    favoritos: favoritosReducer,
    salas: salasReducer,
    productos: productosReducer,
    categorias: categoriasReducer,
    ordenes: ordenesReducer,
    descuentos: descuentosReducer,
  },
});
