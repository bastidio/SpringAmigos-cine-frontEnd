import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "/descuentos";

export const fetchDescuentos = createAsyncThunk("descuentos/fetchDescuentos", async (sinDatos, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.get(URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const createDescuento = createAsyncThunk("descuentos/createDescuento", async (descuento, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.post(URL, descuento, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const updateDescuento = createAsyncThunk("descuentos/updateDescuento", async (descuento, { getState }) => {
  const token = getState().usuario.token;
  const { id, ...datos } = descuento;
  const { data } = await axios.put(`${URL}/${id}`, datos, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const deleteDescuento = createAsyncThunk("descuentos/deleteDescuento", async (id, { getState }) => {
  const token = getState().usuario.token;
  await axios.delete(`${URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return id;
});

export const reactivarDescuento = createAsyncThunk("descuentos/reactivarDescuento", async (id, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.patch(`${URL}/${id}/reactivar`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

// valida el código contra el carrito actual y devuelve si es valido, mensaje, subtotal, monto y total
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
    loading: false,
    error: null,
  },
  reducers: {
    // Si pones otro código o sacas uno
    limpiarValidacion: (state) => {
      state.validacion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDescuentos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDescuentos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDescuentos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
      });
  },
});

export const { limpiarValidacion } = descuentosSlice.actions;

export default descuentosSlice.reducer;
