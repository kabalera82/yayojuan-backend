# 🌿 La huerta del Yayo Juan

**La tienda online de una huerta familiar de Navarra.**

![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)

El Yayo Juan cultiva fruta y verdura de temporada, y aquí cualquiera puede entrar, ver lo que hay esta semana, crearse una cuenta, meter cosas en el carrito y pedirlas. En cuanto alguien hace un pedido o escribe por el formulario de contacto, le llega un aviso directo por Telegram — sin paneles ni complicaciones.

Esta carpeta es la parte que no se ve: el motor que guarda los datos y responde cuando la web pide algo.

---

## 🚀 Ponerlo a andar

```bash
npm install
cp .env.example .env
```

Abre el `.env` recién creado y rellena al menos la dirección de tu base de datos MongoDB (`DB_URL`) y una clave secreta cualquiera para las sesiones (`JWT_SECRET`). Con eso listo:

```bash
npm run dev
```

Y el servidor arranca en `http://localhost:3000`, reiniciándose solo cada vez que guardas un cambio.

Si quieres empezar con productos ya cargados en vez de una tienda vacía:

```bash
npm run seed
```

Esto borra lo que hubiera antes y mete categorías, productos y dos usuarios de prueba — uno con permisos de administrador. Es solo para desarrollar cómodamente, cambia esas credenciales antes de usar datos reales.

## 📜 Comandos disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Arranca el servidor, con reinicio automático |
| `npm run start` | Arranque normal, sin reinicio automático |
| `npm run seed` | Rellena la base de datos con datos de prueba |
| `npm run lint` | Revisa el código en busca de errores |
| `npm run format` | Lo ordena automáticamente |

## 🧺 Qué hace por dentro

- **Catálogo** — categorías y productos, con temporada y stock.
- **Cuentas** — registro, login, perfil, contraseña, direcciones de envío.
- **Pedidos** — el precio y el stock siempre se recalculan contra la base de datos en ese momento, nunca se fía de lo que mande el navegador.
- **Contacto** — guarda el mensaje y avisa al vendedor.
- **Telegram** — un aviso automático cada vez que entra un pedido o un mensaje nuevo.

## 📚 Si necesitas saber más

Este README se queda en la superficie a propósito. La arquitectura completa, cada regla de negocio explicada con calma, todos los endpoints de la API, y qué queda pendiente por hacer, vive en [`docs/`](../docs/backend01.md), repartida en varios documentos cortos en vez de uno interminable.
