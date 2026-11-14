import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL_PELICULAS = "/peliculas/cartelera";
const URL_FUNCIONES = "/funciones";


export const fetchPeliculas = createAsyncThunk("cartelera/fetchPeliculas", async (_, { signal }) => {
  const { data } = await axios(URL_PELICULAS, { signal });
  return data;
});

export const fetchFunciones = createAsyncThunk("cartelera/fetchFunciones", async (_, { signal }) => {
  const { data } = await axios(URL_FUNCIONES, { signal });
  return data;
});

const carteleraSlice = createSlice({
  name: "cartelera",
  initialState: {
    peliculas: [],
    funciones: [],
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPeliculas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPeliculas.fulfilled, (state, action) => {
        state.loading = false;
        state.peliculas = action.payload;
      })
      .addCase(fetchPeliculas.rejected, (state, action) => {
        if (action.meta.aborted) return; // se canceló al desmontar: no es un error
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFunciones.fulfilled, (state, action) => {
        state.funciones = action.payload;
      })
      .addCase(fetchFunciones.rejected, (state) => {
        // Sin funciones la cartelera igual se muestra, solo que sin horarios.
        state.funciones = [];
      });
  },
});

export default carteleraSlice.reducer;
