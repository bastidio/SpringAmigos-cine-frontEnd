import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { cerrarSesion } from "./usuarioSlice";

const URL = "/productos";

export const fetchProductos = createAsyncThunk("productos/fetchProductos", async () => {
  const { data } = await axios.get(URL);
  return data;
});

export const fetchProductosAdmin = createAsyncThunk("productos/fetchProductosAdmin", async (sinDatos, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.get(`${URL}?incluirInactivos=true`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const createProducto = createAsyncThunk("productos/createProducto", async (producto, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.post(URL, producto, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const updateProducto = createAsyncThunk("productos/updateProducto", async (producto, { getState }) => {
  const token = getState().usuario.token;
  const { id, ...datos } = producto;
  const { data } = await axios.put(`${URL}/${id}`, datos, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const actualizarStock = createAsyncThunk("productos/actualizarStock", async ({ id, stock }, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.patch(`${URL}/${id}/stock`, { stock }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const reactivarProducto = createAsyncThunk("productos/reactivarProducto", async (id, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.patch(`${URL}/${id}/reactivar`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const deleteProducto = createAsyncThunk("productos/deleteProducto", async (id, { getState }) => {
  const token = getState().usuario.token;
  await axios.delete(`${URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return id;
});

// Reemplaza el producto en la lista si ya estaba.
const reemplazar = (lista, producto) => {
  const index = lista.findIndex((p) => p.id === producto.id);
  if (index !== -1) lista[index] = producto;
};

const productosSlice = createSlice({
  name: "productos",
  initialState: {
    items: [], // kiosco publico (fetchProductos)
    itemsAdmin: [], // admin, incluye inactivos (fetchProductosAdmin)
    // "inicial" | "cargando" | "listo": el componente solo pide si esta en "inicial".
    itemsEstado: "inicial",
    itemsAdminEstado: "inicial",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductos.pending, (state) => {
        state.itemsEstado = "cargando";
        state.error = null;
      })
      .addCase(fetchProductos.fulfilled, (state, action) => {
        state.itemsEstado = "listo";
        state.items = action.payload;
      })
      .addCase(fetchProductos.rejected, (state, action) => {
        state.itemsEstado = "inicial";
        state.error = action.error.message;
      })
      .addCase(fetchProductosAdmin.pending, (state) => {
        state.itemsAdminEstado = "cargando";
        state.error = null;
      })
      .addCase(fetchProductosAdmin.fulfilled, (state, action) => {
        state.itemsAdminEstado = "listo";
        state.itemsAdmin = action.payload;
      })
      .addCase(fetchProductosAdmin.rejected, (state, action) => {
        state.itemsAdminEstado = "inicial";
        state.error = action.error.message;
      })
      // El producto nuevo va a la lista del admin; el kiosco publico se vuelve a pedir.
      .addCase(createProducto.fulfilled, (state, action) => {
        state.itemsAdmin = [...state.itemsAdmin, action.payload];
        state.itemsEstado = "inicial";
      })
      .addCase(updateProducto.fulfilled, (state, action) => {
        reemplazar(state.itemsAdmin, action.payload);
        reemplazar(state.items, action.payload);
      })
      .addCase(actualizarStock.fulfilled, (state, action) => {
        reemplazar(state.itemsAdmin, action.payload);
        reemplazar(state.items, action.payload);
      })
      // Vuelve a estar activo: en el admin se reemplaza y el kiosco publico se vuelve a pedir.
      .addCase(reactivarProducto.fulfilled, (state, action) => {
        reemplazar(state.itemsAdmin, action.payload);
        state.itemsEstado = "inicial";
      })
      // Baja logica: el admin lo sigue mostrando como inactivo; del kiosco publico se saca.
      .addCase(deleteProducto.fulfilled, (state, action) => {
        const index = state.itemsAdmin.findIndex((p) => p.id === action.payload);
        if (index !== -1) state.itemsAdmin[index].activo = false;
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addCase(cerrarSesion, (state) => {
        state.itemsAdmin = [];
        state.itemsAdminEstado = "inicial";
        state.error = null;
      });
  },
});

export default productosSlice.reducer;
