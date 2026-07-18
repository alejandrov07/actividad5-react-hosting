# Actividad 5 - Despliegue, imágenes public/src y selects dependientes

Proyecto React (Vite) para la Unidad #3, Semana 11. Cubre los 3 puntos pedidos:
1. Despliegue a un hosting (GitHub Pages).
2. Imagen desde `public/` y otra desde `src/`.
3. Dos `<select>` donde el segundo depende del primero.

## Estructura

```
actividad5-hosting/
├── public/
│   └── imagenes/
│       └── banner-soporte.png   <- imagen "pública" (Tema 11/18)
├── src/
│   ├── assets/
│   │   └── icono-ticket.png     <- imagen "de src" (Tema 12/19)
│   ├── App.jsx                  <- selects dependientes + ambas imágenes
│   └── App.css
├── vite.config.js               <- OJO: contiene el "base" para GitHub Pages
└── package.json
```

## 1. La diferencia real entre `public/` y `src/` (no memorices la regla, mira la evidencia)

Corrí `npm run build` y esto es lo que generó Vite en `dist/`:

```
dist/imagenes/banner-soporte.png        <- viene de public/, mismo nombre, intacto
dist/assets/icono-ticket-DZ9JwfXG.png   <- viene de src/, Vite le puso un hash
```

Eso es lo que hay que entender de fondo:

- **`public/`** se copia tal cual a la carpeta final. El navegador la pide como
  cualquier archivo estático. Por eso en el código se referencia por **string**:
  ```jsx
  <img src={`${import.meta.env.BASE_URL}imagenes/banner-soporte.png`} />
  ```
  Usé `import.meta.env.BASE_URL` en vez de escribir `/imagenes/...` directo, porque en
  GitHub Pages la app no vive en la raíz del dominio, vive en `usuario.github.io/repo/`.
  `BASE_URL` ya trae ese prefijo (viene del `base` de `vite.config.js`). Si hubiera
  escrito la ruta a mano, la imagen se habría visto bien en `localhost` pero rota en producción.

- **`src/`** se **importa como módulo de JS**:
  ```jsx
  import iconoTicket from './assets/icono-ticket.png';
  ```
  Vite la trata como una dependencia más del código: la procesa, le agrega un hash al
  nombre (para que el navegador pueda cachearla agresivamente sin riesgo de servir una
  versión vieja) y la mete al bundle. Por eso en `vite.config.js` desactivé
  `assetsInlineLimit` — por defecto Vite convierte los archivos menores a 4kb en un
  string base64 dentro del propio JS, y quería que en tu caso se viera como archivo
  aparte para que la diferencia sea evidente.

**Regla práctica para decidir dónde poner una imagen futura:** si el navegador la va a
pedir por una URL fija (favicon, imagen de un `<meta>`, un archivo que otra herramienta
externa necesita referenciar), va en `public/`. Si es parte del diseño de un componente
y quieres que el bundler la optimice/cachee, va en `src/` y se importa.

## 2. Selects dependientes (Tema 13/20)

En `App.jsx`, el segundo select no tiene su propia lista fija: la deriva del objeto
`incidentesPorDepartamento` usando el valor del primer select como clave.

```js
const opcionesIncidente = incidentesPorDepartamento[departamento] || [];
```

Dos detalles que son fáciles de pasar por alto y que sí importan:

- Al cambiar el primer select, **hay que resetear el segundo** (`setTipoIncidente('')`).
  Si no lo haces, puede quedar seleccionado un valor que no existe en la nueva lista
  (por ejemplo, "Pantalla dañada" seleccionado mientras el select muestra opciones de Redes).
- El segundo select está `disabled` mientras no haya departamento elegido, para que no
  se pueda elegir un tipo de incidente "huérfano" antes de tiempo.

## 3. Desplegar a GitHub Pages — pasos que tienes que correr tú

Yo no tengo acceso a tu cuenta de GitHub, así que estos pasos los ejecutas tú. Te dejo
exactamente qué hacer y qué revisar en cada uno.

**Paso 0 — Antes que nada, decide el nombre del repo.**
Ese nombre tiene que coincidir EXACTAMENTE con el `base` en `vite.config.js`. Ahora mismo
dice:
```js
base: '/actividad5-react-hosting/',
```
Si tu repo se va a llamar distinto, cambia esa línea ANTES de desplegar. Este es el error
#1 en despliegues de Vite a GitHub Pages: si no coincide, la página carga en blanco
porque el navegador busca el JS/CSS en una ruta que no existe.

**Paso 1 — Crear el repo en GitHub** (vacío, sin README, para no tener conflictos de merge).

**Paso 2 — Conectar tu proyecto local al repo:**
```bash
git init
git add .
git commit -m "Actividad 5: selects dependientes, imagenes public/src"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/NOMBRE-DEL-REPO.git
git push -u origin main
```

**Paso 3 — Instalar dependencias y desplegar:**
```bash
npm install
npm run deploy
```
Esto corre `predeploy` (que hace `npm run build`) y luego sube la carpeta `dist/` a una
rama especial llamada `gh-pages` (el paquete `gh-pages` la crea solo).

**Paso 4 — Activar GitHub Pages:**
En el repo en GitHub: `Settings` → `Pages` → en "Branch" selecciona `gh-pages` y guarda.
GitHub te da la URL pública (tarda 1-2 minutos en propagarse la primera vez).

## Cosas que debes verificar tú mismo (no las des por buenas solo porque el build pasó)

- Que la URL pública realmente cargue el banner y el icono, no solo el texto. Si alguno
  no aparece, revisa la consola del navegador (F12) — casi siempre es el `base` mal
  configurado o una ruta con mayúscula/minúscula distinta al nombre real del archivo.
- Que al elegir un departamento y luego cambiarlo, el segundo select se vacíe (no se
  quede pegado con la opción anterior).
- Que el link que subas a Blackboard sea el de **GitHub Pages** (la URL pública), no el
  del repositorio de GitHub — son cosas distintas y es un error común.
