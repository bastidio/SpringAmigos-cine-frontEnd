import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL_SALAS = "/salas";
const URL_ASIENTOS = "/asientos";

export const fetchSalas = createAsyncThunk("salas/fetchSalas", async () => {
  const { data } = await axios.get(URL_SALAS, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

export const createSala = createAsyncThunk("salas/createSala", async (sala) => {
  const { data } = await axios.post(URL_SALAS, sala, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

export const updateSala = createAsyncThunk("salas/updateSala", async (sala) => {
  const { id, ...datos } = sala;
  const { data } = await axios.put(`${URL_SALAS}/${id}`, datos, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

export const fetchAsientos = createAsyncThunk("salas/fetchAsientos", async () => {
  const { data } = await axios.get(URL_ASIENTOS);
  return data;
});

export const createAsiento = createAsyncThunk("salas/createAsiento", async (asiento) => {
  const { data } = await axios.post(URL_ASIENTOS, asiento, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

export const deleteAsiento = createAsyncThunk("salas/deleteAsiento", async (id) => {
  await axios.delete(`${URL_ASIENTOS}/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return id;
});

const salasSlice = createSlice({
  name: "salas",
  initialState: {
    items: [],
    asientos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalas.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSalas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createSala.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload];
      })
      .addCase(updateSala.fulfilled, (state, action) => {
        const index = state.items.findIndex((sala) => sala.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(fetchAsientos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAsientos.fulfilled, (state, action) => {
        state.loading = false;
        state.asientos = action.payload;
      })
      .addCase(fetchAsientos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
