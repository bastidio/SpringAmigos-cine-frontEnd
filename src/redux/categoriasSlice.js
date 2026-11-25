import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "/categorias";

export const fetchCategorias = createAsyncThunk("categorias/fetchCategorias", async (sinDatos, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.get(URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

const categoriasSlice = createSlice({
  name: "categorias",
  initialState: {
    items: [],
    itemsEstado: "inicial",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorias.pending, (state) => {
        state.itemsEstado = "cargando";
        state.error = null;
      })
      .addCase(fetchCategorias.fulfilled, (state, action) => {
        state.itemsEstado = "listo";
        state.items = action.payload;
      })
      .addCase(fetchCategorias.rejected, (state, action) => {
        state.itemsEstado = "inicial";
        state.error = action.error.message;
      });
  },
});

export default categoriasSlice.reducer;
