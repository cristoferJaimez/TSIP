const pool = require('../config/db');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM articulos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener artículos', error: err.message });
  }
};

exports.getById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM articulos WHERE id_articulo = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Artículo no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el artículo', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { nombre, descripcion, precio, stock, imagen, categoria } = req.body;
  if (!nombre || !precio || !stock) {
    return res.status(400).json({ message: 'Nombre, precio y stock son obligatorios' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO articulos (nombre, descripcion, precio, stock, imagen, categoria) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, stock, imagen, categoria]
    );
    res.status(201).json({ id_articulo: result.insertId, nombre, descripcion, precio, stock, imagen, categoria });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el artículo', error: err.message });
  }
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { nombre, descripcion, precio, stock, imagen, categoria } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE articulos SET nombre=?, descripcion=?, precio=?, stock=?, imagen=?, categoria=? WHERE id_articulo=?',
      [nombre, descripcion, precio, stock, imagen, categoria, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Artículo no encontrado' });
    res.json({ message: 'Artículo actualizado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el artículo', error: err.message });
  }
};

exports.remove = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const [result] = await pool.query('DELETE FROM articulos WHERE id_articulo = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Artículo no encontrado' });
    res.json({ message: 'Artículo eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el artículo', error: err.message });
  }
};

// Crear artículo, características e imágenes en una sola transacción
exports.createFull = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { articulo, caracteristicas, imagenes } = req.body;
    if (!articulo || !articulo.nombre || !articulo.precio || !articulo.stock) {
      return res.status(400).json({ message: 'Datos de artículo incompletos' });
    }
    await conn.beginTransaction();
    // Insertar artículo
    const [artRes] = await conn.query(
      'INSERT INTO articulos (nombre, descripcion, precio, stock, categoria) VALUES (?, ?, ?, ?, ?)',
      [articulo.nombre, articulo.descripcion || null, articulo.precio, articulo.stock, articulo.categoria || null]
    );
    const id_articulo = artRes.insertId;
    // Insertar características
    if (Array.isArray(caracteristicas)) {
      for (const c of caracteristicas) {
        if (c.id_caracteristica && c.valor) {
          await conn.query(
            'INSERT INTO articulo_caracteristica (id_articulo, id_caracteristica, valor) VALUES (?, ?, ?)',
            [id_articulo, c.id_caracteristica, c.valor]
          );
        }
      }
    }
    // Insertar imágenes
    if (Array.isArray(imagenes)) {
      for (const img of imagenes) {
        if (img.imagen_base64) {
          await conn.query(
            'INSERT INTO imagenes_articulo (id_articulo, imagen_base64, descripcion, orden) VALUES (?, ?, ?, ?)',
            [id_articulo, img.imagen_base64, img.descripcion || null, img.orden || null]
          );
        }
      }
    }
    await conn.commit();
    res.status(201).json({ id_articulo, ...articulo });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Error al crear el artículo completo', error: err.message });
  } finally {
    conn.release();
  }
};

// Obtener el top N de productos más vendidos
exports.getTopVendidos = async (req, res) => {
  let limit = 3;
  if (req.query.limit !== undefined && req.query.limit !== null && req.query.limit !== '' && !isNaN(Number(req.query.limit))) {
    limit = parseInt(req.query.limit);
  }
  try {
    const [rows] = await pool.query(`
      SELECT a.id_articulo, a.nombre, a.descripcion, a.precio, a.categoria, 
             COALESCE(SUM(pd.cantidad),0) as total_vendidos,
             (SELECT imagen_base64 FROM imagenes_articulo ia WHERE ia.id_articulo = a.id_articulo ORDER BY ia.orden ASC LIMIT 1) as imagen
      FROM articulos a
      LEFT JOIN pedido_detalle pd ON a.id_articulo = pd.id_articulo
      GROUP BY a.id_articulo
      ORDER BY total_vendidos DESC
      LIMIT ?
    `, [limit]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos más vendidos', error: err.message });
  }
};

// Búsqueda avanzada de artículos
exports.advancedSearch = async (req, res) => {
  try {
    const { nombre, categoria, precioMin, precioMax } = req.query;
    let sql = 'SELECT * FROM articulos WHERE 1=1';
    const params = [];
    if (nombre) {
      sql += ' AND (LOWER(nombre) LIKE ? OR LOWER(descripcion) LIKE ?)';
      params.push(`%${nombre.toLowerCase()}%`, `%${nombre.toLowerCase()}%`);
    }
    if (categoria) {
      sql += ' AND LOWER(categoria) LIKE ?';
      params.push(`%${categoria.toLowerCase()}%`);
    }
    if (precioMin !== undefined && precioMin !== null && precioMin !== '' && !isNaN(Number(precioMin))) {
      sql += ' AND precio >= ?';
      params.push(Number(precioMin));
    }
    if (precioMax !== undefined && precioMax !== null && precioMax !== '' && !isNaN(Number(precioMax))) {
      sql += ' AND precio <= ?';
      params.push(Number(precioMax));
    }
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error en búsqueda avanzada', error: err.message });
  }
};

// Obtener todas las categorías distintas y precios mínimo y máximo
exports.getCategoriasYPrecios = async (req, res) => {
  try {
    const [categorias] = await pool.query('SELECT DISTINCT categoria FROM articulos WHERE categoria IS NOT NULL AND categoria <> ""');
    const [precios] = await pool.query('SELECT MIN(precio) as minPrecio, MAX(precio) as maxPrecio FROM articulos');
    res.json({
      categorias: categorias.map(c => c.categoria),
      minPrecio: precios[0].minPrecio,
      maxPrecio: precios[0].maxPrecio
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener categorías y precios', error: err.message });
  }
};
