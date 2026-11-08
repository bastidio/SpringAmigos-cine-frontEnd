import { createContext, useContext } from 'react';

// favoritos: [{ peliculaId, titulo, poster_url, clasificacion, agregadoEn }], cargados una sola vez en App.
export const FavoritosContext = createContext({
  haySesion: false,
  favoritos: [],
  esFavorita: () => false,
  alternar: () => {},
});

export const useFavoritos = () => useContext(FavoritosContext);
