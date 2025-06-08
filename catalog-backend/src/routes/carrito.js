const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

/**
 * @swagger
 * tags:
 *   name: Carrito
 *   description: Gestión del carrito de compras
 */

/**
 * @swagger
 * /api/carrito/{id_usuario}:
 *   get:
 *     summary: Obtener el carrito de un usuario
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Carrito del usuario
 */
router.get('/:id_usuario', carritoController.getByUsuario);

/**
 * @swagger
 * /api/carrito/add:
 *   post:
 *     summary: Agregar artículo al carrito
 *     tags: [Carrito]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *               id_articulo:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Artículo agregado al carrito
 */
router.post('/add', carritoController.addItem);

/**
 * @swagger
 * /api/carrito/remove:
 *   delete:
 *     summary: Eliminar artículo del carrito
 *     tags: [Carrito]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_carrito:
 *                 type: integer
 *               id_articulo:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Artículo eliminado del carrito
 */
router.delete('/remove', carritoController.removeItem);

/**
 * @swagger
 * /api/carrito/empty/{id_usuario}:
 *   delete:
 *     summary: Vaciar el carrito de un usuario
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Carrito vaciado
 */
router.delete('/empty/:id_usuario', carritoController.empty);

module.exports = router;
