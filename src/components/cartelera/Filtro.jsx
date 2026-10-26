



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
