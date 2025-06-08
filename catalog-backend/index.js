// Configuración principal de Express y carga de middlewares
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

// Aumentar el límite de tamaño para JSON y formularios (por ejemplo, 10mb)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS debe ir antes de cualquier middleware personalizado y de express.json
app.use(cors({
  origin: 'http://localhost:4200', // Cambia esto si tu frontend está en otro puerto
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(helmet());

// Importación de rutas y middlewares
const authRoutes = require('./src/routes/auth');
const firewall = require('./src/middlewares/firewall');
const articulosRoutes = require('./src/routes/articulos');
const caracteristicasRoutes = require('./src/routes/caracteristicas');
const articuloCaracteristicaRoutes = require('./src/routes/articuloCaracteristica');
const carritoRoutes = require('./src/routes/carrito');
const pedidosRoutes = require('./src/routes/pedidos');
const imagenesArticuloRoutes = require('./src/routes/imagenesArticulo');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

// Importar la conexión para probarla al iniciar
require('./src/config/db');

// Rutas
app.get('/', (req, res) => {
  res.json({ message: 'API Catálogo Virtual funcionando' });
});

// Firewall para rutas protegidas (ejemplo)
app.use('/api', firewall);

// Rutas de autenticación
app.use('/api/auth', authRoutes);
app.use('/api/articulos', articulosRoutes);
app.use('/api/caracteristicas', caracteristicasRoutes);
app.use('/api/articulo-caracteristica', articuloCaracteristicaRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/imagenes-articulo', imagenesArticuloRoutes);

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
