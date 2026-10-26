import CampoLectura from './CampoLectura';


const DatosPersonales = ({ nombre, email, telefono }) => {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-solid border-white/10 bg-[#16101f] p-6">
      <h2 className="m-0 font-serif text-lg font-bold text-white">Datos personales</h2>
      <CampoLectura id="perfil-nombre" etiqueta="NOMBRE COMPLETO" valor={nombre} />
      <CampoLectura id="perfil-email" etiqueta="EMAIL" valor={email} />
      {/* El telefono es opcional al registrarse: si no lo cargo, el back
          manda "" (o nada, si es un back viejo) y se muestra un aviso. */}
      <CampoLectura id="perfil-telefono" etiqueta="TELÉFONO" valor={telefono || 'No cargado'} />
    </section>
  );
};

export default DatosPersonales;
