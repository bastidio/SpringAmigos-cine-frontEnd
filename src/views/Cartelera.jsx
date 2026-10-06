import PeliculaList from '../components/cartelera/PeliculaList';

// Vista de inicio (URL "/"). Solo renderiza: la logica esta en PeliculaList.
const Cartelera = () => {
  return (
    <section className="pagina">
      <PeliculaList />
    </section>
  );
};

export default Cartelera;
