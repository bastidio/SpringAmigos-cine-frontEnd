// Validaciones y formato de la tarjeta (pago simulado). Son funciones puras: no guardan nada.

export const soloDigitos = (valor) => valor.replace(/\D/g, '');

// Marca segun los primeros digitos: 4 = Visa, 51-55 = Mastercard, 34/37 = Amex.
export const marcaDe = (digitos) => {
  if (/^4/.test(digitos)) return 'Visa';
  if (/^5[1-5]/.test(digitos)) return 'Mastercard';
  if (/^3[47]/.test(digitos)) return 'Amex';
  return null;
};

// Agrupa el numero: de a 4 (Amex: 4-6-5).
export const formatearNumero = (valor) => {
  const digitos = soloDigitos(valor);
  if (marcaDe(digitos) === 'Amex') {
    const amex = digitos.slice(0, 15);
    return [amex.slice(0, 4), amex.slice(4, 10), amex.slice(10)].filter(Boolean).join(' ');
  }
  return (digitos.slice(0, 16).match(/.{1,4}/g) ?? []).join(' ');
};

// MM/AA: agrega la barra sola despues del mes.
export const formatearVencimiento = (valor) => {
  const digitos = soloDigitos(valor).slice(0, 4);
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
};

// Algoritmo de Luhn.
const cumpleLuhn = (digitos) => {
  let suma = 0;
  for (let i = 0; i < digitos.length; i += 1) {
    let digito = Number(digitos[digitos.length - 1 - i]);
    if (i % 2 === 1) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    suma += digito;
  }
  return suma % 10 === 0;
};

// Cada funcion devuelve '' si el campo es valido, o el mensaje de error.
export const errorNumero = (valor) => {
  const digitos = soloDigitos(valor);
  if (digitos === '') return 'Ingresá el número de la tarjeta.';
  const largo = marcaDe(digitos) === 'Amex' ? 15 : 16;
  if (digitos.length !== largo) return `El número debe tener ${largo} dígitos.`;
  if (!cumpleLuhn(digitos)) return 'El número de la tarjeta no es válido.';
  return '';
};

export const errorTitular = (valor) =>
  valor.trim() === '' ? 'Ingresá el nombre del titular.' : '';

export const errorVencimiento = (valor, ahora = new Date()) => {
  if (!/^\d{2}\/\d{2}$/.test(valor)) return 'Ingresá el vencimiento como MM/AA.';
  const mes = Number(valor.slice(0, 2));
  const anio = 2000 + Number(valor.slice(3));
  if (mes < 1 || mes > 12) return 'El mes debe estar entre 01 y 12.';
  // La tarjeta vale hasta el ultimo dia del mes: vence al llegar el primer dia del siguiente.
  if (new Date(anio, mes, 1) <= ahora) return 'La tarjeta está vencida.';
  return '';
};

export const errorCodigo = (valor, marca) => {
  const largo = marca === 'Amex' ? 4 : 3;
  return /^\d+$/.test(valor) && valor.length === largo
    ? ''
    : `El código debe tener ${largo} dígitos.`;
};
