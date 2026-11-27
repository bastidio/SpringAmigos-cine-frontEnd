import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { mensajeDeError, SIN_CONEXION } from "./mensajeDeError";

const URL = "/favoritos";

export const fetchFavoritos = createAsyncThunk("favoritos/fetchFavoritos", async (sinDatos, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.get(URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const agregarFavorito = createAsyncThunk("favoritos/agregarFavorito", async (pelicula, { getState, rejectWithValue }) => {
  const token = getState().usuario.token;
  const respuesta = await axios.post(`${URL}/${pelicula.id}`, null, {
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true,
  });
  if (respuesta.status >= 400) {
    return rejectWithValue(mensajeDeError(respuesta));
  }
  return {
    peliculaId: pelicula.id,
    titulo: pelicula.titulo,
    poster_url: pelicula.poster_url,
    clasificacion: pelicula.clasificacion,
  };
});

export const quitarFavorito = createAsyncThunk("favoritos/quitarFavorito", async (peliculaId, { getState, rejectWithValue }) => {
  const token = getState().usuario.token;
  const respuesta = await axios.delete(`${URL}/${peliculaId}`, {
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true,
  });
  if (respuesta.status >= 400) {
    return rejectWithValue(mensajeDeError(respuesta));
  }
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
      .addCase(fetchFavoritos.rejected, (state) => {
        state.loading = false;
        state.error = "No se pudieron cargar tus favoritos.";
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
        state.error = SIN_CONEXION;
        if (action.payload) state.error = action.payload;
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
        state.error = SIN_CONEXION;
        if (action.payload) state.error = action.payload;
      });
  },
});

export const { limpiarFavoritos } = favoritosSlice.actions;
export default favoritosSlice.reducer;
