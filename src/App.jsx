import { useState } from 'react';
import Auth from './components/auth/Auth';

function App() {
  const [token, setToken] = useState(null);

  if (!token) {
    return <Auth onAutenticado={setToken} />;
  }

  // TODO: reemplazar por <Kiosco rol="USUARIO" /> cuando exista
  // src/components/kiosco/Kiosco.jsx (y decodificar el rol real del token).
  return (
    <main style={{ padding: 32 }}>
      <p>Sesión iniciada.</p>
      <button type="button" onClick={() => setToken(null)}>
        Cerrar sesión
      </button>
    </main>
  );
}

export default App;
