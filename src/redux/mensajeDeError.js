// Arma un mensaje en español para el usuario a partir del error de axios.
export const mensajeDeError = (error) => {
  if (!error.response) {
    return "No se pudo conectar con el servidor. Intentá de nuevo.";
  }
  const status = error.response.status;
  if (status === 401 || status === 403) {
    return "Tu sesión venció. Volvé a ingresar.";
  }
  if (status === 404) {
    return "No se encontró lo que buscabas.";
  }
  if (status === 400 || status === 409) {
    const data = error.response.data;
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
  return "Ocurrió un error. Intentá de nuevo.";
};
