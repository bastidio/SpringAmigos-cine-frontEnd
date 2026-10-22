// Wrapper de fetch para las rutas que necesitan sesion (carrito, checkout,
// entradas). Agrega el token guardado en el login, manda el body como JSON
// y, si el back responde con error, tira un Error con un mensaje para mostrar.

// El back usa @ResponseStatus(reason = ...) pero sin
// server.error.include-message=always el mensaje llega vacio, asi que se
// arma uno segun el codigo.
const mensajesPorEstado = {
  400: 'La operación no es válida. Revisá los datos e intentá nuevamente.',
  401: 'Tu sesión venció o no iniciaste sesión. Ingresá para continuar.',
  403: 'Tenés que iniciar sesión para usar el carrito.',
  404: 'No se encontró lo que buscabas.',
  409: 'El carrito venció o una butaca ya fue ocupada. Volvé a elegir.',
};

// "token" es opcional: si el componente lo recibe por props (el carrito) lo
// pasa aca; si no, se usa el guardado en el login, como hasta ahora.
export const apiFetch = async (url, { body, headers, token = localStorage.getItem('token'), ...opciones } = {}) => {

  const res = await fetch(url, {
    ...opciones,
    headers: {
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 204 (por ejemplo, DELETE /api/carritos) no trae cuerpo.
  const texto = await res.text();
  let data;
  try {
    data = texto ? JSON.parse(texto) : null;
  } catch {
    data = texto;
  }

  if (!res.ok) {
    const mensajeBack = data && typeof data === 'object' ? data.message || data.mensaje : null;
    const error = new Error(
      mensajeBack || mensajesPorEstado[res.status] || `Error ${res.status} al comunicarse con el servidor.`
    );
    error.status = res.status;
    throw error;
  }

  return data;
};
