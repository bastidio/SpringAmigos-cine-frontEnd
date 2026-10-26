import Avatar from './Avatar';
import Badge from './Badge';



const PerfilHeader = ({ nombre, email, fotoPerfil, entradasActivas }) => {
  const textoEntradas = entradasActivas === 1 ? 'ENTRADA ACTIVA' : 'ENTRADAS ACTIVAS';

  return (
    <section className="flex flex-col items-center gap-3 rounded-xl border border-solid border-white/10 bg-[#16101f] p-6 text-center">
      <Avatar fotoPerfil={fotoPerfil} nombre={nombre} tamano={80} />

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
