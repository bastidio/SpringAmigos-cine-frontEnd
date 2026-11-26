import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { cerrarSesion } from "./usuarioSlice";
import { confirmarCompra } from "./ordenesSlice";

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

export const createProducto = createAsyncThunk("productos/createProducto", async (producto, { getState, rejectWithValue }) => {
  try {
    const token = getState().usuario.token;
    const { data } = await axios.post(URL, producto, {
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

export const updateProducto = createAsyncThunk("productos/updateProducto", async (producto, { getState, rejectWithValue }) => {
  try {
    const token = getState().usuario.token;
    const { id, ...datos } = producto;
    const { data } = await axios.put(`${URL}/${id}`, datos, {
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

export const actualizarStock = createAsyncThunk("productos/actualizarStock", async ({ id, stock }, { getState, rejectWithValue }) => {
  try {
    const token = getState().usuario.token;
    const { data } = await axios.patch(`${URL}/${id}/stock`, { stock }, {
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

export const reactivarProducto = createAsyncThunk("productos/reactivarProducto", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().usuario.token;
    const { data } = await axios.patch(`${URL}/${id}/reactivar`, null, {
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

export const deleteProducto = createAsyncThunk("productos/deleteProducto", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().usuario.token;
    await axios.delete(`${URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue("Ocurrió un error. Intentá de nuevo.");
  }
});

// Reemplaza el producto en la lista si ya estaba.
const reemplazar = (lista, producto) => {
  const index = lista.findIndex((p) => p.id === producto.id);
  if (index !== -1) lista[index] = producto;
};

const productosSlice = createSlice({
  name: "productos",
  initialState: {
    items: [], 
    itemsAdmin: [], // Lista del admin (incluye inactivos)
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
      .addCase(reactivarProducto.fulfilled, (state, action) => {
        reemplazar(state.itemsAdmin, action.payload);
        state.itemsEstado = "inicial";
      })

      .addCase(deleteProducto.fulfilled, (state, action) => {
        const index = state.itemsAdmin.findIndex((p) => p.id === action.payload);
        if (index !== -1) state.itemsAdmin[index].activo = false;
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      // Después de comprar, el stock puede haber cambiado. Se marca la lista como desactualizada y el kiosco la vuelve a pedir la próxima vez que se entra.
      .addCase(confirmarCompra.fulfilled, (state) => {
        state.itemsEstado = "inicial";
        state.itemsAdminEstado = "inicial";
      })
      .addCase(cerrarSesion, (state) => {
        state.itemsAdmin = [];
        state.itemsAdminEstado = "inicial";
        state.error = null;
      });
  },
});

export default productosSlice.reducer;
