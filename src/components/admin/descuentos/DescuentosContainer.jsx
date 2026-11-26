import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDescuentos, createDescuento, updateDescuento, deleteDescuento, reactivarDescuento } from '../../../redux/descuentosSlice';
import DescuentosTable from './DescuentosTable';
import DescuentosForm from './DescuentosForm';
import BotonAccion from '../ui/BotonAccion';
import AdminModal from '../ui/AdminModal';
import VentanaEmergente from '../../ui/VentanaEmergente';

const DescuentosContainer = () => {
  const dispatch = useDispatch();
  const { items: descuentos, itemsEstado, error } = useSelector((state) => state.descuentos);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [descuentoEditando, setDescuentoEditando] = useState(null);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [descuentoAEliminar, setDescuentoAEliminar] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [errorAccion, setErrorAccion] = useState(null);

  // Solo se piden si todavía no están en el store.
  useEffect(() => {
    if (itemsEstado !== 'inicial' || error !== null) return;
    const cargar = async () => {
      const res = await dispatch(fetchDescuentos());
      if (res.error) setErrorAccion('No se pudieron cargar los códigos de descuento.');
    };
    cargar();
  }, [dispatch, itemsEstado, error]);

  const abrirModal = (descuento = null) => {
    setDescuentoEditando(descuento);
    setErrorGuardar(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setDescuentoEditando(null);
    setErrorGuardar(null);
    setModalAbierto(false);
  };

  const manejarGuardar = async (formData) => {
    setErrorGuardar(null);
    const res = await dispatch(descuentoEditando !== null ? updateDescuento({ ...formData, id: descuentoEditando.id }) : createDescuento(formData));
    if (res.error) {
      setErrorGuardar(res.payload);
      return;
    }
    cerrarModal();
  };

  const cambiarActivo = async (accion) => {
    setProcesando(true);
    const res = await dispatch(accion);
    setProcesando(false);
    setDescuentoAEliminar(null);
    if (res.error) setErrorAccion(res.payload);
  };

  const confirmarEliminar = () => cambiarActivo(deleteDescuento(descuentoAEliminar.id));

  const manejarReactivar = (descuento) => cambiarActivo(reactivarDescuento(descuento.id));

  return (
    <div>
      <div className="admin-view-header">
        <div>
          <h1 className="admin-view-title">Gestión de Descuentos</h1>
          <p className="kiosco-subtitulo">{descuentos.length} códigos actuales</p>
        </div>
        <BotonAccion variante="primario" onClick={() => abrirModal()}>+ Nuevo Código</BotonAccion>
      </div>

      <DescuentosTable
        descuentos={descuentos}
        onEditar={abrirModal}
        onEliminar={setDescuentoAEliminar}
        onReactivar={manejarReactivar}
      />

      <AdminModal isOpen={modalAbierto} onClose={cerrarModal} titulo={descuentoEditando ? 'Editar Código' : 'Nuevo Código'}>
        {errorGuardar && (
          <p role="alert" className="pagina_mensaje pagina_mensaje--error">{errorGuardar}</p>
        )}
        <DescuentosForm
          descuentoAEditar={descuentoEditando}
          onGuardar={manejarGuardar}
          onCancelar={cerrarModal}
        />
      </AdminModal>

      <VentanaEmergente
        abierta={descuentoAEliminar !== null}
        variante="peligro"
        titulo="Eliminar código"
        mensaje={`¿Eliminar ${descuentoAEliminar?.codigo ?? ''}? Va a dejar de poder usarse en el checkout (podés reactivarlo después).`}
        textoConfirmar="Eliminar"
        ocupado={procesando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setDescuentoAEliminar(null)}
      />

      <VentanaEmergente
        abierta={errorAccion !== null}
        titulo="No se pudo completar"
        mensaje={errorAccion}
        onConfirmar={() => setErrorAccion(null)}
      />
    </div>
  );
};

export default DescuentosContainer;
