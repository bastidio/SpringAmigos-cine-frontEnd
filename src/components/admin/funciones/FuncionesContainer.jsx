import { useEffect, useState } from 'react';
import FuncionesTable from './FuncionesTable';
import FuncionesForm from './FuncionForm';
import BotonAccion from '../ui/BotonAccion';
import AdminModal from '../ui/AdminModal';
import VentanaEmergente from '../../ui/VentanaEmergente';

const FuncionesContainer = () => {
  const [funciones, setFunciones] = useState([]);
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [funcionEditando, setFuncionEditando] = useState(null);
  const [funcionAEliminar, setFuncionAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorOperacion, setErrorOperacion] = useState(null);

  const fechaHoy = new Date();
  const fechaManana = new Date();
  fechaManana.setDate(fechaHoy.getDate() + 1);

  const formatearValue = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().split('T')[0];
  };

  const formatearLabel = (date) => {
    const texto = date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  const hoyValue = formatearValue(fechaHoy);
  const mananaValue = formatearValue(fechaManana);
  const [diaSeleccionado, setDiaSeleccionado] = useState('todas');

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('token');
      const opciones = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const [resFunc, resPeli, resSalas] = await Promise.all([
        fetch('http://localhost:4002/funciones', opciones),
        fetch('http://localhost:4002/peliculas', opciones),
        fetch('http://localhost:4002/salas', opciones)
      ]);

      return {
        funciones: resFunc.ok ? await resFunc.json() : undefined,
        peliculas: resPeli.ok ? await resPeli.json() : undefined,
        salas: resSalas.ok ? await resSalas.json() : undefined
      };
    } catch (error) {
      console.error('Error cargando la base de datos:', error);
      return null;
    }
  };

  const aplicarDatos = (datos) => {
    if (!datos) return;
    if (datos.funciones !== undefined) setFunciones(datos.funciones);
    if (datos.peliculas !== undefined) setPeliculas(datos.peliculas);
    if (datos.salas !== undefined) setSalas(datos.salas);
  };

  const actualizarDatos = async () => {
    aplicarDatos(await cargarDatos());
  };

  useEffect(() => {
    cargarDatos().then(aplicarDatos);
  }, []);

  const abrirModal = (funcion = null) => {
    setFuncionEditando(funcion);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setFuncionEditando(null);
    setModalAbierto(false);
  };

  const manejarGuardar = async (formData) => {
    const metodo = funcionEditando ? 'PUT' : 'POST';
    const url = funcionEditando
      ? `http://localhost:4002/funciones/${funcionEditando.id}`
      : 'http://localhost:4002/funciones';

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error(`Error al guardar: ${response.status}`);

      cerrarModal();
      actualizarDatos();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const funcionesFiltradas = diaSeleccionado === 'todas'
    ? funciones
    : funciones.filter(f => f.horario && f.horario.startsWith(diaSeleccionado));

  const manejarEliminar = (id) => {
    setErrorOperacion(null);
    setFuncionAEliminar(id);
  };

  const confirmarEliminar = async () => {
    if (!funcionAEliminar) return;
    setEliminando(true);
    setErrorOperacion(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4002/funciones/${funcionAEliminar}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const mensajeBackend = await response.text();
        throw new Error(mensajeBackend || `Error al eliminar (Código ${response.status})`);
      }

      actualizarDatos();
      setFuncionAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
      setErrorOperacion(error.message);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div>
      <div className="admin-view-header">
        <div>
          <h1 className="admin-view-title">Gestión de Funciones</h1>
          <p className="admin-view-count">
            {funcionesFiltradas.length} funciones para {diaSeleccionado === 'todas' ? 'todos los días' : 'el día seleccionado'}
          </p>
        </div>
        <BotonAccion variante="primario" onClick={() => abrirModal()}>+ Nueva Función</BotonAccion>
      </div>

      <div className="filtros-fecha-container">
        <button
          className={`btn-filtro-dia ${diaSeleccionado === 'todas' ? 'activo' : ''}`}
          onClick={() => setDiaSeleccionado('todas')}
        >
          Todas
        </button>

        <button
          className={`btn-filtro-dia ${diaSeleccionado === hoyValue ? 'activo' : ''}`}
          onClick={() => setDiaSeleccionado(hoyValue)}
        >
          Hoy — {formatearLabel(fechaHoy)}
        </button>

        <button
          className={`btn-filtro-dia ${diaSeleccionado === mananaValue ? 'activo' : ''}`}
          onClick={() => setDiaSeleccionado(mananaValue)}
        >
          Mañana — {formatearLabel(fechaManana)}
        </button>

        <input
          type="date"
          value={diaSeleccionado !== 'todas' ? diaSeleccionado : ''}
          onChange={(e) => setDiaSeleccionado(e.target.value || 'todas')}
          className="btn-filtro-dia input-fecha"
        />
      </div>

      <FuncionesTable funciones={funcionesFiltradas} onEditar={abrirModal} onEliminar={manejarEliminar} />

      <VentanaEmergente
        abierta={funcionAEliminar !== null}
        titulo={errorOperacion ? 'Acción denegada' : 'Eliminar Función'}
        mensaje={errorOperacion ? errorOperacion : `¿Estás seguro de que querés borrar la función #${funcionAEliminar}? Esta acción no se puede deshacer.`}
        variante={errorOperacion ? 'aviso' : 'peligro'}
        textoConfirmar={errorOperacion ? 'Entendido' : 'Sí, borrar'}
        ocupado={eliminando}
        onConfirmar={errorOperacion ? () => { setFuncionAEliminar(null); setErrorOperacion(null); } : confirmarEliminar}
        onCancelar={errorOperacion ? undefined : () => { setFuncionAEliminar(null); setErrorOperacion(null); }}
      />

      <AdminModal isOpen={modalAbierto} onClose={cerrarModal} titulo={funcionEditando ? 'Editar Función' : 'Nueva Función'}>
        <FuncionesForm
          funcionAEditar={funcionEditando}
          peliculas={peliculas}
          salas={salas}
          onGuardar={manejarGuardar}
          onCancelar={cerrarModal}
        />
      </AdminModal>
    </div>
  );
};

export default FuncionesContainer;
