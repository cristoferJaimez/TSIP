const express = require('express');
const router = express.Router();
const imagenesController = require('../controllers/imagenesArticuloController');

// Crear imagen para un artículo
router.post('/', imagenesController.create);
// Obtener imágenes de un artículo
router.get('/:id_articulo', imagenesController.getByArticulo);
// Eliminar imagen
router.delete('/:id_imagen', imagenesController.remove);

module.exports = router;
