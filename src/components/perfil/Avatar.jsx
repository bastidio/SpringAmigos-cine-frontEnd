import { useState } from 'react';

// Primera letra de la primera y de la ultima palabra del nombre ("Lorena
// Gomez" -> "LG"). Con una sola palabra, una letra; sin nombre, "?".
const iniciales = (nombre) => {
  const palabras = (nombre ?? '').trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return '?';
  const primera = palabras[0].charAt(0);
  const ultima = palabras.length > 1 ? palabras[palabras.length - 1].charAt(0) : '';
  return (primera + ultima).toUpperCase();
};

// Componente "tonto" reutilizable: la foto de perfil en un circulo. Si no hay
// foto, o la URL no carga (onError), muestra un circulo violeta con las
// iniciales. "tamano" es el lado en px (el nav usa 32, el perfil 80).
const Avatar = ({ fotoPerfil, nombre, tamano = 40 }) => {
  // Guarda la URL que fallo (no un booleano): si mas adelante llega otra foto,
  // se vuelve a intentar sin necesidad de un efecto que reinicie el estado.
  const [urlFallida, setUrlFallida] = useState(null);
  const hayFoto = Boolean(fotoPerfil) && fotoPerfil !== urlFallida;

  // El tamano es dinamico, asi que va en style (Tailwind no arma clases con
  // valores que se calculan al renderizar).
  const medidas = { width: tamano, height: tamano };

  if (hayFoto) {
    return (
      <img
        src={fotoPerfil}
        alt={nombre ? `Foto de ${nombre}` : 'Foto de perfil'}
        style={medidas}
        className="shrink-0 rounded-full object-cover"
        onError={() => setUrlFallida(fotoPerfil)}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={nombre ? `Avatar de ${nombre}` : 'Avatar'}
      style={{ ...medidas, fontSize: Math.round(tamano * 0.4) }}
      className="flex shrink-0 select-none items-center justify-center rounded-full bg-violet-600 font-serif font-bold leading-none text-white"
    >
      {iniciales(nombre)}
    </span>
  );
};

export default Avatar;
