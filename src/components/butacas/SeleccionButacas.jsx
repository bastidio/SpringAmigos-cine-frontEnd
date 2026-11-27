import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MapaButacas from './MapaButacas';
import PanelSeleccion from './PanelSeleccion';
import { useDispatch, useSelector } from 'react-redux';
import { agregarButacas } from '../../redux/carritoSlice';
import { fetchButacas } from '../../redux/carteleraSlice';
import './Butacas.css';

const SeleccionButacas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.usuario);
  const { loading: agregando } = useSelector((state) => state.carrito);
  const dispatch = useDispatch();

  const { funcionSeleccionada: funcion, butacas, loading, error } = useSelector((state) => state.cartelera);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [errorCarrito, setErrorCarrito] = useState(null);

  useEffect(() => {
    dispatch(fetchButacas(id));
  }, [dispatch, id]);

  if (error !== null) {
    return (
      <p className="pagina_mensaje pagina_mensaje--error">
        No se pudieron cargar las butacas. Puede que la función ya no exista. Intentá de nuevo más tarde.
      </p>
    );
  }

  // Cargando, o en el store quedó otra función (la de una pantalla anterior).
  if (loading || funcion === null || String(funcion.id) !== id) {
    return <p className="pagina_mensaje">Cargando butacas...</p>;
  }

  const alternarButaca = (butaca) => {
    if (seleccionadas.includes(butaca.id)) {
      setSeleccionadas(seleccionadas.filter((idButaca) => idButaca !== butaca.id));
    } else {
      setSeleccionadas([...seleccionadas, butaca.id]);
    }
  };

  const elegidas = butacas.filter((butaca) => seleccionadas.includes(butaca.id));

  
  
  // La lógica (no mezclar funciones, no repetir butacas) está en el thunk agregarButacas.
  const agregarAlCarritoEIr = async (destino) => {
    if (token === '') {
      navigate('/login');
      return;
    }

    setErrorCarrito(null);
    const res = await dispatch(
      agregarButacas({ funcionId: funcion.id, asientos: elegidas.map((butaca) => butaca.id) })
    );
    if (!res.error) {
      navigate(destino);
    } else {
      setErrorCarrito(res.payload);
    }
  };

  const dia = funcion.horario.slice(8, 10) + '/' + funcion.horario.slice(5, 7);
  const hora = funcion.horario.slice(11, 16);

  return (
    <div className="butacas">
      <Link to={`/pelicula/${funcion.pelicula.id}`} className="butacas_volver">
        ← Volver al detalle
      </Link>

      <div className="butacas_encabezado">
        <div>
          <h1 className="butacas_titulo">{funcion.pelicula.titulo}</h1>
          <p className="butacas_bajada">
            {[`${dia}, ${hora} hs`, funcion.sala.nombre, funcion.formato, funcion.idioma]
              .filter(Boolean)
              .join(' — ')}
          </p>
        </div>
        <span className="etiqueta etiqueta--dorada butacas_precio">
          ${funcion.precio_base.toLocaleString('es-AR')} / butaca
        </span>
      </div>

      {errorCarrito !== null && (
        <p role="alert" className="pagina_mensaje pagina_mensaje--error">
          {errorCarrito}
        </p>
      )}

      <div className="butacas_cuerpo">
        {butacas.length === 0 ? (
          <p className="pagina_mensaje butacas_sin-butacas">
            Esta sala todavía no tiene butacas cargadas.
          </p>
        ) : (
          <MapaButacas butacas={butacas} seleccionadas={seleccionadas} alternar={alternarButaca} sala={funcion.sala} />
        )}

        <PanelSeleccion
          elegidas={elegidas}
          precio={funcion.precio_base}
          quitar={alternarButaca}
          irAlKiosco={() => agregarAlCarritoEIr('/kiosco')}
          agregando={agregando}
        />
      </div>
    </div>
  );
};

export default SeleccionButacas;
