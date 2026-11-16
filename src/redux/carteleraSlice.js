import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL_PELICULAS = "/peliculas";
const URL_FUNCIONES = "/funciones";

export const fetchPeliculas = createAsyncThunk("cartelera/fetchPeliculas", async () => {
  const { data } = await axios.get(`${URL_PELICULAS}/cartelera`);
  return data;
});

export const fetchTodasPeliculas = createAsyncThunk("cartelera/fetchTodasPeliculas", async () => {
  const { data } = await axios.get(URL_PELICULAS, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

export const fetchPelicula = createAsyncThunk("cartelera/fetchPelicula", async (id) => {
  const { data } = await axios.get(`${URL_PELICULAS}/${id}`);
  return data;
});

export const createPelicula = createAsyncThunk("cartelera/createPelicula", async (pelicula) => {
  const { data } = await axios.post(URL_PELICULAS, pelicula, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

export const updatePelicula = createAsyncThunk("cartelera/updatePelicula", async (pelicula) => {
  const { id, ...datos } = pelicula;
  const { data } = await axios.put(`${URL_PELICULAS}/${id}`, datos, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

export const deletePelicula = createAsyncThunk("cartelera/deletePelicula", async (id) => {
  await axios.delete(`${URL_PELICULAS}/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
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

export const createFuncion = createAsyncThunk("cartelera/createFuncion", async (funcion) => {
  const { data } = await axios.post(URL_FUNCIONES, funcion, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

export const updateFuncion = createAsyncThunk("cartelera/updateFuncion", async (funcion) => {
  const { id, ...datos } = funcion;
  const { data } = await axios.put(`${URL_FUNCIONES}/${id}`, datos, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data;
});

export const deleteFuncion = createAsyncThunk("cartelera/deleteFuncion", async (id) => {
  await axios.delete(`${URL_FUNCIONES}/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
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

const carteleraSlice = createSlice({
  name: "cartelera",
  initialState: {
    peliculas: [],
    peliculaSeleccionada: null,
    funciones: [],
    funcionSeleccionada: null,
    funcionCarrito: null,
    butacas: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Películas
      .addCase(fetchPeliculas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPeliculas.fulfilled, (state, action) => {
        state.loading = false;
        state.peliculas = action.payload;
      })
      .addCase(fetchPeliculas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTodasPeliculas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodasPeliculas.fulfilled, (state, action) => {
        state.loading = false;
        state.peliculas = action.payload;
      })
      .addCase(fetchTodasPeliculas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPelicula.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPelicula.fulfilled, (state, action) => {
        state.loading = false;
        state.peliculaSeleccionada = action.payload;
      })
      .addCase(fetchPelicula.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPelicula.fulfilled, (state, action) => {
        state.peliculas = [...state.peliculas, action.payload];
      })
      .addCase(updatePelicula.fulfilled, (state, action) => {
        const index = state.peliculas.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.peliculas[index] = action.payload;
      })
      .addCase(deletePelicula.fulfilled, (state, action) => {
        state.peliculas = state.peliculas.filter((p) => p.id !== action.payload);
      })
      // Funciones
      .addCase(fetchFunciones.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFunciones.fulfilled, (state, action) => {
        state.loading = false;
        state.funciones = action.payload;
      })
      .addCase(fetchFunciones.rejected, (state) => {
        state.loading = false;
        state.funciones = [];
      })
      .addCase(fetchFuncion.fulfilled, (state, action) => {
        state.funcionCarrito = action.payload;
      })
      .addCase(createFuncion.fulfilled, (state, action) => {
        state.funciones = [...state.funciones, action.payload];
      })
      .addCase(updateFuncion.fulfilled, (state, action) => {
        const index = state.funciones.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) state.funciones[index] = action.payload;
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
      .addCase(fetchButacas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default carteleraSlice.reducer;
