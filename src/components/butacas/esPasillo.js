import { esSalaVip } from '../cartelera/esSalaVip';

// Salas VIP: cada 2 butacas, así quedan de a pares. Salas comunes: uno solo en la mitad de la fila.
export const esPasillo = (i, cantidad, sala) => {
  if (esSalaVip(sala)) return i > 0 && i % 2 === 0;
  return i === Math.ceil(cantidad / 2);
};
