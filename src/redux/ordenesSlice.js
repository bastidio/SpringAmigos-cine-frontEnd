import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchOrdenes = createAsyncThunk("ordenes/fetchOrdenes", async (sinDatos, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.get("/ordenes", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const fetchMisEntradas = createAsyncThunk("ordenes/fetchMisEntradas", async (sinDatos, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.get("/entradas/mis-entradas", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const confirmarCompra = createAsyncThunk("ordenes/confirmarCompra", async (body, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.post("/api/checkout", body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

const ordenesSlice = createSlice({
  name: "ordenes",
  initialState: {
    items: [],
    misEntradas: [],
    ultimaOrden: null,
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdenes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdenes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrdenes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMisEntradas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMisEntradas.fulfilled, (state, action) => {
        state.loading = false;
        state.misEntradas = action.payload;
      })
      .addCase(fetchMisEntradas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(confirmarCompra.fulfilled, (state, action) => {
        state.ultimaOrden = action.payload;
      });
  },
});

export default ordenesSlice.reducer;
