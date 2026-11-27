import { useState } from 'react';

const propsIcono = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
};

const OjoAbierto = () => (
  <svg {...propsIcono}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const OjoTachado = () => (
  <svg {...propsIcono}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    <path d="M4 4l16 16" />
  </svg>
);

const CampoContrasena = (props) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-form_contrasena">
      <input {...props} type={visible ? 'text' : 'password'} />
      <button
        type="button"
        className="auth-form_ojo"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        title={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {visible ? <OjoTachado /> : <OjoAbierto />}
      </button>
    </div>
  );
};

export default CampoContrasena;
