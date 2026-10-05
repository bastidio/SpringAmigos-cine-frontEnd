// Componente "tonto" y reutilizable: un desplegable. PeliculaList lo usa dos
// veces (clasificacion e idioma). Es un formulario controlado: el valor elegido
// vive en el estado del padre y llega por props; cuando el usuario cambia la
// opcion, se le avisa al padre con la funcion cambiar.
const Filtro = ({ etiqueta, valor, opciones, cambiar }) => {
  return (
    <select
      className="filtro"
      aria-label={etiqueta}
      value={valor}
      onChange={(e) => cambiar(e.target.value)}
    >
      <option value="Todos">Todos</option>
      {opciones.map((opcion) => (
        <option key={opcion} value={opcion}>
          {opcion}
        </option>
      ))}
    </select>
  );
};

export default Filtro;
