import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MapaButacas from './MapaButacas';
import PanelSeleccion from './PanelSeleccion';
import './Butacas.css';

const pedir = (url) => {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error('Error ' + response.status);
    }
    return response.json();
  });
};

const letraDeFila = (fila) => {
  return fila >= 1 && fila <= 26 ? String.fromCharCode(64 + fila) : String(fila);
};

const SeleccionButacas = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [funcion, setFuncion] = useState(null);
  const [butacas, setButacas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([pedir(`/funciones/${id}`), pedir('/asientos'), pedir(`/entradas/funcion/${id}`)])
      .then(([funcionData, asientos, ocupacion]) => {
        const butacasDeLaSala = asientos
          .filter((asiento) => asiento.sala.id === funcionData.sala.id)
          .sort((a, b) => a.fila - b.fila || a.numero - b.numero)
          .map((asiento) => ({
            id: asiento.id,
            fila: letraDeFila(asiento.fila),
            numero: asiento.numero,
            nombre: letraDeFila(asiento.fila) + asiento.numero,
            estado: ocupacion.asientosOcupados.includes(asiento.id) ? 'OCUPADA' : 'LIBRE',
          }));

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
    return <p className="pagina__mensaje pagina__mensaje--error">{error}</p>;
  }

  if (funcion === null) {
    return <p className="pagina__mensaje">Cargando butacas...</p>;
  }

  const alternarButaca = (butaca) => {
    if (butaca.estado === 'OCUPADA') {
      return;
    }

    if (seleccionadas.includes(butaca.id)) {
      setSeleccionadas(seleccionadas.filter((idButaca) => idButaca !== butaca.id));
    } else {
      setSeleccionadas([...seleccionadas, butaca.id]);
    }
  };

  const elegidas = butacas.filter((butaca) => seleccionadas.includes(butaca.id));
  const total = elegidas.length * funcion.precio_base;

  const dia = funcion.horario.slice(8, 10) + '/' + funcion.horario.slice(5, 7);
  const hora = funcion.horario.slice(11, 16);
  const datos = [`${dia}, ${hora} hs`, funcion.sala.nombre, funcion.formato, funcion.idioma];

  return (
    <div className="butacas">
      <Link to={`/pelicula/${funcion.pelicula.id}`} className="butacas__volver">
        ← Volver al detalle
      </Link>

      <div className="butacas__encabezado">
        <div>
          <h1 className="butacas__titulo">{funcion.pelicula.titulo}</h1>
          <p className="butacas__bajada">{datos.filter(Boolean).join(' — ')}</p>
        </div>
        <span className="etiqueta etiqueta--dorada butacas__precio">
          ${funcion.precio_base.toLocaleString('es-AR')} / butaca
        </span>
      </div>

      <div className="butacas__cuerpo">
        {butacas.length === 0 ? (
          <p className="pagina__mensaje butacas__sin-butacas">
            Esta sala todavía no tiene butacas cargadas.
          </p>
        ) : (
          <MapaButacas butacas={butacas} seleccionadas={seleccionadas} alternar={alternarButaca} />
        )}

        <PanelSeleccion
          elegidas={elegidas}
          precio={funcion.precio_base}
          total={total}
          quitar={alternarButaca}
          irAlKiosco={() => navigate('/kiosco')}
          irAlCarrito={() => navigate('/carrito')}
        />
      </div>
    </div>
  );
};

export default SeleccionButacas;
