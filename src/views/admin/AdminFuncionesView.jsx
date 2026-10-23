import { useState, useEffect } from 'react';
import FuncionesTable from '../../components/admin/funciones/FuncionesTable';
import FuncionesForm from '../../components/admin/funciones/FuncionForm';
import BotonAccion from '../../components/admin/ui/BotonAccion';
import AdminModal from '../../components/admin/ui/AdminModal';

const AdminFuncionesView = () => {
  const [funciones, setFunciones] = useState([]);
  const [peliculas, setPeliculas] = useState([]); 
  const [salas, setSalas] = useState([]);         
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [funcionEditando, setFuncionEditando] = useState(null);
  
  // Lógica de fechas
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

  // El estado inicial arranca en 'todas'
  const [diaSeleccionado, setDiaSeleccionado] = useState('todas');

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('token');
      const opciones = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      const [resFunc, resPeli, resSalas] = await Promise.all([
        fetch('http://localhost:4002/funciones', opciones),
        fetch('http://localhost:4002/peliculas', opciones),
        fetch('http://localhost:4002/salas', opciones)
      ]);
      
      if (resFunc.ok) setFunciones(await resFunc.json());
      if (resPeli.ok) setPeliculas(await resPeli.json());
      if (resSalas.ok) setSalas(await resSalas.json());
      
    } catch (error) {
      console.error('Error cargando la base de datos:', error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const abrirModal = (funcion = null) => {
    setFuncionEditando(funcion);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setFuncionEditando(null);
    setModalAbierto(false);
  };

  // El formData ya viene con el horario unido correctamente desde FuncionesForm
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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error(`Error al guardar: ${response.status}`);

      cerrarModal();
      cargarDatos(); 
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const funcionesFiltradas = diaSeleccionado === 'todas' 
    ? funciones 
    : funciones.filter(f => f.horario && f.horario.startsWith(diaSeleccionado));

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
          onChange={(e) => setDiaSeleccionado(e.target.value)}
          className="btn-filtro-dia input-fecha"
        />
      </div>

      <FuncionesTable funciones={funcionesFiltradas} onEditar={abrirModal} />

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

export default AdminFuncionesView;