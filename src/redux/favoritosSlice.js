import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "/favoritos";

export const fetchFavoritos = createAsyncThunk("favoritos/fetchFavoritos", async (sinDatos, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.get(URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const agregarFavorito = createAsyncThunk("favoritos/agregarFavorito", async (pelicula, { getState }) => {
  const token = getState().usuario.token;
  await axios.post(`${URL}/${pelicula.id}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return {
    peliculaId: pelicula.id,
    titulo: pelicula.titulo,
    poster_url: pelicula.poster_url,
    clasificacion: pelicula.clasificacion,
  };
});

export const quitarFavorito = createAsyncThunk("favoritos/quitarFavorito", async (peliculaId, { getState }) => {
  const token = getState().usuario.token;
  await axios.delete(`${URL}/${peliculaId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return peliculaId;
});

const favoritosSlice = createSlice({
  name: "favoritos",
  initialState: { 
    items: [], 
    loading: false, 
    error: null 
  },
  reducers: {
    limpiarFavoritos: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoritos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoritos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavoritos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(agregarFavorito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(agregarFavorito.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [action.payload, ...state.items];
      })
      .addCase(agregarFavorito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(quitarFavorito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(quitarFavorito.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((f) => f.peliculaId !== action.payload);
      })
      .addCase(quitarFavorito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { limpiarFavoritos } = favoritosSlice.actions;
export default favoritosSlice.reducer;
