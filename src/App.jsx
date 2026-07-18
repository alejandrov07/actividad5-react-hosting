import { useState } from 'react';
import './App.css';

// Imagen dentro de src/ -> se importa como módulo.
// Vite la procesa (le agrega hash al nombre y la copia a dist/assets en el build).
import iconoTicket from './assets/icono-ticket.png';

// ==========================
// Datos: selects dependientes
// ==========================
// El segundo select ("tipo de incidente") depende del departamento elegido.
// La clave del objeto = opción del primer select.
// El valor = arreglo de opciones que debe mostrar el segundo select.
const incidentesPorDepartamento = {
  Redes: ['Sin conexión a internet', 'Wifi inestable', 'La VPN no conecta'],
  Software: ['Una aplicación no abre', 'Error de licencia', 'Actualización pendiente'],
  Hardware: ['El equipo no enciende', 'Pantalla dañada', 'Teclado no responde'],
  'Cuentas y accesos': ['Olvidé mi contraseña', 'Cuenta bloqueada', 'Necesito acceso a un sistema'],
};

const departamentos = Object.keys(incidentesPorDepartamento);

function App() {
  const [departamento, setDepartamento] = useState('');
  const [tipoIncidente, setTipoIncidente] = useState('');

  const handleDepartamentoChange = (e) => {
    setDepartamento(e.target.value);
    // Al cambiar el departamento, la opción anterior del segundo select
    // ya no tiene sentido (puede no existir en la nueva lista), así que se reinicia.
    setTipoIncidente('');
  };

  const opcionesIncidente = incidentesPorDepartamento[departamento] || [];

  return (
    <div className="app">
      {/*
        Imagen desde la carpeta public/:
        - No se importa, se referencia por ruta.
        - Usamos import.meta.env.BASE_URL en vez de escribir "/imagenes/..." a mano,
          porque en GitHub Pages la app no vive en la raíz del dominio sino en
          "usuario.github.io/nombre-del-repo/". BASE_URL ya incluye ese prefijo
          (viene del "base" configurado en vite.config.js).
      */}
      <img
        className="banner-publica"
        src={`${import.meta.env.BASE_URL}imagenes/banner-soporte.png`}
        alt="Banner del sistema de tickets"
      />

      <div className="cabecera">
        {/* Imagen desde src/: sí se importa, Vite la trata como un módulo más */}
        <img className="icono-src" src={iconoTicket} alt="Icono de ticket" />
        <h1>Reportar incidente</h1>
      </div>

      <div className="campo">
        <label htmlFor="departamento">Departamento</label>
        <select id="departamento" value={departamento} onChange={handleDepartamentoChange}>
          <option value="">-- Selecciona un departamento --</option>
          {departamentos.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label htmlFor="tipoIncidente">Tipo de incidente</label>
        <select
          id="tipoIncidente"
          value={tipoIncidente}
          onChange={(e) => setTipoIncidente(e.target.value)}
          disabled={!departamento}
        >
          <option value="">
            {departamento ? '-- Selecciona un tipo --' : 'Primero elige un departamento'}
          </option>
          {opcionesIncidente.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>

      <div className="resumen">
        <p>
          <strong>Departamento:</strong> {departamento || '(sin seleccionar)'}
        </p>
        <p>
          <strong>Tipo de incidente:</strong> {tipoIncidente || '(sin seleccionar)'}
        </p>
      </div>
    </div>
  );
}

export default App;
