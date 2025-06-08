function firewall(req, res, next) {
  // Permitir preflight OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return next();
  }
  // Ejemplo: bloquear acceso a rutas administrativas desde fuera de localhost
  const allowed = ['::1', '127.0.0.1', 'localhost'];
  const ip = req.ip || req.connection.remoteAddress;
  if (!allowed.some(a => ip.includes(a))) {
    return res.status(403).json({ message: 'Acceso denegado por firewall' });
  }
  next();
}

module.exports = firewall;
