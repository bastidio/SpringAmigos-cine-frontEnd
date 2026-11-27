import IconoButaca from './IconoButaca';
import salaVip from '../../assets/sala-vip.jpg';
import './BannerVip.css';

// Íconos de línea simples; toman el color del contenedor (currentColor).
const propsIcono = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
};

// Almohada (lados curvos y esquinas en punta, con costura) y una manta doblada debajo.
const IconoAlmohada = () => (
  <svg {...propsIcono}>
    <path d="M3 3Q12 5 21 3Q19.5 7.5 21 12Q12 10 3 12Q4.5 7.5 3 3Z" />
    <path
      d="M6.5 5.8Q12 7 17.5 5.8Q16.7 7.5 17.5 9.4Q12 8.4 6.5 9.4Q7.3 7.5 6.5 5.8Z"
      strokeWidth="1"
      strokeDasharray="1.5 1.5"
    />
    <rect x="3" y="15" width="18" height="6" rx="1.5" />
    <path d="M3 18h18" />
  </svg>
);

const IconoIngreso = () => (
  <svg {...propsIcono}>
    <path d="M14 3h5a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-5" />
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H3" />
  </svg>
);

const IconoPersonas = () => (
  <svg {...propsIcono}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M16 14.2c2.9.4 5 2.9 5 5.8" />
  </svg>
);

const ITEMS = [
  {
    titulo: 'Butacas de lujo',
    texto: 'Reclinables, amplias y separadas por pasillos.',
    // nivel "media" es el dorado del ícono de butacas.
    icono: <IconoButaca nivel="media" tamano={18} decorativo />,
  },
  { titulo: 'Almohadas y mantas', texto: 'A tu disposición en cada butaca.', icono: <IconoAlmohada /> },
  {
    titulo: 'Ingreso privado',
    texto: 'Acceso directo desde el estacionamiento a la sala, sin pasar por el hall.',
    icono: <IconoIngreso />,
  },
  { titulo: 'Salas reducidas', texto: 'Pocas personas por función, máxima tranquilidad.', icono: <IconoPersonas /> },
];

const BannerVip = () => (
  <section className="banner-vip" aria-labelledby="banner-vip-titulo">
    <div className="banner-vip_texto">
      <p className="banner-vip_etiqueta">EXPERIENCIA LUMIÈRE VIP</p>
      <h2 id="banner-vip-titulo" className="banner-vip_titulo">
        La intimidad de una sala privada.
      </h2>
      <p className="banner-vip_bajada">
        Pocas butacas, más espacio y un ingreso exclusivo, para que disfrutes la película sin cruzarte con nadie.
      </p>

      <ul className="banner-vip_items">
        {ITEMS.map((item) => (
          <li key={item.titulo} className="banner-vip_item">
            <span className="banner-vip_icono">{item.icono}</span>
            <div>
              <h3 className="banner-vip_item-titulo">{item.titulo}</h3>
              <p className="banner-vip_item-texto">{item.texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>

    <div className="banner-vip_imagen">
      <img src={salaVip} alt="Sala VIP con butacas reclinables de terciopelo bordó y mesas laterales" loading="lazy" />
      <div className="banner-vip_recuadro">
        <p className="banner-vip_recuadro-titulo">Discreción total</p>
        <p className="banner-vip_recuadro-texto">
          Para quienes prefieren disfrutar del cine más tranquilos
        </p>
      </div>
    </div>
  </section>
);

export default BannerVip;
