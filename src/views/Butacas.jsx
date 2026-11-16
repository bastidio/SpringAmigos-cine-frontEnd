import { useParams } from 'react-router-dom';
import SeleccionButacas from '../components/butacas/SeleccionButacas';

const Butacas = () => {
  const { id } = useParams();

  return (
    <section className="pagina">
      <SeleccionButacas key={id} />
    </section>
  );
};

export default Butacas;
