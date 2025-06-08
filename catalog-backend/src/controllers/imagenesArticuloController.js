const pool = require('../config/db');

// Crear una imagen para un artículo
exports.create = async (req, res) => {
  const { id_articulo, imagen_base64, descripcion, orden } = req.body;
  if (!id_articulo || !imagen_base64) {
    return res.status(400).json({ message: 'id_articulo e imagen_base64 son obligatorios' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO imagenes_articulo (id_articulo, imagen_base64, descripcion, orden) VALUES (?, ?, ?, ?)',
      [id_articulo, imagen_base64, descripcion || null, orden || null]
    );
    res.status(201).json({ id_imagen: result.insertId, id_articulo, descripcion, orden });
  } catch (err) {
    res.status(500).json({ message: 'Error al guardar la imagen', error: err.message });
  }
};

// Obtener imágenes de un artículo
exports.getByArticulo = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM imagenes_articulo WHERE id_articulo = ? ORDER BY orden ASC, id_imagen ASC',
      [req.params.id_articulo]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener imágenes', error: err.message });
  }
};

// Eliminar una imagen
exports.remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM imagenes_articulo WHERE id_imagen = ?', [req.params.id_imagen]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Imagen no encontrada' });
    res.json({ message: 'Imagen eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar la imagen', error: err.message });
  }
};
