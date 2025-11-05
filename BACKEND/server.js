// Dependencias y configuración
const express = require("express");
const authRoutes = require("./routes/auth.routes");
const corsMiddleware = require('./middleware/cors.middleware');
const parserMiddleware = require('./middleware/parser.middleware');
const { verifyToken } = require('./middleware/auth.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(corsMiddleware);
app.use(parserMiddleware);

// Rutas públicas
app.use("/api", authRoutes);

// Rutas protegidas 
app.use("/api/auth", authRoutes); 

const questionsRoutes = require("./routes/questions.routes");
app.use("/api/questions", verifyToken, questionsRoutes);

const certRoutes = require("./routes/cert.routes");
app.use("/api/certs", certRoutes);

const contactRoutes = require("./routes/contact.routes");
app.use("/api/contact", contactRoutes);

// Arranque del servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});