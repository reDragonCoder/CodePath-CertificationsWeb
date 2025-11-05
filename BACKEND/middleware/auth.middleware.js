// Gestión de sesiones de usuario en memoria
const sessions = new Map(); // Estructura: { token: userId }

/**
 Middleware para verificar el token de sesión
 Espera el token en el header: Authorization: Bearer <token>
*/
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Valida formato del header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Token no proporcionado o formato incorrecto',
      formato_esperado: 'Authorization: Bearer <token>' 
    });
  }

  const token = authHeader.substring(7);
  const userId = sessions.get(token);

  if (!userId) {
    return res.status(401).json({ 
      error: 'Token inválido' 
    });
  }

  // Adjunta información del usuario al request
  req.userId = userId;
  req.token = token;

  next();
};

// Crea una nueva sesión y retorna el token generado
exports.createSession = (userId) => {
  const crypto = require('crypto');
  // Usar crypto.randomUUID cuando esté disponible (Node 14.17+).
  // Si no está disponible, hacer fallback a randomBytes para compatibilidad.
  const token = (typeof crypto.randomUUID === 'function')
    ? crypto.randomUUID()
    : crypto.randomBytes(32).toString('hex');
  sessions.set(token, userId);
  return token;
};

// Elimina una sesión (logout)
exports.deleteSession = (token) => {
  return sessions.delete(token);
};

// Obtiene el número de sesiones activas
exports.getActiveSessions = () => {
  return sessions.size;
};

// Limpia todas las sesiones
exports.clearAllSessions = () => {
  sessions.clear();
};

