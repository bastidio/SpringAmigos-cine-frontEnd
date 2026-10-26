
const MensajeError = ({ mensaje }) => {
  return (
    <p
      className="m-0 rounded-xl border border-solid border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300"
      role="alert"
    >
      {mensaje}
    </p>
  );
};

export default MensajeError;
