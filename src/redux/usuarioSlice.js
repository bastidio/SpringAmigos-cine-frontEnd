import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { mensajeDeError } from "./mensajeDeError";
import { confirmarCompra } from "./ordenesSlice";

const URL_AUTH = "/api/v1/auth";
const URL_PERFIL = "/users/me";

export const login = createAsyncThunk("usuario/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_AUTH}/authenticate`, { email, password });
    return {
      accessToken: data.access_token,
      rol: data.rol,
      avatar: { nombre: data.nombre, fotoPerfil: data.fotoPerfil },
    };
  } catch (error) {
    return rejectWithValue(mensajeDeError(error));
  }
});

export const register = createAsyncThunk("usuario/register", async (datos, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_AUTH}/register`, datos);
    return {
      accessToken: data.access_token,
      rol: data.rol,
      avatar: { nombre: data.nombre, fotoPerfil: data.fotoPerfil },
    };
  } catch (error) {
    return rejectWithValue(mensajeDeError(error));
  }
});

// como el perfil del usuario ya trae el rol, también sirve para saber si es ADMIN
export const fetchPerfil = createAsyncThunk("usuario/fetchPerfil", async (sinDatos, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.get(URL_PERFIL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

const usuarioSlice = createSlice({
  name: "usuario",
  initialState: {
    token: "",
    rol: null,
    perfil: null,
    avatar: null,
    loading: false,
    error: null,
  },
  reducers: {
    cerrarSesion: (state) => {
      state.token = "";
      state.rol = null;
      state.perfil = null;
      state.avatar = null;
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
        state.avatar = action.payload.avatar;
        state.perfil = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken;
        state.rol = action.payload.rol;
        state.avatar = action.payload.avatar;
        state.perfil = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPerfil.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPerfil.fulfilled, (state, action) => {
        state.loading = false;
        // Si cerró sesión mientras había un pedido sin terminar, no se guarda
        if (state.token === "") return;
        state.perfil = action.payload;
        state.rol = action.payload.rol;
      })
      .addCase(fetchPerfil.rejected, (state) => {
        state.loading = false;
        state.error = "No se pudo cargar tu perfil.";
      })
      // Después de comprar cambian las entradas activas: el menú vuelve a pedir el perfil al abrirse.
      .addCase(confirmarCompra.fulfilled, (state) => {
        state.perfil = null;
      });
  },
});

export const { cerrarSesion } = usuarioSlice.actions;
export default usuarioSlice.reducer;
