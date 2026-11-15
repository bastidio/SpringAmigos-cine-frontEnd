import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL_AUTH = "/api/v1/auth";
const URL_PERFIL = "/users/me";

// El back responde { access_token, rol }. El token se guarda acá, nunca en el reducer.
export const login = createAsyncThunk("usuario/login", async ({ email, password }) => {
  const { data } = await axios.post(`${URL_AUTH}/authenticate`, { email, password });
  localStorage.setItem("token", data.access_token);
  return { accessToken: data.access_token, rol: data.rol };
});

// Registrarse también deja la sesión iniciada (el back devuelve lo mismo que el login).
export const register = createAsyncThunk("usuario/register", async (datos) => {
  const { data } = await axios.post(`${URL_AUTH}/register`, datos);
  localStorage.setItem("token", data.access_token);
  return { accessToken: data.access_token, rol: data.rol };
});

// Perfil del usuario logueado; trae el rol, así que sirve también para saber si es ADMIN.
export const fetchPerfil = createAsyncThunk("usuario/fetchPerfil", async () => {
  const { data } = await axios.get(URL_PERFIL, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

const usuarioSlice = createSlice({
  name: "usuario",
  initialState: {
    token: localStorage.getItem("token") || "",
    rol: null,
    perfil: null,
    loading: false,
    error: null,
  },
  reducers: {
    cerrarSesion: (state) => {
      state.token = "";
      state.rol = null;
      state.perfil = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken;
        state.rol = action.payload.rol;
        state.perfil = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken;
        state.rol = action.payload.rol;
        state.perfil = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPerfil.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPerfil.fulfilled, (state, action) => {
        state.loading = false;
        // Si cerró sesión mientras el pedido seguía en curso, no se guarda nada.
        if (state.token === "") return;
        state.perfil = action.payload;
        state.rol = action.payload.rol;
      })
      .addCase(fetchPerfil.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { cerrarSesion } = usuarioSlice.actions;
export default usuarioSlice.reducer;
