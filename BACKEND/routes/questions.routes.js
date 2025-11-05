// Dependencias y configuración
const express = require("express");
const router = express.Router();
const { startQuiz, submitAnswers, timer } = require("../controllers/questions.controller");

// Rutas del quiz 
router.post("/start", startQuiz);       // Inicia el quiz y envía las preguntas
router.post("/submit", submitAnswers);  // Recibe y evalúa las respuestas
router.get("/timer", timer);            // Devuelve el tiempo del quiz

module.exports = router;
