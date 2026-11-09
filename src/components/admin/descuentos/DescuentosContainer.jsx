import { useEffect, useState } from 'react';
import { apiFetch } from '../../../services/api';
import DescuentosTable from './DescuentosTable';
import DescuentosForm from './DescuentosForm';
import BotonAccion from '../ui/BotonAccion';
import AdminModal from '../ui/AdminModal';
import VentanaEmergente from '../../ui/VentanaEmergente';

const DescuentosContainer = () => {
  const [descuentos, setDescuentos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [descuentoEditando, setDescuentoEditando] = useState(null);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [descuentoAEliminar, setDescuentoAEliminar] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [errorAccion, setErrorAccion] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const cargar = async () => {
      try {
        setDescuentos(await apiFetch('/descuentos', { signal: controller.signal }));
      } catch (err) {
        if (err.name === 'AbortError') return;
        setErrorAccion(err.message);
      }
    };

    cargar();
    return () => controller.abort();
  }, []);

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
    try {
      const editando = descuentoEditando !== null;
      const guardado = await apiFetch(editando ? `/descuentos/${descuentoEditando.id}` : '/descuentos', {
        method: editando ? 'PUT' : 'POST',
        body: formData,
      });
      setDescuentos((lista) =>
        editando
          ? lista.map((d) => (d.id === guardado.id ? guardado : d))
          : [...lista, guardado]
      );
      cerrarModal();
    } catch (err) {
      setErrorGuardar(err.message);
    }
  };

  const cambiarActivo = async (descuento, metodo, ruta, mensajeError) => {
    setProcesando(true);
    try {
      const actualizado = await apiFetch(`/descuentos/${descuento.id}${ruta}`, { method: metodo });
      setDescuentos((lista) =>
        lista.map((d) => (d.id === descuento.id ? (actualizado ?? { ...d, activo: false }) : d))
      );
    } catch (err) {
      setErrorAccion(err.message || mensajeError);
    } finally {
      setProcesando(false);
      setDescuentoAEliminar(null);
    }
  };

  const confirmarEliminar = () =>
    cambiarActivo(descuentoAEliminar, 'DELETE', '', 'No se pudo eliminar el código');

  const manejarReactivar = (descuento) =>
    cambiarActivo(descuento, 'PATCH', '/reactivar', 'No se pudo reactivar el código');

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
