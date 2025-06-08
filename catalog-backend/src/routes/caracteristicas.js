const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const caracteristicasController = require('../controllers/caracteristicasController');

/**
 * @swagger
 * tags:
 *   name: Caracteristicas
 *   description: Gestión de características
 */

/**
 * @swagger
 * /api/caracteristicas:
 *   get:
 *     summary: Obtener todas las características
 *     tags: [Caracteristicas]
 *     responses:
 *       200:
 *         description: Lista de características
 */
router.get('/', caracteristicasController.getAll);

/**
 * @swagger
 * /api/caracteristicas:
 *   post:
 *     summary: Crear una característica
 *     tags: [Caracteristicas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Característica creada
 */
router.post('/',
  body('nombre').isString().notEmpty().withMessage('Nombre requerido'),
  caracteristicasController.create
);

/**
 * @swagger
 * /api/caracteristicas/{id}:
 *   delete:
 *     summary: Eliminar una característica
 *     tags: [Caracteristicas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la característica
 *     responses:
 *       200:
 *         description: Característica eliminada
 *       404:
 *         description: Característica no encontrada
 */
router.delete('/:id',
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  caracteristicasController.remove
);

module.exports = router;
