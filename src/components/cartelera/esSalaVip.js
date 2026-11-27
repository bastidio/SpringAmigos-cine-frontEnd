// Las salas con tipo null (cargadas antes de existir el campo) cuentan como comunes.
export const esSalaVip = (sala) => sala.tipo === "VIP";
