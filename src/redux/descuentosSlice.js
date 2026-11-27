import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { mensajeDeError } from "./mensajeDeError";
import { cerrarSesion } from "./usuarioSlice";

const URL = "/descuentos";

export const fetchDescuentos = createAsyncThunk("descuentos/fetchDescuentos", async (sinDatos, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.get(URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const createDescuento = createAsyncThunk("descuentos/createDescuento", async (descuento, { getState, rejectWithValue }) => {
  const token = getState().usuario.token;
  const respuesta = await axios.post(URL, descuento, {
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true,
  });
  if (respuesta.status >= 400) {
    return rejectWithValue(mensajeDeError(respuesta));
  }
  return respuesta.data;
});

export const updateDescuento = createAsyncThunk("descuentos/updateDescuento", async (descuento, { getState, rejectWithValue }) => {
  const token = getState().usuario.token;
  const { id, ...datos } = descuento;
  const respuesta = await axios.put(`${URL}/${id}`, datos, {
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true,
  });
  if (respuesta.status >= 400) {
    return rejectWithValue(mensajeDeError(respuesta));
  }
  return respuesta.data;
});

export const deleteDescuento = createAsyncThunk("descuentos/deleteDescuento", async (id, { getState, rejectWithValue }) => {
  const token = getState().usuario.token;
  const respuesta = await axios.delete(`${URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true,
  });
  if (respuesta.status >= 400) {
    return rejectWithValue(mensajeDeError(respuesta));
  }
  return id;
});

export const reactivarDescuento = createAsyncThunk("descuentos/reactivarDescuento", async (id, { getState, rejectWithValue }) => {
  const token = getState().usuario.token;
  const respuesta = await axios.patch(`${URL}/${id}/reactivar`, null, {
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true,
  });
  if (respuesta.status >= 400) {
    return rejectWithValue(mensajeDeError(respuesta));
  }
  return respuesta.data;
});

// valida el código contra el carrito actual y devuelve si es válido, mensaje, subtotal, monto y total
export const validarDescuento = createAsyncThunk("descuentos/validarDescuento", async (codigo, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.get(`/api/checkout/descuento?codigo=${encodeURIComponent(codigo)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

const descuentosSlice = createSlice({
  name: "descuentos",
  initialState: {
    items: [],
    validacion: null,
    // "inicial" | "cargando" | "listo": el componente solo hace GET si está en "inicial".
    itemsEstado: "inicial",
    error: null,
  },
  reducers: {
    // Al aplicar otro código o sacarlo se borra la validación anterior
    limpiarValidacion: (state) => {
      state.validacion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDescuentos.pending, (state) => {
        state.itemsEstado = "cargando";
        state.error = null;
      })
      .addCase(fetchDescuentos.fulfilled, (state, action) => {
        state.itemsEstado = "listo";
        state.items = action.payload;
      })
      .addCase(fetchDescuentos.rejected, (state) => {
        state.itemsEstado = "inicial";
        state.error = "No se pudieron cargar los descuentos.";
      })
      .addCase(createDescuento.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload];
      })
      .addCase(updateDescuento.fulfilled, (state, action) => {
        const index = state.items.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      // la pantalla lo sigue mostrando como inactivo, por eso no se filtra.
      .addCase(deleteDescuento.fulfilled, (state, action) => {
        const index = state.items.findIndex((d) => d.id === action.payload);
        if (index !== -1) state.items[index].activo = false;
      })
      .addCase(reactivarDescuento.fulfilled, (state, action) => {
        const index = state.items.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(validarDescuento.fulfilled, (state, action) => {
        state.validacion = action.payload;
      })
      .addCase(validarDescuento.rejected, (state) => {
        state.validacion = null;
      })
      // Al cerrar sesión se vacía la lista del admin.
      .addCase(cerrarSesion, (state) => {
        state.items = [];
        state.itemsEstado = "inicial";
        state.error = null;
      });
  },
});

export const { limpiarValidacion } = descuentosSlice.actions;

export default descuentosSlice.reducer;
