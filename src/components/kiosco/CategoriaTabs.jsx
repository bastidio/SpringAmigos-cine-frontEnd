


const CategoriaTabs = ({ categorias, seleccionada, cambiar }) => {
  return (
    <div className="kiosco_tabs">
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
