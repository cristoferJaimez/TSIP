const pool = require('../config/db');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM caracteristicas');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener características', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ message: 'Nombre requerido' });
  try {
    const [result] = await pool.query('INSERT INTO caracteristicas (nombre) VALUES (?)', [nombre]);
    res.status(201).json({ id_caracteristica: result.insertId, nombre });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear característica', error: err.message });
  }
};

exports.remove = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const [result] = await pool.query('DELETE FROM caracteristicas WHERE id_caracteristica = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Característica no encontrada' });
    res.json({ message: 'Característica eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar característica', error: err.message });
  }
};
