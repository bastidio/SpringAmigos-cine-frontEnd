import ProductoList from '../components/kiosco/ProductoList';


const Kiosco = ({ token }) => {
  return (
    <section className="pagina">
      <ProductoList token={token} />
    </section>
  );
};

export default Kiosco;
