const API_AUTH = "http://localhost:3000/api";
const API_QUESTIONS = "http://localhost:3000/api/questions";
const API_CERTS = "http://localhost:3000/api/certs";

// Variables globales
let preguntas = [];
let attemptId = null;
let currentScore = 0;
let totalQuestions = 0;
let timerInterval = null;
let currentQuestionIndex = 0;
let userAnswers = {};

// Elementos del DOM
let quizForm, resultado;
let prevBtn, nextBtn, submitBtn;
let progressBar, progressText, singleQuestionContainer;
let questionIndicator;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Obtener elementos del DOM
    quizForm = document.getElementById("quizForm");
    resultado = document.getElementById("resultado");
    prevBtn = document.getElementById("prevBtn");
    nextBtn = document.getElementById("nextBtn");
    submitBtn = document.getElementById("submitBtn");
    progressBar = document.getElementById("progressBar");
    progressText = document.getElementById("progressText");
    singleQuestionContainer = document.getElementById("singleQuestionContainer");
    questionIndicator = document.getElementById("questionIndicator");

    // Verificar si estamos en la página de examen
    if (quizForm) {
        loadQuestions();
    }

    setupEventListeners();
}

// Configurar event listeners
function setupEventListeners() {
    // Botones de navegación - verificar que existen
    if (prevBtn) {
        prevBtn.addEventListener("click", showPreviousQuestion);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener("click", showNextQuestion);
    }
    
    if (submitBtn) {
        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            submitQuiz(e, false);
        });
    }
}

// Cargar preguntas automáticamente al entrar al examen
async function loadQuestions() {
    const token = localStorage.getItem('token');
    const fullName = localStorage.getItem('fullName');
    
    if (!token) {
        showErrorAlert('Debes iniciar sesión primero');
        window.location.href = 'login.html';
        return;
    }

    try {
        // Mostrar loading
        document.getElementById('listaPreguntas').innerHTML = `
            <div class="question-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Cargando preguntas...</p>
            </div>
        `;

        const res = await fetch(`${API_QUESTIONS}/start`, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ fullName })
        });

        const data = await res.json();
        
        if (res.ok) {
            // Aleatorizar opciones en cada pregunta al cargarlas
            preguntas = data.questions.map(q => ({
                ...q,
                options: [...q.options].sort(() => Math.random() - 0.5)
            }));
            
            attemptId = data.attemptId;
            currentQuestionIndex = 0;
            userAnswers = {};

            // Ocultar loading y mostrar contenedor de pregunta única
            document.getElementById('listaPreguntas').style.display = "none";
            document.getElementById('progressContainer').style.display = "block";
            singleQuestionContainer.style.display = "block";
            
            // Mostrar la primera pregunta
            showQuestion(currentQuestionIndex);
            
            resultado.innerHTML = "";
            
            // Iniciar el temporizador con el tiempo del backend
            startTimer(data.time || 30); 
        } else {
            // Si el status es 403, significa que ya intentó el examen
            if (res.status === 403) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Examen no disponible',
                    text: 'Solo se puede hacer un intento del examen. Ya has realizado tu intento.',
                    confirmButtonColor: '#7e4fd7',
                    background: '#121212',
                    color: '#e5e5e5'
                }).then(() => {
                    window.location.href = 'certificaciones.html';
                });
            } else {
                showErrorAlert(data?.error ?? `Error ${res.status}`);
                window.location.href = 'certificaciones.html';
            }
        }
        } catch (err) { 
            console.error("Error al cargar preguntas:", err); 
            showErrorAlert("Error de conexión con el servidor"); 
            window.location.href = 'certificaciones.html'; }

    }

