Gym Store Ecommerce - README Completo
Descripción del Proyecto

Gym Store Ecommerce es un prototipo de comercio electrónico desarrollado con React, Tailwind CSS, Vite, Node.js, Express y PostgreSQL, contenedorizado con Docker. Permite visualizar un catálogo de productos, agregar productos al carrito y simular órdenes de compra.

El proyecto busca demostrar buenas prácticas de desarrollo, integración de tecnologías modernas y escalabilidad mediante contenedores Docker.

-Requisitos Previos

-Antes de ejecutar el proyecto, asegúrate de tener instaladas las siguientes herramientas:

Node.js (v18 o superior)
Descargar Node.js

-Comprueba la versión:

node -v
npm -v


-PostgreSQL
-Descargar PostgreSQL

-Comprueba la versión:

psql --version


-Docker y Docker Compose
-Descargar Docker

-Comprueba la versión:

docker --version
docker-compose --version


-Git
Para clonar el repositorio si no se tiene descargado.

git --version

*Estructura del Proyecto
~/proyecto-ecommerce
├── docker-compose.yml
├── ecommerce-backend
│   ├── Dockerfile
│   ├── db/
│   │   └── index.js
│   ├── init-db/
│   │   └── init.sql
│   ├── middleware/
│   │   └── auth.js
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── prisma.config.ts
│   ├── routes/
│   │   ├── orders.js
│   │   └── products.js
│   └── src/
│       ├── controllers/
│       │   ├── orders.controller.js
│       │   └── products.controller.js
│       ├── db.js
│       └── server.js
└── ecommerce-gymstore
    ├── Dockerfile
    ├── package.json
    ├── eslint.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    ├── index.html
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   ├── index.css
    │   └── api/products.js

-Configuración del Backend
-1. Instalar Dependencias

-En la carpeta ecommerce-backend/ ejecutar:

npm install express pg dotenv prisma
npm install -D nodemon


express: Framework para el servidor web.

pg: Cliente PostgreSQL para Node.js.

dotenv: Manejo de variables de entorno.

prisma: ORM para modelar y consultar la base de datos.

nodemon: Herramienta de desarrollo para recargar servidor automáticamente.

-2. Variables de Entorno

-Crear un archivo .env en ecommerce-backend/:

PORT=5000
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=gymstore
PGPORT=5432


Nota: Si se usa Docker, PGHOST=db según el servicio de docker-compose.

-3. Inicializar Base de Datos

-Ejecutar PostgreSQL y crear la base gymstore.

-Ejecutar el script SQL:

psql -U postgres -d gymstore -f init-db/init.sql


-Esto creará tablas:

-products

-orders

-order_items

-y agregará productos de ejemplo.

-4. Configuración de Prisma

prisma/schema.prisma define los modelos Product y User.

-Ejecutar migraciones (opcional, Prisma no se usa completamente):

npx prisma migrate dev --name init

-5. Ejecutar Backend
npm run dev


Con nodemon recargará cambios automáticamente.

-Endpoints disponibles:

GET /api/products → Lista de productos

GET /api/products/:id → Detalle de producto

POST /api/products → Crear producto

GET /api/orders/:id → Obtener orden

POST /api/orders → Crear orden

-Configuración del Frontend
-1. Instalar Dependencias

-En la carpeta ecommerce-gymstore/ ejecutar:

npm install react react-dom axios
npm install -D vite tailwindcss postcss autoprefixer eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh


react, react-dom: Librerías de frontend.

axios: Para hacer peticiones HTTP al backend.

vite: Herramienta de desarrollo rápida.

tailwindcss, postcss, autoprefixer: Para estilos modernos.

eslint y plugins: Control de calidad de código.

-2. Configurar Tailwind

-tailwind.config.js ya apunta a:

content: ["./index.html", "./src/**/*.{js,jsx}"]


-CSS principal incluye:

@tailwind base;
@tailwind components;
@tailwind utilities;

-3. Ejecutar Frontend
npm run dev


-Por defecto corre en http://localhost:5173.

-Se conecta automáticamente al backend (http://localhost:5000/api).

-Dockerización (opcional, recomendado)
-1. Construir y levantar contenedores
docker-compose up --build


-Esto levanta:

app: Frontend con Vite.

db (si se define en docker-compose): PostgreSQL.

-2. Comandos útiles

-Ver contenedores corriendo:

docker ps


-Acceder a un contenedor:

docker exec -it <container_id> sh


-Detener contenedores:

docker-compose down

-Flujo de Uso de la Aplicación

Abrir http://localhost:5173 en el navegador.

El frontend hace GET a /api/products para cargar productos.

El usuario agrega productos al carrito y genera órdenes.

Frontend hace POST a /api/orders con los datos del pedido.

Backend inserta orden y detalles en PostgreSQL.

Las órdenes pueden ser consultadas con GET /api/orders/:id.

Solución de Problemas Comunes

Vite no carga estilos Tailwind

Verificar tailwind.config.js y que CSS contenga @tailwind directives.

Ejecutar npm run dev desde la raíz del frontend.

Backend no conecta con PostgreSQL

Revisar .env y credenciales.

Si se usa Docker, asegurarse de que el servicio db esté corriendo.

Errores de CORS

Revisar que cors() esté configurado en server.js.

Endpoints retornan 404

Revisar rutas en routes/products.js y routes/orders.js.

-Verificar que la base de datos tenga datos (init.sql ejecutado correctamente).

-Dependencias Principales
Área	Dependencia	Uso
Backend	express	Servidor y API REST
	pg	Conexión a PostgreSQL
	dotenv	Variables de entorno
	prisma	ORM (parcial)
Frontend	react/react-dom	UI y componentes
	vite	Bundling y hot reload
	tailwindcss	Estilos utilitarios y responsivos
	axios	Peticiones HTTP al backend
	eslint/plugins	Buenas prácticas de código
	
-Ejecución Final

-Backend:

cd ecommerce-backend
npm install
npm run dev


-Frontend:

cd ecommerce-gymstore
npm install
npm run dev


-Abrir navegador en http://localhost:5173

-Alternativa Docker:

docker-compose up --build
