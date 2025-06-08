const pool = require('../config/db');
const { validationResult } = require('express-validator');

exports.getByArticulo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const [rows] = await pool.query(
      `SELECT ac.*, c.nombre as caracteristica FROM articulo_caracteristica ac
       JOIN caracteristicas c ON ac.id_caracteristica = c.id_caracteristica
       WHERE ac.id_articulo = ?`,
      [req.params.id_articulo]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener características del artículo', error: err.message });
  }
};

exports.assign = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id_articulo, id_caracteristica, valor } = req.body;
  if (!id_articulo || !id_caracteristica || !valor) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }
  try {
    await pool.query(
      'INSERT INTO articulo_caracteristica (id_articulo, id_caracteristica, valor) VALUES (?, ?, ?)',
      [id_articulo, id_caracteristica, valor]
    );
    res.status(201).json({ message: 'Característica asignada al artículo' });
  } catch (err) {
    res.status(500).json({ message: 'Error al asignar característica', error: err.message });
  }
};

exports.remove = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const [result] = await pool.query(
      'DELETE FROM articulo_caracteristica WHERE id_articulo = ? AND id_caracteristica = ?',
      [req.params.id_articulo, req.params.id_caracteristica]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'No encontrada' });
    res.json({ message: 'Característica eliminada del artículo' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar característica', error: err.message });
  }
};
