import Badge from './Badge';

// Componente "tonto": tarjeta de arriba con el avatar, el nombre, el email
// y la etiqueta de entradas activas. Todo sale de las props.
const PerfilHeader = ({ nombre, email, entradasActivas }) => {
  // El avatar muestra la primera letra del nombre.
  const inicial = nombre.charAt(0).toUpperCase();
  const textoEntradas = entradasActivas === 1 ? 'ENTRADA ACTIVA' : 'ENTRADAS ACTIVAS';

  return (
    <section className="flex flex-col items-center gap-3 rounded-xl border border-solid border-white/10 bg-[#16101f] p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-600 font-serif text-3xl font-bold text-white">
        {inicial}
      </div>

      <div>
        <h2 className="m-0 font-serif text-2xl font-bold text-white">{nombre}</h2>
        <p className="m-0 mt-1 text-sm text-gray-400">{email}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Badge texto={`${entradasActivas} ${textoEntradas}`} variante="dorado" />
      </div>
    </section>
  );
};

export default PerfilHeader;
