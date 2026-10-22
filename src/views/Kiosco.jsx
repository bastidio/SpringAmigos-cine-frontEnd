import ProductoList from '../components/kiosco/ProductoList';

// Vista del kiosco (URL "/kiosco"). Solo renderiza: la logica esta en ProductoList.
const Kiosco = ({ token }) => {
  return (
    <section className="pagina">
      <ProductoList token={token} />
    </section>
  );
};

export default Kiosco;
