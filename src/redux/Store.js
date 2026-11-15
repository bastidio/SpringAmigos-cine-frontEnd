import { configureStore } from '@reduxjs/toolkit';
import usuarioReducer from './usuarioSlice';
import carteleraReducer from './carteleraSlice';
import carritoReducer from './carritoSlice';
import favoritosReducer from './favoritosSlice';

export const store = configureStore({
  reducer: {
    usuario: usuarioReducer,
    cartelera: carteleraReducer,
    carrito: carritoReducer,
    favoritos: favoritosReducer,
  },
});
