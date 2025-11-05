// Controlador de autenticación
const users = require("../data/users.json");
const { createSession, deleteSession } = require("../middleware/auth.middleware");

// Función controladora para manejar el login
exports.login = (req, res) =>{
    const {username} = req.body || {};
    const password = req.body?.password 
 
    // Valida campos requeridos
    if (!username || !password) {
        return res.status(400).json({
            error: "Faltan campos obligatorios: 'username' y 'password'.",
            ejemplo: {username: "usuario", password: "54321"}

        });
    }

    // Busca coincidencia en la base de datos
    const match = users.find(u => u.username === username && u.password === password);

    if (!match) {
        return res.status(401).json({ error: "Credenciales inválidas."});
    }

    // Login exitoso: generar token de sesión
    const token = createSession(match.username); // Usamos 'username' como userId
  
    console.log(`[LOGIN] Usuario: ${match.username} | Token: ${token} | Procede el login`);

    // Login exitoso
    return res.status(200).json({
        mensaje: "Acceso permitido",
        usuario: { username: match.username}, // devuelve solo la cuenta, NO la contraseña
        token: token                          // token de sesión para usar en peticiones protegidas
    });

};

// Función controladora para manejar el logout
exports.logout = (req, res) => {
  const token = req.token;   // El token viene del middleware verifyToken
  const userId = req.userId; // El userId viene del middleware verifyToken
  console.log(`[LOGOUT] Usuario en sesión: ${userId} | Token: ${token} | Procede el logout`);


  // Eliminar la sesión
  const deleted = deleteSession(token);

  if (deleted) {
    return res.status(200).json({ 
      mensaje: "Sesión cerrada correctamente" 
      
    });
  } else {
    return res.status(404).json({ 
      error: "Sesión no encontrada" 
    });
  }
};

// Función controladora para obtener el perfil del usuario autenticado
exports.getProfile = (req, res) => {
  const userId = req.userId; // El userId viene del middleware verifyToken

  // Buscar el usuario en la base de datos
  const user = users.find(u => u.cuenta === userId);

  if (!user) {
    return res.status(404).json({ 
      error: "Usuario no encontrado" 
    });
  }

  // Devolver información del usuario (sin contraseña)
  return res.status(200).json({
    usuario: { 
      cuenta: user.cuenta 
    }
  });
};
