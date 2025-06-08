const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const articulosController = require('../controllers/articulosController');

/**
 * @swagger
 * tags:
 *   name: Articulos
 *   description: Gestión de artículos
 */

/**
 * @swagger
 * /api/articulos:
 *   get:
 *     summary: Obtener todos los artículos
 *     tags: [Articulos]
 *     responses:
 *       200:
 *         description: Lista de artículos
 */
router.get('/', articulosController.getAll);

/**
 * @swagger
 * /api/articulos/metadata:
 *   get:
 *     summary: Obtener categorías distintas y precios mínimo/máximo
 *     tags: [Articulos]
 *     responses:
 *       200:
 *         description: Categorías y precios
 */
router.get('/metadata', articulosController.getCategoriasYPrecios);

/**
 * @swagger
 * /api/articulos/top:
 *   get:
 *     summary: Obtener el top N de productos más vendidos
 *     tags: [Articulos]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número de productos a devolver (por defecto 3)
 *     responses:
 *       200:
 *         description: Lista de productos más vendidos
 */
router.get('/top', articulosController.getTopVendidos);

/**
 * @swagger
 * /api/articulos/advanced:
 *   get:
 *     summary: Búsqueda avanzada de artículos
 *     tags: [Articulos]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         required: false
 *         description: Nombre del artículo
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         required: false
 *         description: Categoría del artículo
 *       - in: query
 *         name: precio_min
 *         schema:
 *           type: number
 *         required: false
 *         description: Precio mínimo
 *       - in: query
 *         name: precio_max
 *         schema:
 *           type: number
 *         required: false
 *         description: Precio máximo
 *       - in: query
 *         name: stock_min
 *         schema:
 *           type: integer
 *         required: false
 *         description: Stock mínimo
 *       - in: query
 *         name: stock_max
 *         schema:
 *           type: integer
 *         required: false
 *         description: Stock máximo
 *     responses:
 *       200:
 *         description: Lista de artículos que coinciden con los criterios de búsqueda
 */
router.get('/advanced', articulosController.advancedSearch);

/**
 * @swagger
 * /api/articulos/{id}:
 *   get:
 *     summary: Obtener un artículo por ID
 *     tags: [Articulos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del artículo
 *     responses:
 *       200:
 *         description: Artículo encontrado
 *       404:
 *         description: Artículo no encontrado
 */
router.get('/:id',
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  articulosController.getById
);

/**
 * @swagger
 * /api/articulos:
 *   post:
 *     summary: Crear un nuevo artículo
 *     tags: [Articulos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *               imagen:
 *                 type: string
 *               categoria:
 *                 type: string
 *     responses:
 *       201:
 *         description: Artículo creado
 */
router.post('/',
  body('nombre').isString().notEmpty().withMessage('Nombre requerido'),
  body('precio').isFloat({ gt: 0 }).withMessage('Precio debe ser un número positivo'),
  body('stock').isInt({ min: 0 }).withMessage('Stock debe ser un entero positivo'),
  articulosController.create
);

/**
 * @swagger
 * /api/articulos/full:
 *   post:
 *     summary: Crear un artículo con características e imágenes en una sola transacción
 *     tags: [Articulos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articulo:
 *                 type: object
 *                 properties:
 *                   nombre: { type: string }
 *                   descripcion: { type: string }
 *                   precio: { type: number }
 *                   stock: { type: integer }
 *                   categoria: { type: string }
 *               caracteristicas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_caracteristica: { type: integer }
 *                     valor: { type: string }
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     imagen_base64: { type: string }
 *                     descripcion: { type: string }
 *                     orden: { type: integer }
 *     responses:
 *       201:
 *         description: Artículo, características e imágenes creados
 */
router.post('/full', articulosController.createFull);

/**
 * @swagger
 * /api/articulos/{id}:
 *   put:
 *     summary: Actualizar un artículo
 *     tags: [Articulos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del artículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *               imagen:
 *                 type: string
 *               categoria:
 *                 type: string
 *     responses:
 *       200:
 *         description: Artículo actualizado
 *       404:
 *         description: Artículo no encontrado
 */
router.put('/:id',
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  body('nombre').optional().isString(),
  body('precio').optional().isFloat({ gt: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  articulosController.update
);

/**
 * @swagger
 * /api/articulos/{id}:
 *   delete:
 *     summary: Eliminar un artículo
 *     tags: [Articulos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del artículo
 *     responses:
 *       200:
 *         description: Artículo eliminado
 *       404:
 *         description: Artículo no encontrado
 */
router.delete('/:id',
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  articulosController.remove
);

module.exports = router;
