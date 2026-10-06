// Componente "tonto": la fila de botones para elegir una categoria.
// La categoria elegida vive en el estado del padre (ProductoList) y llega
// por props; al hacer click en un boton se le avisa al padre con cambiar.
const CategoriaTabs = ({ categorias, seleccionada, cambiar }) => {
  return (
    <div className="kiosco__tabs">
      <button
        type="button"
        className={seleccionada === 'Todo' ? 'tab tab--activa' : 'tab'}
        onClick={() => cambiar('Todo')}
      >
        Todo
      </button>

      {categorias.map((categoria) => (
        <button
          key={categoria}
          type="button"
          className={seleccionada === categoria ? 'tab tab--activa' : 'tab'}
          onClick={() => cambiar(categoria)}
        >
          {categoria}
        </button>
      ))}
    </div>
  );
};

export default CategoriaTabs;
