// Componente "tonto": solo dibuja el formulario de registro. No tiene estado
// ni sabe del backend: los valores, los cambios y el envio le llegan por props
// desde Register (el padre).
// Cada input tiene un name igual a su clave en datos, asi el padre sabe que
// campo cambio con una sola funcion (onCambiar).
function RegisterForm({ datos, error, enviando, onCambiar, onEnviar, onIrALogin }) {
  return (
    <form className="auth-form" onSubmit={onEnviar}>
      <h2 className="auth-form__titulo">Crear cuenta</h2>

      <label className="auth-form__campo">
        <span>Nombre de usuario</span>
        <input type="text" name="username" value={datos.username} onChange={onCambiar} required />
      </label>

      <label className="auth-form__campo">
        <span>Nombre</span>
        <input type="text" name="nombre" value={datos.nombre} onChange={onCambiar} required />
      </label>

      <label className="auth-form__campo">
        <span>Apellido</span>
        <input type="text" name="apellido" value={datos.apellido} onChange={onCambiar} required />
      </label>

      <label className="auth-form__campo">
        <span>Email</span>
        <input type="email" name="email" value={datos.email} onChange={onCambiar} required />
      </label>

      {/* type="tel" abre el teclado numerico en el celular. Es opcional. */}
      <label className="auth-form__campo">
        <span>Teléfono (opcional)</span>
        <input
          type="tel"
          name="telefono"
          value={datos.telefono}
          onChange={onCambiar}
          placeholder="11 1234-5678"
        />
      </label>

      <label className="auth-form__campo">
        <span>Contraseña</span>
        <input
          type="password"
          name="password"
          value={datos.password}
          onChange={onCambiar}
          required
        />
      </label>

      {error && <p className="auth-form__error">{error}</p>}

      <button type="submit" className="auth-form__boton" disabled={enviando}>
        {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="auth-form__link">
        ¿Ya tenés cuenta?{' '}
        <button type="button" className="auth-form__link-boton" onClick={onIrALogin}>
          Iniciá sesión
        </button>
      </p>
    </form>
  );
}

export default RegisterForm;
