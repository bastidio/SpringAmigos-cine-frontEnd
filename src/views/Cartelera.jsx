import PeliculaList from '../components/cartelera/PeliculaList';

// Vista: solo renderiza. La logica y el estado estan en PeliculaList.
const Cartelera = () => {
  return (
    <section className="cartelera">
      <PeliculaList />
    </section>
  );
};

export default Cartelera;
