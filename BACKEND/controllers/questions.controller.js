// Controlador para gestionar el quiz de preguntas
const QUESTIONS = require("../data/questions");
const crypto = require('crypto');

// Almacenamiento de attempts por usuario
const attempts = new Map(); // { attemptId: { userId, questions, timestamp } }

// Inicia el quiz y envía preguntas aleatorias 
const startQuiz = (req, res) => {
  const userId = req.userId; // Del token del middleware
  
  // Verificar si el usuario ya tiene un attempt previo
  for (const [attemptId, attempt] of attempts.entries()) {
    if (attempt.userId === userId) {
      return res.status(403).json({ 
        error: "El examen solo se puede aplicar una vez" 
      });
    }
  }

  // Crea una copia de las preguntas sin el campo 'correct' (seguridad)
  const publicQuestions = QUESTIONS.map(({id, text, options }) => ({
    id, text, options
  }));

  console.log("Acceso al /api/questions/start")

  // Generar attemptId único
  const attemptId = crypto.randomUUID();
  const { fullName } = req.body; // Nombre real del usuario desde el frontend

  const quest = [];
  const usedIndices = new Set(); // Set local para este attempt

  // Selecciona 8 preguntas aleatorias sin repetir
  for(var i = 0; i < 8; i++){
    let num;
    do {
      num = Math.floor(Math.random() * publicQuestions.length);
    } while (usedIndices.has(num));
              
    usedIndices.add(num);
    
    // Solo copiar sin aleatorizar
    const question = JSON.parse(JSON.stringify(publicQuestions[num]));
    question.displayId = i + 1;
    
    quest.push(question);
  }

  // Almacenar attempt
  attempts.set(attemptId, {
    userId,
    fullName: fullName || userId, // Guardar nombre real o userId como fallback
    questions: quest.map(q => q.id),
    timestamp: Date.now()
  });

  res.status(200).json({
    attemptId: attemptId, 
    questions: quest  
  });
};

// Recibe y evalúa las respuestas del usuario
const submitAnswers = (req, res) => {
  const { attemptId, answers, timeExpired } = req.body; // timeExpired indica si el tiempo acabó
  const userAnswers = Array.isArray(answers) ? answers : [];

  console.log("Acceso al /api/questions/submit")
  console.log(userAnswers);

  // Buscar el attempt
  const attempt = attempts.get(attemptId);
  if (!attempt) {
    return res.status(400).json({ error: "ID de intento no encontrado" });
  }

  // Validar que el attempt pertenece al usuario autenticado
  if (attempt.userId !== req.userId) {
    return res.status(403).json({ error: "No tienes permiso para calificar este intento" });
  }

  // Si NO expiró el tiempo, validar que todas estén contestadas
  if (!timeExpired) {
    const answeredQuestions = userAnswers.filter(a => a.answer && a.answer.trim() !== "");
    if (answeredQuestions.length < attempt.questions.length) {
      return res.status(400).json({ 
        error: "Debes responder todas las preguntas antes de enviar el examen",
        respondidas: answeredQuestions.length,
        total: attempt.questions.length
      });
    }
  }
  // Si expiró el tiempo, permitimos respuestas parciales y las no respondidas se califican como incorrectas

  let score = 0;
  const details = [];

  // Evalúa solo las preguntas de este attempt
  for (const q of QUESTIONS) {
    if (!attempt.questions.includes(q.id)) continue;

    const user = userAnswers.find(a => a.id === q.id);
    // Si no hay respuesta o está vacía, se considera incorrecta
    const userAnswer = user && user.answer && user.answer.trim() !== "" ? user.answer : null;
    const isCorrect = !!userAnswer && userAnswer === q.correct;

    if (isCorrect) score++;
    details.push({
      id: q.id,
      text: q.text,
      yourAnswer: userAnswer, // null si no respondió
      correctAnswer: q.correct,
      correct: isCorrect
    });
  }

  // Guardar el resultado en el attempt para validación posterior del certificado
  attempt.score = score;
  attempt.total = attempt.questions.length;
  attempt.passed = score >= attempt.questions.length * 0.7; // 70% para aprobar

  // Determinar mensaje según resultado
  let message;
  if (attempt.passed) {
    message = "¡Felicidades! Has aprobado el examen.";
    console.log(`[SUBMIT] Usuario ${req.userId} aprobó el examen con ${score}/${attempt.questions.length}`);
  } else {
    message = "Lo sentimos, has reprobado el examen. No alcanzaste el 70% requerido.";
    console.log(`[SUBMIT] Usuario ${req.userId} reprobó el examen con ${score}/${attempt.questions.length}`);
  }

  return res.status(200).json({
    message: message,
    score,
    total: attempt.questions.length,
    passed: attempt.passed,
    details
  });
};

// Envía el tiempo límite del quiz
const timer = (req, res)  => {
  const time = 30;
  res.status(200).json({
    message: "Time sent",
    time: time
  });
};

module.exports = { startQuiz, submitAnswers, timer, attempts };