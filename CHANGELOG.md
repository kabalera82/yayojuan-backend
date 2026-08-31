# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

## [Unreleased]

### Added

- Scaffold inicial del backend: Node.js + Express, Mongoose, bcryptjs, jsonwebtoken,
  cloudinary, multer y cors instalados, con ESLint y Prettier configurados (sin código
  de aplicación todavía).
- Conexión a MongoDB (`src/config/db.js`) y configuración de Cloudinary.
- Autenticación con JWT, registro, login, perfil (`/api/users`) y gestión de
  direcciones del usuario autenticado (`/api/addresses`).
- Middlewares `auth` (verifica el token) e `isAdmin` (restringe a administradores).
- Gestión de categorías (`/api/categories`) como colección propia, referenciada por
  los productos.
- Catálogo de productos (`/api/products`), con lectura pública y gestión solo para
  administradores.
- Pedidos (`/api/orders`): creación desde el carrito del usuario con snapshot de
  precio/nombre y de la dirección de envío, listado propio y de administrador
  ordenable por fecha o estado (`?sort=date_asc|date_desc|status_asc|status_desc`),
  y cambio de estado por un administrador.
- Script `npm run seed` para insertar datos de prueba de usuarios, categorías y
  productos.
- Campo `season` (temporada) en productos, con inicio y fin de mes.
- Mensajes de contacto (`/api/contact`): cualquiera puede enviar uno (se guarda en
  Mongo), y avisa por Telegram si `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` están
  configurados; solo un admin puede listarlos.

- `POST /api/orders/request`: crea el pedido con el carrito que envía el cliente y avisa
  por Telegram con los datos del usuario, la dirección de envío, las líneas y el total.
  Nombres, precios y stock se leen de la base de datos, nunca de lo que manda el cliente.
- `DELETE /api/contact/:id`: un admin puede borrar un mensaje de contacto.
- Gestión de usuarios para el panel de administración (`GET /api/users`,
  `POST /api/users` con rol, `DELETE /api/users/:id`). El registro público
  (`POST /api/users/register`) sigue ignorando cualquier rol enviado por el cliente.
- `DELETE /api/users/me`: el propio usuario puede eliminar su cuenta.
- Subida de imagen de producto a Cloudinary (`POST`/`PATCH /api/products`, campo
  `image` en `multipart/form-data`).
- `PATCH /api/orders/:id`: edita las líneas de un pedido ya creado y recalcula el
  total, releyendo nombres y precios de la base de datos.
- Exportar e importar en CSV el catálogo de productos
  (`GET`/`POST /api/products/export|import`) y el listado de pedidos
  (`GET`/`POST /api/orders/export|import`, la importación solo cambia el estado). La
  exportación descarga el fichero directamente en la respuesta HTTP (con BOM UTF-8
  para que Excel muestre bien los acentos); la importación recibe el CSV como
  fichero subido. Ninguno de los dos toca el disco del servidor.

### Changed

- Todas las respuestas de error se han simplificado a un único criterio: `200` para
  éxito, `400` para cualquier error, sin distinguir el motivo en el código de estado.
- El puerto y los orígenes permitidos por CORS se leen del `.env` (`PORT` y
  `ALLOWED_ORIGINS`, lista separada por comas), con `3000` y `http://localhost:5173`
  como valores por defecto.
- `isAuth` e `isAdmin` viven juntos en `src/middlewares/auth.middleware.js`, que ahora
  exporta las dos funciones. Desaparece `isAdmin.middleware.js`.
- `DELETE /api/users/me` (antes con este mismo controlador para todos los casos) pasa
  a llamarse `deleteMe`, distinto de `deleteUser` (admin, por id). Un admin no puede
  eliminar su propia cuenta por `DELETE /api/users/:id`.
- Lógica de creación y actualización de pedidos extraída a `src/services/pedidos.js`
  (`crearPedido`, `actualizarPedido`), separada del controlador.

### Removed

- `POST /api/orders` y el campo `cart` del modelo `User`: no existía ningún endpoint que
  escribiera ese carrito, así que ese pedido fallaba siempre con "El carrito está vacío".

### Fixed

- El hook `pre('save')` de `User` mezclaba estilo callback y `async`, lo que rompía
  con `TypeError: next is not a function` en Mongoose 9 — ningún registro de
  usuario funcionaba hasta este arreglo.
- `src/config/db.js` imprimía la cadena de conexión completa (con usuario y
  contraseña) en el log en cada arranque del servidor.
- `login` no traía el `password` del usuario (`select: false` en el modelo), así que
  la comprobación de contraseña fallaba siempre.
- `src/config/cloudynary.js` estaba vacío pese a estar ya montado en el proyecto.
- `ALLOWED_ORIGINS=*` no funcionaba: `cors` compara cada origen literalmente cuando
  recibe un array, así que `*` nunca coincidía con el origen real de la petición.
  Ahora, si la lista contiene `*`, se refleja cualquier origen (`origin: true`).
- El `catch` de `sendTelegramMessage` estaba vacío; ahora registra el fallo con
  `console.error` en vez de tragárselo en silencio.
