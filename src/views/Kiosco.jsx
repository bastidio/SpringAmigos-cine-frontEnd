import ProductoList from '../components/kiosco/ProductoList';

// Vista del kiosco (URL "/kiosco"). Solo renderiza: la logica esta en ProductoList.
const Kiosco = () => {
  return (
    <section className="pagina">
      <ProductoList />
    </section>
  );
};

export default Kiosco;
