import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// /ordenes solo lo puede ver un ADMIN: según la respuesta sabemos el rol.
const URL = "/ordenes";

export const obtenerRol = createAsyncThunk("usuario/obtenerRol", async (token, { signal }) => {
  const { status } = await axios(URL, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
    validateStatus: (s) => (s >= 200 && s < 300) || s === 401 || s === 403,
  });

  if (status === 401) throw new Error("SESION_VENCIDA");
  if (status === 403) return "USER";
  return "ADMIN";
});

const usuarioSlice = createSlice({
  name: "usuario",
  initialState: {
    token: localStorage.getItem("token") || "",
    rol: null, 
    loading: false,
    error: null,
  },
  reducers: {
    sesionIniciada: (state, action) => {
      state.token = action.payload;
      state.rol = null;
      state.error = null;
    },
    sesionCerrada: (state) => {
      state.token = "";
      state.rol = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(obtenerRol.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerRol.fulfilled, (state, action) => {
        state.loading = false;
        state.rol = action.payload;
      })
      .addCase(obtenerRol.rejected, (state, action) => {
        state.loading = false;
        // Cancelado o sesión vencida: no se toca el rol, de eso se encarga cerrar sesión.
        if (action.meta.aborted || action.error.message === "SESION_VENCIDA") return;
        state.error = action.error.message;
        state.rol = ""; // no se pudo saber: se trata como no-admin
      });
  },
});

export const { sesionIniciada, sesionCerrada } = usuarioSlice.actions;
export default usuarioSlice.reducer;
