






const mensajesPorEstado = {
  400: 'La operación no es válida. Revisá los datos e intentá nuevamente.',
  401: 'Tu sesión venció o no iniciaste sesión. Ingresá para continuar.',
  403: 'Tenés que iniciar sesión para usar el carrito.',
  404: 'No se encontró lo que buscabas.',
  409: 'El carrito venció o una butaca ya fue ocupada. Volvé a elegir.',
};



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
