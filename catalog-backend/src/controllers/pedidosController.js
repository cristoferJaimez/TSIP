const pool = require('../config/db');
const { validationResult } = require('express-validator');

exports.getByUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM pedidos WHERE id_usuario = ?', [req.params.id_usuario]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pedidos', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id_usuario } = req.body;
  if (!id_usuario) return res.status(400).json({ message: 'Usuario requerido' });
  try {
    // Obtener el carrito más reciente
    const [carritos] = await pool.query('SELECT * FROM carrito WHERE id_usuario = ? ORDER BY fecha_creacion DESC LIMIT 1', [id_usuario]);
    if (carritos.length === 0) return res.status(400).json({ message: 'No hay carrito para este usuario' });
    const id_carrito = carritos[0].id_carrito;
    const [items] = await pool.query('SELECT * FROM carrito_detalle WHERE id_carrito = ?', [id_carrito]);
    if (items.length === 0) return res.status(400).json({ message: 'El carrito está vacío' });
    // Calcular subtotal
    let subtotal = 0;
    for (const item of items) {
      const [articulo] = await pool.query('SELECT precio FROM articulos WHERE id_articulo = ?', [item.id_articulo]);
      subtotal += articulo[0].precio * item.cantidad;
    }
    const iva = subtotal * 0.19;
    const domicilio = subtotal * 0.10;
    const total = subtotal + iva + domicilio;
    // Crear pedido
    const [pedidoResult] = await pool.query('INSERT INTO pedidos (id_usuario, total, estado) VALUES (?, ?, ?)', [id_usuario, total, 'pendiente']);
    const id_pedido = pedidoResult.insertId;
    // Insertar detalles
    for (const item of items) {
      const [articulo] = await pool.query('SELECT precio FROM articulos WHERE id_articulo = ?', [item.id_articulo]);
      await pool.query('INSERT INTO pedido_detalle (id_pedido, id_articulo, cantidad, precio_unitario) VALUES (?, ?, ?, ?)', [id_pedido, item.id_articulo, item.cantidad, articulo[0].precio]);
    }
    // Vaciar carrito
    await pool.query('DELETE FROM carrito_detalle WHERE id_carrito = ?', [id_carrito]);
    res.status(201).json({ id_pedido, subtotal, iva, domicilio, total });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear pedido', error: err.message });
  }
};

exports.getById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const [pedido] = await pool.query('SELECT * FROM pedidos WHERE id_pedido = ?', [req.params.id_pedido]);
    if (pedido.length === 0) return res.status(404).json({ message: 'Pedido no encontrado' });
    const [detalles] = await pool.query(
      `SELECT pd.*, a.nombre FROM pedido_detalle pd
       JOIN articulos a ON pd.id_articulo = a.id_articulo
       WHERE pd.id_pedido = ?`, [req.params.id_pedido]);
    res.json({ pedido: pedido[0], detalles });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pedido', error: err.message });
  }
};
