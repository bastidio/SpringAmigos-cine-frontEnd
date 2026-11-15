import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "/api/carritos";

// Todos los pedidos del carrito devuelven el carrito entero: { items, total, funcionId, expiraEn, vencido }.
export const fetchCarrito = createAsyncThunk("carrito/fetchCarrito", async () => {
  const { data } = await axios.get(URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

export const agregarItem = createAsyncThunk("carrito/agregarItem", async (body) => {
  const { data } = await axios.post(`${URL}/items`, body, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

export const modificarCantidad = createAsyncThunk("carrito/modificarCantidad", async ({ itemId, cantidad }) => {
  const { data } = await axios.put(`${URL}/items/${itemId}`, { cantidad }, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

export const eliminarItem = createAsyncThunk("carrito/eliminarItem", async (itemId) => {
  const { data } = await axios.delete(`${URL}/items/${itemId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

// El back responde vacío: el fulfilled deja el carrito vacío.
export const vaciarCarrito = createAsyncThunk("carrito/vaciarCarrito", async () => {
  await axios.delete(URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
});

// Agrega las butacas elegidas de una función. No se pueden mezclar butacas de dos funciones.
export const agregarButacas = createAsyncThunk("carrito/agregarButacas", async ({ funcionId, asientos }) => {
  const { data: carrito } = await axios.get(URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const yaEnCarrito = (carrito?.items ?? [])
    .filter((item) => item.tipo === "BUTACA")
    .map((item) => item.referenciaId);

  if (yaEnCarrito.length > 0 && carrito.funcionId !== funcionId) {
    throw new Error("Tu carrito ya tiene butacas de otra función. Quitalas desde el carrito para elegir estas.");
  }

  let ultimoCarrito = carrito;
  for (const asientoId of asientos) {
    if (!yaEnCarrito.includes(asientoId)) {
      const { data } = await axios.post(`${URL}/items`, { asientoId, funcionId, cantidad: 1 }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      ultimoCarrito = data;
    }
  }
  return ultimoCarrito;
});

const initialState = { carrito: null, loading: false, error: null, vencimiento: null };

const carritoSlice = createSlice({
  name: "carrito",
  initialState,
  reducers: {
    // El checkout vacía el carrito en el back al comprar: acá solo se refleja.
    vaciarCarritoLocal: (state) => {
      if (state.carrito === null) return;
      state.carrito = { ...state.carrito, items: [], total: 0, funcionId: null, expiraEn: null, vencido: false };
      state.error = null;
    },
    // Datos del modal "se terminó el tiempo de reserva" (null = cerrado).
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
        state.error = action.error.message;
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
        state.error = action.error.message;
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
        state.error = action.error.message;
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
        state.error = action.error.message;
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
        state.error = action.error.message;
      });
  },
});

export const { vaciarCarritoLocal, setVencimiento, limpiarCarrito } = carritoSlice.actions;
export default carritoSlice.reducer;
