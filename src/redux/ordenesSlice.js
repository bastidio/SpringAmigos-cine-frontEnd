import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { cerrarSesion } from "./usuarioSlice";

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

export const confirmarCompra = createAsyncThunk("ordenes/confirmarCompra", async (body, { getState, rejectWithValue }) => {
  try {
    const token = getState().usuario.token;
    const { data } = await axios.post("/api/checkout", body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue("Ocurrió un error. Intentá de nuevo.");
  }
});

const ordenesSlice = createSlice({
  name: "ordenes",
  initialState: {
    items: [],
    misEntradas: [],
    ultimaOrden: null,
    itemsEstado: "inicial",
    misEntradasEstado: "inicial",
    error: null,
  },
  reducers: {
    //vuelve a iniciar
    invalidarMisEntradas: (state) => {
      state.misEntradasEstado = "inicial";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdenes.pending, (state) => {
        state.itemsEstado = "cargando";
        state.error = null;
      })
      .addCase(fetchOrdenes.fulfilled, (state, action) => {
        state.itemsEstado = "listo";
        state.items = action.payload;
      })
      .addCase(fetchOrdenes.rejected, (state, action) => {
        state.itemsEstado = "inicial";
        state.error = action.error.message;
      })
      .addCase(fetchMisEntradas.pending, (state) => {
        state.misEntradasEstado = "cargando";
        state.error = null;
      })
      .addCase(fetchMisEntradas.fulfilled, (state, action) => {
        state.misEntradasEstado = "listo";
        state.misEntradas = action.payload;
      })
      .addCase(fetchMisEntradas.rejected, (state, action) => {
        state.misEntradasEstado = "inicial";
        state.error = action.error.message;
      })
      .addCase(confirmarCompra.fulfilled, (state, action) => {
        state.ultimaOrden = action.payload;
        state.misEntradasEstado = "inicial";
        state.itemsEstado = "inicial";
      })
      // Al cerrar sesión se vacían las órdenes
      .addCase(cerrarSesion, (state) => {
        state.items = [];
        state.misEntradas = [];
        state.itemsEstado = "inicial";
        state.misEntradasEstado = "inicial";
        state.error = null;
      });
  },
});

export const { invalidarMisEntradas } = ordenesSlice.actions;

export default ordenesSlice.reducer;
