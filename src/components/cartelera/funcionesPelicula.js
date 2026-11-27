import { esSalaVip } from './esSalaVip';

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const dosDigitos = (n) => String(n).padStart(2, '0');

const etiquetaDia = (fecha, ahora) => {
  const inicioDia = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dias = Math.round((inicioDia(fecha) - inicioDia(ahora)) / 86400000);
  if (dias === 0) return 'Hoy';
  if (dias === 1) return 'Mañana';
  return `${DIAS[fecha.getDay()]} ${dosDigitos(fecha.getDate())}/${dosDigitos(fecha.getMonth() + 1)}`;
};

export const funcionesFuturas = (funciones, peliculaId, ahora) =>
  funciones.filter((f) => f.pelicula.id === peliculaId && new Date(f.horario) > ahora);

// Las 3 próximas funciones de una película, ya listas para mostrar en la tarjeta.
// Con soloVip se cuentan únicamente las funciones en sala VIP.
export const proximasFunciones = (funciones, peliculaId, ahora, soloVip = false) =>
  funcionesFuturas(funciones, peliculaId, ahora)
    .filter((f) => !soloVip || esSalaVip(f.sala))
    .sort((a, b) => new Date(a.horario) - new Date(b.horario))
    .slice(0, 3)
    .map((f) => {
      const fecha = new Date(f.horario);
      return {
        id: f.id,
        dia: etiquetaDia(fecha, ahora),
        hora: `${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}`,
        idioma: /sub/i.test(f.idioma) ? 'Sub' : 'Dob',
        disponible: f.entradasVendidas < f.sala.capacidad,
        sala: f.sala.nombre,
        premium: esSalaVip(f.sala),
      };
    });

export const tieneFuncionVip = (funciones, peliculaId, ahora) =>
  funcionesFuturas(funciones, peliculaId, ahora).some((f) => esSalaVip(f.sala));

// "Estreno 28/11" si la primera función (contando las pasadas) es de mañana en adelante.
// Si no es un próximo estreno, devuelve null.
export const textoEstreno = (funciones, peliculaId, ahora) => {
  const [primera] = funciones
    .filter((f) => f.pelicula.id === peliculaId)
    .map((f) => f.horario)
    .sort();
  const hoy = `${ahora.getFullYear()}-${dosDigitos(ahora.getMonth() + 1)}-${dosDigitos(ahora.getDate())}`;
  if (!primera || primera.slice(0, 10) <= hoy) return null;
  return `Estreno ${primera.slice(8, 10)}/${primera.slice(5, 7)}`;
};
