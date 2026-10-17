import { useState, useEffect } from 'react';
import FuncionesTable from '../../components/admin/funciones/FuncionesTable';
import FuncionesForm from '../../components/admin/funciones/FuncionForm';
import BotonAccion from '../../components/admin/ui/BotonAccion';
import FiltroBoton from '../../components/admin/ui/FiltroBoton';
import AdminModal from '../../components/admin/ui/AdminModal';

const AdminFuncionesView = () => {
  const [funciones, setFunciones] = useState([]);
  const [peliculas, setPeliculas] = useState([]); 
  const [salas, setSalas] = useState([]);         
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [funcionEditando, setFuncionEditando] = useState(null);
  
  const diasDisponibles = ['2026-10-20', '2026-10-21', '2026-10-22'];
  const [diaSeleccionado, setDiaSeleccionado] = useState(diasDisponibles[0]);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('token'); // 1. Recuperamos el token
      
      // Armamos un objeto con las opciones para reutilizarlo en las 3 peticiones
      const opciones = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const [resFunc, resPeli, resSalas] = await Promise.all([
        fetch('/funciones', opciones),
        fetch('/peliculas', opciones),
        fetch('/salas', opciones)
      ]);
      
    
      setPeliculas(await resPeli.json());
      setSalas(await resSalas.json());
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

  const manejarGuardar = async (formData) => {
    // 2. Reemplazamos el console.log por el fetch real con el token
    const metodo = funcionEditando ? 'PUT' : 'POST';
    const url = funcionEditando ? `/funciones/${funcionEditando.id}` : '/funciones';
    const token = localStorage.getItem('token');

    try {
      await fetch(url, {
        method: metodo,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 3. Enviamos el token para poder modificar datos
        },
        body: JSON.stringify(formData)
      });

      cerrarModal();
      cargarDatos(); 
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const funcionesFiltradas = funciones.filter(f => 
    f.horario && f.horario.startsWith(diaSeleccionado)
  );

  return (
    <div>
      <div className="admin-view-header">
        <div>
          <h1 className="admin-view-title">Gestión de Funciones</h1>
          <p className="admin-view-count">
            {funcionesFiltradas.length} funciones para el día seleccionado
          </p>
        </div>
        <BotonAccion variante="primario" onClick={() => abrirModal()}>+ Nueva Función</BotonAccion>
      </div>

      <FiltroBoton
        opciones={diasDisponibles}
        seleccionActual={diaSeleccionado}
        onSeleccionar={setDiaSeleccionado}
      />

      <FuncionesTable funciones={funcionesFiltradas} onEditar={abrirModal} />

      <AdminModal isOpen={modalAbierto} onClose={cerrarModal} titulo={funcionEditando ? 'Editar Función' : 'Nueva Función'}>
        {/* Le pasamos las peliculas y salas al form */}
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