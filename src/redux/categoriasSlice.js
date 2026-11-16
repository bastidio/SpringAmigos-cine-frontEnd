import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "/categorias";

export const fetchCategorias = createAsyncThunk("categorias/fetchCategorias", async () => {
  const { data } = await axios.get(URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

const categoriasSlice = createSlice({
  name: "categorias",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorias.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategorias.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategorias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categoriasSlice.reducer;
