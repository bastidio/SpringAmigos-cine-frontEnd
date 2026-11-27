import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { mensajeDeError } from "./mensajeDeError";
import { cerrarSesion } from "./usuarioSlice";

const URL_PELICULAS = "/peliculas";
const URL_FUNCIONES = "/funciones";

export const fetchPeliculas = createAsyncThunk("cartelera/fetchPeliculas", async () => {
  const { data } = await axios.get(`${URL_PELICULAS}/cartelera`);
  return data;
});

export const fetchTodasPeliculas = createAsyncThunk("cartelera/fetchTodasPeliculas", async (sinDatos, { getState }) => {
  const token = getState().usuario.token;
  const { data } = await axios.get(URL_PELICULAS, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
});

export const fetchPelicula = createAsyncThunk("cartelera/fetchPelicula", async (id) => {
  const { data } = await axios.get(`${URL_PELICULAS}/${id}`);
  return data;
});

export const createPelicula = createAsyncThunk("cartelera/createPelicula", async (pelicula, { getState, rejectWithValue }) => {
  const token = getState().usuario.token;
  const respuesta = await axios.post(URL_PELICULAS, pelicula, {
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true,
  });
  if (respuesta.status >= 400) {
    return rejectWithValue(mensajeDeError(respuesta));
  }
  return respuesta.data;
});

export const updatePelicula = createAsyncThunk("cartelera/updatePelicula", async (pelicula, { getState, rejectWithValue }) => {
  const token = getState().usuario.token;
  const { id, ...datos } = pelicula;
  const respuesta = await axios.put(`${URL_PELICULAS}/${id}`, datos, {
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true,
  });
  if (respuesta.status >= 400) {
    return rejectWithValue(mensajeDeError(respuesta));
  }
  return respuesta.data;
});

export const deletePelicula = createAsyncThunk("cartelera/deletePelicula", async (id, { getState, rejectWithValue }) => {
  const token = getState().usuario.token;
  const respuesta = await axios.delete(`${URL_PELICULAS}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true,
  });
  if (respuesta.status >= 400) {
    return rejectWithValue(mensajeDeError(respuesta));
  }
  return id;
});


export const fetchFunciones = createAsyncThunk("cartelera/fetchFunciones", async () => {
  const { data } = await axios.get(URL_FUNCIONES);
  return data;
});

export const fetchFuncion = createAsyncThunk("cartelera/fetchFuncion", async (id) => {
  const { data } = await axios.get(`${URL_FUNCIONES}/${id}`);
  return data;
});

export const createFuncion = createAsyncThunk("cartelera/createFuncion", async (funcion, { getState, rejectWithValue }) => {
  const token = getState().usuario.token;
  const respuesta = await axios.post(URL_FUNCIONES, funcion, {
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true,
  });
  if (respuesta.status >= 400) {
    return rejectWithValue(mensajeDeError(respuesta));
  }
  return respuesta.data;
});

export const updateFuncion = createAsyncThunk("cartelera/updateFuncion", async (funcion, { getState, rejectWithValue }) => {
  const token = getState().usuario.token;
  const { id, ...datos } = funcion;
  const respuesta = await axios.put(`${URL_FUNCIONES}/${id}`, datos, {
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true,
  });
  if (respuesta.status >= 400) {
    return rejectWithValue(mensajeDeError(respuesta));
  }
  return respuesta.data;
});

export const deleteFuncion = createAsyncThunk("cartelera/deleteFuncion", async (id, { getState, rejectWithValue }) => {
  const token = getState().usuario.token;
  const respuesta = await axios.delete(`${URL_FUNCIONES}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true,
  });
  if (respuesta.status >= 400) {
    return rejectWithValue(mensajeDeError(respuesta));
  }
  return id;
});

export const fetchButacas = createAsyncThunk("cartelera/fetchButacas", async (funcionId) => {
  const [respuestaFuncion, respuestaAsientos, respuestaOcupacion] = await Promise.all([
    axios.get(`${URL_FUNCIONES}/${funcionId}`),
    axios.get("/asientos"),
    axios.get(`/entradas/funcion/${funcionId}`),
  ]);
  const funcion = respuestaFuncion.data;
  const ocupacion = respuestaOcupacion.data;

  const butacas = respuestaAsientos.data
    .filter((asiento) => asiento.sala.id === funcion.sala.id)
    .sort((a, b) => a.fila - b.fila || a.numero - b.numero)
    .map((asiento) => {
      const fila = String.fromCharCode(64 + asiento.fila);
      return {
        id: asiento.id,
        fila,
        nombre: fila + asiento.numero,
        estado: ocupacion.asientosOcupados.includes(asiento.id) ? "OCUPADA" : "LIBRE",
      };
    });

  return { funcion, butacas };
});

