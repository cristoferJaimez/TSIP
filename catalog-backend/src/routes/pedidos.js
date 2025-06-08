const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Gestión de pedidos
 */

/**
 * @swagger
 * /api/pedidos/usuario/{id_usuario}:
 *   get:
 *     summary: Listar pedidos de un usuario
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get('/usuario/:id_usuario', pedidosController.getByUsuario);

/**
 * @swagger
 * /api/pedidos/crear:
 *   post:
 *     summary: Crear un pedido (checkout)
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Pedido creado
 */
router.post('/crear', pedidosController.create);

/**
 * @swagger
 * /api/pedidos/{id_pedido}:
 *   get:
 *     summary: Obtener detalles de un pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id_pedido
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Detalles del pedido
 *       404:
 *         description: Pedido no encontrado
 */
router.get('/:id_pedido', pedidosController.getById);

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crear un pedido (compatibilidad RESTful)
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Pedido creado
 */
router.post('/', pedidosController.create);

module.exports = router;
