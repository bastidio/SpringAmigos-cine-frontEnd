import CampoLectura from './CampoLectura';


const DatosPersonales = ({ nombre, email, telefono }) => {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-solid border-white/10 bg-[var(--superficie)] p-6">
      <h2 className="m-0 font-serif text-lg font-bold text-white">Datos personales</h2>
      <CampoLectura id="perfil-nombre" etiqueta="NOMBRE COMPLETO" valor={nombre} />
      <CampoLectura id="perfil-email" etiqueta="EMAIL" valor={email} />
      <CampoLectura id="perfil-telefono" etiqueta="TELÉFONO" valor={telefono || 'No cargado'} />
    </section>
  );
};

export default DatosPersonales;
