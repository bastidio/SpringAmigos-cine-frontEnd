import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import usuarioReducer from './usuarioSlice';
import carteleraReducer from './carteleraSlice';
import carritoReducer from './carritoSlice';
import favoritosReducer from './favoritosSlice';
import salasReducer from './salasSlice';
import productosReducer from './productosSlice';
import categoriasReducer from './categoriasSlice';
import ordenesReducer from './ordenesSlice';
import descuentosReducer from './descuentosSlice';

const usuarioPersistConfig = { key: 'usuario', storage, whitelist: ['token'] };

export const store = configureStore({
  reducer: {
    usuario: persistReducer(usuarioPersistConfig, usuarioReducer),
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

export const persistor = persistStore(store);
