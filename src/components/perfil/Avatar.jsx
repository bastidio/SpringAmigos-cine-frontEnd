import { useState } from 'react';



const iniciales = (nombre) => {
  const palabras = (nombre ?? '').trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return '?';
  const primera = palabras[0].charAt(0);
  const ultima = palabras.length > 1 ? palabras[palabras.length - 1].charAt(0) : '';
  return (primera + ultima).toUpperCase();
};




const Avatar = ({ fotoPerfil, nombre, tamano = 40 }) => {
  
  
  const [urlFallida, setUrlFallida] = useState(null);
  const hayFoto = Boolean(fotoPerfil) && fotoPerfil !== urlFallida;

  
  
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
