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
