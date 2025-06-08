const pool = require('../config/db');
const { validationResult } = require('express-validator');

exports.getByUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const [carritos] = await pool.query('SELECT * FROM carrito WHERE id_usuario = ? ORDER BY fecha_creacion DESC LIMIT 1', [req.params.id_usuario]);
    if (carritos.length === 0) return res.json({ items: [] });
    const id_carrito = carritos[0].id_carrito;
    const [items] = await pool.query(
      `SELECT cd.*, a.nombre, a.precio FROM carrito_detalle cd
       JOIN articulos a ON cd.id_articulo = a.id_articulo
       WHERE cd.id_carrito = ?`, [id_carrito]);
    res.json({ id_carrito, items });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el carrito', error: err.message });
  }
};

exports.addItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id_usuario, id_articulo, cantidad } = req.body;
  if (!id_usuario || !id_articulo || !cantidad) return res.status(400).json({ message: 'Datos incompletos' });
  try {
    let [carritos] = await pool.query('SELECT * FROM carrito WHERE id_usuario = ? ORDER BY fecha_creacion DESC LIMIT 1', [id_usuario]);
    let id_carrito;
    if (carritos.length === 0) {
      const [result] = await pool.query('INSERT INTO carrito (id_usuario) VALUES (?)', [id_usuario]);
      id_carrito = result.insertId;
    } else {
      id_carrito = carritos[0].id_carrito;
    }
    await pool.query(
      'INSERT INTO carrito_detalle (id_carrito, id_articulo, cantidad) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)',
      [id_carrito, id_articulo, cantidad]
    );
    res.json({ message: 'Artículo agregado al carrito' });
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar al carrito', error: err.message });
  }
};

exports.removeItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id_carrito, id_articulo } = req.body;
  if (!id_carrito || !id_articulo) return res.status(400).json({ message: 'Datos incompletos' });
  try {
    await pool.query('DELETE FROM carrito_detalle WHERE id_carrito = ? AND id_articulo = ?', [id_carrito, id_articulo]);
    res.json({ message: 'Artículo eliminado del carrito' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar del carrito', error: err.message });
  }
};

exports.empty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const [carritos] = await pool.query('SELECT * FROM carrito WHERE id_usuario = ? ORDER BY fecha_creacion DESC LIMIT 1', [req.params.id_usuario]);
    if (carritos.length === 0) return res.json({ message: 'Carrito ya vacío' });
    const id_carrito = carritos[0].id_carrito;
    await pool.query('DELETE FROM carrito_detalle WHERE id_carrito = ?', [id_carrito]);
    res.json({ message: 'Carrito vaciado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al vaciar el carrito', error: err.message });
  }
};
