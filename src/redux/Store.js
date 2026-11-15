import { configureStore } from '@reduxjs/toolkit';
import usuarioReducer from './usuarioSlice';
import carteleraReducer from './carteleraSlice';

export const store = configureStore({
  reducer: {
    usuario: usuarioReducer,
    cartelera: carteleraReducer,
  },
});
