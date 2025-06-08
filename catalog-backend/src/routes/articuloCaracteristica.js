const express = require('express');
const router = express.Router();
const articuloCaracteristicaController = require('../controllers/articuloCaracteristicaController');

/**
 * @swagger
 * tags:
 *   name: ArticuloCaracteristica
 *   description: Asignación de características a artículos
 */

/**
 * @swagger
 * /api/articulo-caracteristica/{id_articulo}:
 *   get:
 *     summary: Obtener características de un artículo
 *     tags: [ArticuloCaracteristica]
 *     parameters:
 *       - in: path
 *         name: id_articulo
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del artículo
 *     responses:
 *       200:
 *         description: Lista de características del artículo
 */
router.get('/:id_articulo', articuloCaracteristicaController.getByArticulo);

/**
 * @swagger
 * /api/articulo-caracteristica:
 *   post:
 *     summary: Asignar característica a un artículo
 *     tags: [ArticuloCaracteristica]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_articulo:
 *                 type: integer
 *               id_caracteristica:
 *                 type: integer
 *               valor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Característica asignada
 */
router.post('/', articuloCaracteristicaController.assign);

/**
 * @swagger
 * /api/articulo-caracteristica/{id_articulo}/{id_caracteristica}:
 *   delete:
 *     summary: Eliminar característica de un artículo
 *     tags: [ArticuloCaracteristica]
 *     parameters:
 *       - in: path
 *         name: id_articulo
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del artículo
 *       - in: path
 *         name: id_caracteristica
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la característica
 *     responses:
 *       200:
 *         description: Característica eliminada
 *       404:
 *         description: No encontrada
 */
router.delete('/:id_articulo/:id_caracteristica', articuloCaracteristicaController.remove);

module.exports = router;
