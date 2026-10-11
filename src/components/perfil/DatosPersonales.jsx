import CampoLectura from './CampoLectura';

// Componente "tonto": tarjeta con los datos personales, solo lectura.
const DatosPersonales = ({ nombre, email }) => {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-solid border-white/10 bg-[#16101f] p-6">
      <h2 className="m-0 font-serif text-lg font-bold text-white">Datos personales</h2>
      <CampoLectura id="perfil-nombre" etiqueta="NOMBRE COMPLETO" valor={nombre} />
      <CampoLectura id="perfil-email" etiqueta="EMAIL" valor={email} />
    </section>
  );
};

export default DatosPersonales;