// Mostrar pregunta específica
function showQuestion(index) {
    // Guardar respuesta actual antes de cambiar
    saveCurrentAnswer();
    
    // Actualizar índice actual
    currentQuestionIndex = index;
    
    // Actualizar indicador de pregunta
    if (questionIndicator) {
        questionIndicator.textContent = `Pregunta ${index + 1} de ${preguntas.length}`;
    }
    
    // Limpiar contenedor de pregunta
    const currentQuestionElement = document.getElementById('currentQuestion');
    currentQuestionElement.innerHTML = "";
    
    // Obtener la pregunta actual
    const question = preguntas[index];
    
    // Crear elemento para la pregunta
    const div = document.createElement("div");
    div.className = "question-card";
    div.innerHTML = `
        <div class="question">
            <div class="question-header">
                <p class="question-text">${question.text}</p>
                <span class="question-number">${index + 1}/${preguntas.length}</span>
            </div>
            <div class="options">
                ${question.options.map((opt, optIndex) => `
                    <div class="option ${userAnswers[question.id] === opt ? 'selected' : ''}" data-value="${opt}">
                        <input type="radio" name="currentQuestion" value="${opt}" 
                               ${userAnswers[question.id] === opt ? 'checked' : ''}>
                        <label>${String.fromCharCode(65 + optIndex)}. ${opt}</label>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
    
    currentQuestionElement.appendChild(div);
    
    // Agregar event listeners a las opciones
    const options = currentQuestionElement.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            // Deseleccionar todas las opciones
            options.forEach(opt => opt.classList.remove('selected'));
            
            // Seleccionar la opción clickeada
            this.classList.add('selected');
            
            // Marcar el radio button
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Guardar la respuesta
            userAnswers[question.id] = radio.value;
        });
    });
    
    // Actualizar botones de navegación
    updateNavigationButtons();
    
    // Actualizar barra de progreso
    updateProgressBar();
}

// Guardar respuesta actual
function saveCurrentAnswer() {
    if (preguntas.length === 0) return;
    
    const currentQuestion = preguntas[currentQuestionIndex];
    const selectedOption = document.querySelector('input[name="currentQuestion"]:checked');
    
    if (selectedOption) {
        userAnswers[currentQuestion.id] = selectedOption.value;
    }
}

// Mostrar pregunta anterior
function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        showQuestion(currentQuestionIndex - 1);
    }
}

// Mostrar siguiente pregunta
function showNextQuestion() {
    if (currentQuestionIndex < preguntas.length - 1) {
        showQuestion(currentQuestionIndex + 1);
    }
}

