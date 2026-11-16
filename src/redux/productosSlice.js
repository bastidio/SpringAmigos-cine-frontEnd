import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "/productos";

export const fetchProductos = createAsyncThunk("productos/fetchProductos", async () => {
  const { data } = await axios.get(URL);
  return data;
});

export const fetchProductosAdmin = createAsyncThunk("productos/fetchProductosAdmin", async () => {
  const { data } = await axios.get(`${URL}?incluirInactivos=true`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

export const createProducto = createAsyncThunk("productos/createProducto", async (producto) => {
  const { data } = await axios.post(URL, producto, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

export const updateProducto = createAsyncThunk("productos/updateProducto", async (producto) => {
  const { id, ...datos } = producto;
  const { data } = await axios.put(`${URL}/${id}`, datos, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

export const actualizarStock = createAsyncThunk("productos/actualizarStock", async ({ id, stock }) => {
  const { data } = await axios.patch(`${URL}/${id}/stock`, { stock }, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

export const reactivarProducto = createAsyncThunk("productos/reactivarProducto", async (id) => {
  const { data } = await axios.patch(`${URL}/${id}/reactivar`, null, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

export const deleteProducto = createAsyncThunk("productos/deleteProducto", async (id) => {
  await axios.delete(`${URL}/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return id;
});

const productosSlice = createSlice({
  name: "productos",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProductos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProductosAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductosAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProductosAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProducto.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload];
      })
      .addCase(updateProducto.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(actualizarStock.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(reactivarProducto.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteProducto.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload);
        if (index !== -1) state.items[index].activo = false;
      });
  },
});

export default productosSlice.reducer;
