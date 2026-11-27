import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { mensajeDeError } from "./mensajeDeError";

const URL_SALAS = "/salas";
const URL_ASIENTOS = "/asientos";

export const fetchSalas = createAsyncThunk("salas/fetchSalas", async (sinDatos, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.get(URL_SALAS, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const createSala = createAsyncThunk("salas/createSala", async (sala, { getState, rejectWithValue }) => {
  try {
    const token = getState().usuario.token;
    const { data } = await axios.post(URL_SALAS, sala, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    return rejectWithValue(mensajeDeError(error));
  }
});

export const updateSala = createAsyncThunk("salas/updateSala", async (sala, { getState, rejectWithValue }) => {
  try {
    const token = getState().usuario.token;
    const { id, ...datos } = sala;
    const { data } = await axios.put(`${URL_SALAS}/${id}`, datos, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    return rejectWithValue(mensajeDeError(error));
  }
});

export const fetchAsientos = createAsyncThunk("salas/fetchAsientos", async () => {
  const { data } = await axios.get(URL_ASIENTOS);
  return data;
});

export const createAsiento = createAsyncThunk("salas/createAsiento", async (asiento, { getState, rejectWithValue }) => {
  try {
    const token = getState().usuario.token;
    const { data } = await axios.post(URL_ASIENTOS, asiento, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    return rejectWithValue(mensajeDeError(error));
  }
});

export const deleteAsiento = createAsyncThunk("salas/deleteAsiento", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().usuario.token;
    await axios.delete(`${URL_ASIENTOS}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (error) {
    return rejectWithValue(mensajeDeError(error));
  }
});

const salasSlice = createSlice({
  name: "salas",
  initialState: {
    items: [],
    asientos: [],
    salasEstado: "inicial",
    asientosEstado: "inicial",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalas.pending, (state) => {
        state.salasEstado = "cargando";
        state.error = null;
      })
      .addCase(fetchSalas.fulfilled, (state, action) => {
        state.salasEstado = "listo";
        state.items = action.payload;
      })
      .addCase(fetchSalas.rejected, (state) => {
        state.salasEstado = "inicial";
        state.error = "No se pudieron cargar las salas.";
      })
      .addCase(createSala.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload];
      })
      .addCase(updateSala.fulfilled, (state, action) => {
        const index = state.items.findIndex((sala) => sala.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(fetchAsientos.pending, (state) => {
        state.asientosEstado = "cargando";
        state.error = null;
      })
      .addCase(fetchAsientos.fulfilled, (state, action) => {
        state.asientosEstado = "listo";
        state.asientos = action.payload;
      })
      .addCase(fetchAsientos.rejected, (state) => {
        state.asientosEstado = "inicial";
        state.error = "No se pudieron cargar los asientos.";
      })
      .addCase(createAsiento.fulfilled, (state, action) => {
        state.asientos = [...state.asientos, action.payload];
      })
      .addCase(deleteAsiento.fulfilled, (state, action) => {
        state.asientos = state.asientos.filter((asiento) => asiento.id !== action.payload);
      });
  },
});

export default salasSlice.reducer;
