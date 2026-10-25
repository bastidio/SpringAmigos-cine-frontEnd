export const butacasFaltantes = (asientosDeSala, filas, porFila) => {
  const existentes = new Set(asientosDeSala.map((asiento) => `${asiento.fila}-${asiento.numero}`));
  const faltantes = [];

  for (let fila = 1; fila <= filas; fila++) {
    for (let numero = 1; numero <= porFila; numero++) {
      if (!existentes.has(`${fila}-${numero}`)) {
        faltantes.push({ fila, numero });
      }
    }
  }

  return faltantes;
};

export const butacasSobrantes = (asientosDeSala, filas, porFila) =>
  asientosDeSala.filter((asiento) => asiento.fila > filas || asiento.numero > porFila);

export const butacasTotales = (sala, asientos, estado) => {
  if (estado === 'cargando') return null;

  const propias = estado === 'listo'
    ? asientos.filter((asiento) => asiento.sala?.id === sala.id).length
    : 0;
  return propias > 0 ? propias : sala.capacidad;
};

export const agruparPorFila = (butacas) => {
  const grupos = new Map();
  for (const butaca of butacas) {
    if (!grupos.has(butaca.fila)) grupos.set(butaca.fila, []);
    grupos.get(butaca.fila).push(butaca);
  }
  return [...grupos.values()];
};