// Actualizar botones de navegación
function updateNavigationButtons() {
    if (!prevBtn || !nextBtn || !submitBtn) return;
    
    // Botón anterior
    prevBtn.disabled = currentQuestionIndex === 0;
    
    // Botón siguiente y enviar
    if (currentQuestionIndex === preguntas.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

// Actualizar barra de progreso
function updateProgressBar() {
    if (!progressBar || !progressText) return;
    
    const progress = ((currentQuestionIndex + 1) / preguntas.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${currentQuestionIndex + 1}/${preguntas.length}`;
}

// Enviar respuestas del quiz
async function submitQuiz(e, timeExpired = false) {
    if (e) e.preventDefault();

    // Guardar respuesta de la pregunta actual
    saveCurrentAnswer();

    const token = localStorage.getItem('token');
    
    if (!token || !attemptId) {
        showErrorAlert('Error: sesión o intento inválido');
        return;
    }

    const answers = preguntas.map(q => {
        return { id: q.id, answer: userAnswers[q.id] || "" };
    });

    try {
        // Mostrar loading
        showLoadingAlert('Enviando respuestas...');
        
        const res = await fetch(`${API_QUESTIONS}/submit`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ 
                attemptId: attemptId,
                answers: answers,
                timeExpired: timeExpired
            })
        });

        const data = await res.json();

        if (res.ok) {
            // Detener el timer
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }

            // Cerrar el loading automáticamente y mostrar resultados
            Swal.close();
            showResults(data);
        } else {
            Swal.close();
            showErrorAlert(data?.error ?? `Error ${res.status}`);
        }
    } catch (err) {
        console.error("Error al enviar respuestas:", err);
        Swal.close();
        showErrorAlert("Error de conexión con el servidor");
    }
}

// Mostrar resultados
function showResults(data) {
    const passed = data.passed;
    
    resultado.innerHTML = `
        <div class="result-container">
            <div class="score-card ${passed ? 'approved' : 'failed'}">
                <h2 class="${passed ? 'passed' : 'failed'}">
                    ${passed ? '¡Felicidades!' : 'Intenta de nuevo'}
                </h2>
                <h3 class="score-display">${data.message}</h3>
                <div class="score">${data.score}/${data.total}</div>
                <div class="percentage">${Math.round((data.score/data.total)*100)}%</div>
                <div class="status ${passed ? 'approved' : 'failed'}">
                    ${passed ? 'APROBADO' : 'NO APROBADO'}
                </div>
            </div>
            
            ${passed ? `
                <div class="certificate-section" style="margin: 20px 0;">
                    <button id="btnDownloadCert" class="btn btn-primary">
                        <i class="fas fa-download"></i>
                        Descargar Certificado
                    </button>
                </div>
            ` : ''}
            
            <div class="answers-review">
                <h3 style="margin-bottom: 20px; color: var(--white);">Revisión de respuestas:</h3>
                ${data.details.map((d, index) => `
                    <div class="question-card ${d.correct ? 'correct-answer' : 'incorrect-answer'}" 
                        style="border-left: 4px solid ${d.correct ? 'var(--success)' : 'var(--danger)'}; margin-bottom: 20px;">
                        <div class="question">
                            <div class="question-header">
                                <p class="question-text">${d.text}</p>
                                <span class="question-number ${d.correct ? 'status approved' : 'status failed'}" 
                                      style="font-size: 0.8rem; padding: 5px 10px;">
                                    ${d.correct ? 'Correcta' : 'Incorrecta'}
                                </span>
                            </div>
                            <div class="options" style="pointer-events: none;">
                                <div class="option" style="background: rgba(255, 71, 87, 0.1); border-color: var(--danger);">
                                    <label><strong>Tu respuesta:</strong> ${d.yourAnswer || "(sin responder)"}</label>
                                </div>
                                <div class="option" style="background: rgba(0, 255, 140, 0.1); border-color: var(--success);">
                                    <label><strong>Respuesta correcta:</strong> ${d.correctAnswer}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join("")}
            </div>
            
            <div class="result-actions" style="margin-top: 30px;">
                <button onclick="window.location.href='certificaciones.html'" class="btn btn-outline">
                    <i class="fas fa-arrow-left"></i>
                    Volver a Certificaciones
                </button>
                
            </div>
        </div>
    `;
    
    resultado.style.display = "block";
    quizForm.style.display = "none";
    
    // Agregar event listener al botón de certificado si aprobó
    if (passed) {
        document.getElementById('btnDownloadCert').addEventListener('click', () => downloadCertificate(attemptId));
    }
}


// Descargar certificado
async function downloadCertificate(attemptId) {
  const token = localStorage.getItem('token');
  if (!token) {
    Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Debes iniciar sesión para descargar el certificado',
    confirmButtonColor: "#7e4fd7",
    background: "#121212",
    color: "#e5e5e5"
    });

    return;
  }

  try {
    const res = await fetch(`${API_CERTS}/${attemptId}/pdf`, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificado-${localStorage.getItem('fullName')?.replace(/\s+/g, '-') || 'Curso'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Certificado descargado con éxito',
        confirmButtonColor: "#7e4fd7",
        background: "#121212",
        color: "#e5e5e5"
    });

    } else {
      const data = await res.json();
      Swal.fire({
  icon: 'error',  // Cambia a 'success' si esperas que sea un mensaje de éxito
  title: 'Oops...',
  text: data?.message ?? 'Error al descargar el certificado',
  confirmButtonColor: "#7e4fd7",
  background: "#121212",
  color: "#e5e5e5"
});

    }
  } catch (err) {
    console.error('Error al descargar certificado:', err);
    Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Error de conexión al descargar el certificado',
    confirmButtonColor: "#7e4fd7",
    background: "#121212",
    color: "#e5e5e5"
    });

  }
}



// Función del temporizador (tiempo desde el backend)
async function startTimer() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return console.error("No hay token de autenticación");

    const res = await fetch(`${API_QUESTIONS}/timer`, { 
      method: "GET",
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();
    let timeLeft = data.time;
    const timerEl = document.getElementById('time');
    if (!timerEl) return console.error("Elemento 'time' no encontrado");

    timerEl.textContent = timeLeft;

    timerInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;

        Swal.fire({
          title: 'Tiempo agotado',
          text: 'Tu tiempo para responder el examen ha terminado. Tus respuestas se enviarán automáticamente.',
          icon: 'warning',
          confirmButtonColor: '#7e4fd7',
          confirmButtonText: 'Ver resultado',
          allowOutsideClick: false,
          background: '#121212',
          color: '#e5e5e5'
        }).then(() => {
          // Enviar respuestas automáticamente
          submitQuiz(null, true);
        });
      }
    }, 1000);
  } catch (err) {
    console.error("Error al iniciar el temporizador:", err);
  }
}


function submitQuizByTimeout() {
  submitQuiz(null, true); // Llama a submitQuiz indica que el tiempo expiró
}





// Funciones para alertas
function showErrorAlert(message) {
    Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonColor: '#7e4fd7'
    });
}

function showLoadingAlert(message) {
    Swal.fire({
        title: message,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}