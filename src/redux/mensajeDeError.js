// Cuando el back no responde (apagado o sin red) axios tira excepción y el thunk queda rejected sin payload: se muestra este texto.
export const SIN_CONEXION = "No se pudo conectar con el servidor. Intentá de nuevo.";

// Arma un mensaje en español para el usuario a partir de la respuesta de error de axios (status y data).
export const mensajeDeError = (respuesta) => {
  const status = respuesta.status;
  if (status === 401 || status === 403) {
    return "Tu sesión venció. Volvé a ingresar.";
  }
  if (status === 404) {
    return "No se encontró lo que buscabas.";
  }
  if (status === 400 || status === 409) {
    const data = respuesta.data;
    if (typeof data === "string" && data.trim() !== "") {
      return data;
    }
    // Errores de validación del back (campo -> motivo): el message general es técnico, se muestran los motivos.
    if (data && data.validationErrors && typeof data.validationErrors === "object") {
      const motivos = Object.values(data.validationErrors);
      if (motivos.length > 0) {
        return motivos.join(" ");
      }
    }
    if (data && typeof data.message === "string" && data.message.trim() !== "") {
      return data.message;
    }
    return "No se pudo completar la operación. Revisá los datos.";
  }
  // En desarrollo, con el back apagado, el proxy de Vite responde 500 en vez de dejar la petición sin respuesta.
  if (status >= 500) {
    return "El servidor no está disponible en este momento. Intentá de nuevo más tarde.";
  }
  return "Ocurrió un error. Intentá de nuevo.";
};
