import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MapaButacas from './MapaButacas';
import PanelSeleccion from './PanelSeleccion';
import { useDispatch, useSelector } from 'react-redux';
import { agregarButacas } from '../../redux/carritoSlice';
import './Butacas.css';

const pedir = (url) => {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error('Error ' + response.status);
    }
    return response.json();
  });
};

const SeleccionButacas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.usuario);
  const { loading: agregando } = useSelector((state) => state.carrito);
  const dispatch = useDispatch();

  const [funcion, setFuncion] = useState(null);
  const [butacas, setButacas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [error, setError] = useState(null);
  const [errorCarrito, setErrorCarrito] = useState(null);

  useEffect(() => {
    Promise.all([pedir(`/funciones/${id}`), pedir('/asientos'), pedir(`/entradas/funcion/${id}`)])
      .then(([funcionData, asientos, ocupacion]) => {
        const butacasDeLaSala = asientos
          .filter((asiento) => asiento.sala.id === funcionData.sala.id)
          .sort((a, b) => a.fila - b.fila || a.numero - b.numero)
          .map((asiento) => {
            
            const fila = String.fromCharCode(64 + asiento.fila);
            return {
              id: asiento.id,
              fila,
              nombre: fila + asiento.numero,
              estado: ocupacion.asientosOcupados.includes(asiento.id) ? 'OCUPADA' : 'LIBRE',
            };
          });

        setFuncion(funcionData);
        setButacas(butacasDeLaSala);
        setSeleccionadas([]);
        setError(null);
      })
      .catch((error) => {
        console.error('Error al mostrar las butacas', error);
        setError('No se pudieron cargar las butacas. Puede que la función no exista o que el backend esté caído.');
      });
  }, [id]);

  if (error !== null) {
    return <p className="pagina_mensaje pagina_mensaje--error">{error}</p>;
  }

  if (funcion === null) {
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

  
  
  // La logica (no mezclar funciones, no repetir butacas) esta en el thunk agregarButacas.
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
      setErrorCarrito(res.error.message);
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
          <MapaButacas butacas={butacas} seleccionadas={seleccionadas} alternar={alternarButaca} />
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