// Reemplaza el elemento en la lista si ya estaba (se usa en los fulfilled de update).
const reemplazar = (lista, elemento) => {
  const index = lista.findIndex((item) => item.id === elemento.id);
  if (index !== -1) lista[index] = elemento;
};

const carteleraSlice = createSlice({
  name: "cartelera",
  initialState: {
    peliculas: [], 
    todasPeliculas: [], 
    peliculaSeleccionada: null,
    funciones: [],
    funcionSeleccionada: null,
    funcionCarrito: null,
    butacas: [],
    peliculasEstado: "inicial",
    todasPeliculasEstado: "inicial",
    funcionesEstado: "inicial",
    loading: true,
    error: null,
    errorFunciones: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPeliculas.pending, (state) => {
        state.peliculasEstado = "cargando";
        state.error = null;
      })
      .addCase(fetchPeliculas.fulfilled, (state, action) => {
        state.peliculasEstado = "listo";
        state.peliculas = action.payload;
      })
      .addCase(fetchPeliculas.rejected, (state) => {
        state.peliculasEstado = "inicial";
        state.error = "No se pudieron cargar las películas.";
      })
      .addCase(fetchTodasPeliculas.pending, (state) => {
        state.todasPeliculasEstado = "cargando";
        state.error = null;
      })
      .addCase(fetchTodasPeliculas.fulfilled, (state, action) => {
        state.todasPeliculasEstado = "listo";
        state.todasPeliculas = action.payload;
      })
      .addCase(fetchTodasPeliculas.rejected, (state) => {
        state.todasPeliculasEstado = "inicial";
        state.error = "No se pudieron cargar las películas.";
      })
      .addCase(fetchPelicula.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPelicula.fulfilled, (state, action) => {
        state.loading = false;
        state.peliculaSeleccionada = action.payload;
      })
      .addCase(fetchPelicula.rejected, (state) => {
        state.loading = false;
        state.error = "No se pudo cargar la película.";
      })
      .addCase(createPelicula.fulfilled, (state, action) => {
        state.todasPeliculas = [...state.todasPeliculas, action.payload];
        state.peliculasEstado = "inicial";
      })
      .addCase(updatePelicula.fulfilled, (state, action) => {
        reemplazar(state.todasPeliculas, action.payload);
        reemplazar(state.peliculas, action.payload);
      })
      .addCase(deletePelicula.fulfilled, (state, action) => {
        state.todasPeliculas = state.todasPeliculas.filter((p) => p.id !== action.payload);
        state.peliculas = state.peliculas.filter((p) => p.id !== action.payload);
      })
      .addCase(fetchFunciones.pending, (state) => {
        state.funcionesEstado = "cargando";
        state.errorFunciones = null;
      })
      .addCase(fetchFunciones.fulfilled, (state, action) => {
        state.funcionesEstado = "listo";
        state.funciones = action.payload;
      })
      .addCase(fetchFunciones.rejected, (state) => {
        state.funcionesEstado = "inicial";
        state.errorFunciones = "No se pudieron cargar las funciones.";
      })
      .addCase(fetchFuncion.fulfilled, (state, action) => {
        state.funcionCarrito = action.payload;
      })
      .addCase(createFuncion.fulfilled, (state, action) => {
        state.funciones = [...state.funciones, action.payload];
      })
      .addCase(updateFuncion.fulfilled, (state, action) => {
        reemplazar(state.funciones, action.payload);
      })
      .addCase(deleteFuncion.fulfilled, (state, action) => {
        state.funciones = state.funciones.filter((f) => f.id !== action.payload);
      })
      .addCase(fetchButacas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchButacas.fulfilled, (state, action) => {
        state.loading = false;
        state.funcionSeleccionada = action.payload.funcion;
        state.butacas = action.payload.butacas;
      })
      .addCase(fetchButacas.rejected, (state) => {
        state.loading = false;
        state.error = "No se pudieron cargar las butacas.";
      })
      .addCase(cerrarSesion, (state) => {
        state.todasPeliculas = [];
        state.todasPeliculasEstado = "inicial";
        state.error = null;
      });
  },
});

export default carteleraSlice.reducer;
