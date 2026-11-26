import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "/api/carritos";

// todos los pedidos devuelven el carrito entero, tiene items, total, funcionId, expiraEn y vencido
export const fetchCarrito = createAsyncThunk("carrito/fetchCarrito", async (sinDatos, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.get(URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const agregarItem = createAsyncThunk("carrito/agregarItem", async (body, { getState, rejectWithValue }) => {
  try {
    const token = getState().usuario.token;
    const { data } = await axios.post(`${URL}/items`, body, {
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

export const modificarCantidad = createAsyncThunk("carrito/modificarCantidad", async ({ itemId, cantidad }, { getState, rejectWithValue }) => {
  try {
    const token = getState().usuario.token;
    const { data } = await axios.put(`${URL}/items/${itemId}`, { cantidad }, {
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

export const eliminarItem = createAsyncThunk("carrito/eliminarItem", async (itemId, { getState, rejectWithValue }) => {
  try {
    const token = getState().usuario.token;
    const { data } = await axios.delete(`${URL}/items/${itemId}`, {
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

export const vaciarCarrito = createAsyncThunk("carrito/vaciarCarrito", async (sinDatos, { getState, rejectWithValue }) => {
  try {
    const token = getState().usuario.token;
    await axios.delete(URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue("Ocurrió un error. Intentá de nuevo.");
  }
});

export const agregarButacas = createAsyncThunk("carrito/agregarButacas", async ({ funcionId, asientos }, { getState, rejectWithValue }) => {
  try {
    const token = getState().usuario.token;
    // El carrito ya esta en el store, no hace falta pedirlo de nuevo al back.
    const carrito = getState().carrito.carrito;

    const yaEnCarrito = (carrito?.items ?? [])
      .filter((item) => item.tipo === "BUTACA")
      .map((item) => item.referenciaId);

    if (yaEnCarrito.length > 0 && carrito.funcionId !== funcionId) {
      return rejectWithValue("Tu carrito ya tiene butacas de otra función. Quitalas desde el carrito para elegir estas.");
    }

    let ultimoCarrito = carrito;
    for (const asientoId of asientos) {
      if (!yaEnCarrito.includes(asientoId)) {
        const { data } = await axios.post(`${URL}/items`, { asientoId, funcionId, cantidad: 1 }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        ultimoCarrito = data;
      }
    }
    return ultimoCarrito;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue("Ocurrió un error. Intentá de nuevo.");
  }
});

const initialState = { carrito: null, loading: false, error: null, vencimiento: null };

const carritoSlice = createSlice({
  name: "carrito",
  initialState,
  reducers: {
    vaciarCarritoLocal: (state) => {
      if (state.carrito === null) return;
      state.carrito = { ...state.carrito, items: [], total: 0, funcionId: null, expiraEn: null, vencido: false };
      state.error = null;
    },
    // cartel de "se termino el tiempo de reserva"
    setVencimiento: (state, action) => {
      state.vencimiento = action.payload;
    },
    limpiarCarrito: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarrito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarrito.fulfilled, (state, action) => {
        state.loading = false;
        state.carrito = action.payload;
      })
      .addCase(fetchCarrito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(agregarItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(agregarItem.fulfilled, (state, action) => {
        state.loading = false;
        state.carrito = action.payload;
      })
      .addCase(agregarItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(modificarCantidad.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(modificarCantidad.fulfilled, (state, action) => {
        state.loading = false;
        state.carrito = action.payload;
      })
      .addCase(modificarCantidad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(eliminarItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarItem.fulfilled, (state, action) => {
        state.loading = false;
        state.carrito = action.payload;
      })
      .addCase(eliminarItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(vaciarCarrito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(vaciarCarrito.fulfilled, (state) => {
        state.loading = false;
        if (state.carrito === null) return;
        state.carrito = { ...state.carrito, items: [], total: 0, funcionId: null, expiraEn: null, vencido: false };
      })
      .addCase(vaciarCarrito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(agregarButacas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(agregarButacas.fulfilled, (state, action) => {
        state.loading = false;
        state.carrito = action.payload;
      })
      .addCase(agregarButacas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { vaciarCarritoLocal, setVencimiento, limpiarCarrito } = carritoSlice.actions;
export default carritoSlice.reducer;
