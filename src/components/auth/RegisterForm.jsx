




function RegisterForm({ datos, error, enviando, onCambiar, onEnviar, onIrALogin }) {
  return (
    <form className="auth-form" onSubmit={onEnviar}>
      <h2 className="auth-form_titulo">Crear cuenta</h2>

      <label className="auth-form_campo">
        <span>Nombre de usuario</span>
        <input type="text" name="username" value={datos.username} onChange={onCambiar} required />
      </label>

      <label className="auth-form_campo">
        <span>Nombre</span>
        <input type="text" name="nombre" value={datos.nombre} onChange={onCambiar} required />
      </label>

      <label className="auth-form_campo">
        <span>Apellido</span>
        <input type="text" name="apellido" value={datos.apellido} onChange={onCambiar} required />
      </label>

      <label className="auth-form_campo">
        <span>Email</span>
        <input type="email" name="email" value={datos.email} onChange={onCambiar} required />
      </label>

      {}
      <label className="auth-form_campo">
        <span>Teléfono (opcional)</span>
        <input
          type="tel"
          name="telefono"
          value={datos.telefono}
          onChange={onCambiar}
          placeholder="11 1234-5678"
        />
      </label>

      <label className="auth-form_campo">
        <span>Contraseña</span>
        <input
          type="password"
          name="password"
          value={datos.password}
          onChange={onCambiar}
          required
        />
      </label>

      {error && <p className="auth-form_error">{error}</p>}

      <button type="submit" className="auth-form_boton" disabled={enviando}>
        {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="auth-form_link">
        ¿Ya tenés cuenta?{' '}
        <button type="button" className="auth-form_link-boton" onClick={onIrALogin}>
          Iniciá sesión
        </button>
      </p>
    </form>
  );
}

export default RegisterForm;
