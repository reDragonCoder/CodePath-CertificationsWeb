// === CONFIGURACIÓN GENERAL ===
const API_AUTH = "http://localhost:3000/api/auth";

// === ELEMENTOS DEL DOM ===
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginModal = document.getElementById("loginModal");
const closeModal = document.getElementById("closeModal");
const formLogin = document.getElementById("formLogin");
const userNameEl = document.getElementById("userName");

// === FUNCIONES AUXILIARES ===

// Mostrar modal de inicio de sesión
function openLoginModal() {
  if (loginModal) loginModal.style.display = "block";
}

// Cerrar modal
function closeLoginModal() {
  if (loginModal) loginModal.style.display = "none";
}

// Mostrar alerta personalizada con SweetAlert2
function showAlert(icon, title, text) {
  Swal.fire({
    icon,
    title,
    text,
    confirmButtonColor: "#7e4fd7",
    background: "#121212",
    color: "#e5e5e5",
  });
}

// === MANEJO DE LOGIN ===
async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById("login").value.trim();
  const password = document.getElementById("password").value.trim();
  const fullName = document.getElementById("fullName")?.value.trim() || "";

  if (!username || !password) {
    showAlert("warning", "Campos incompletos", "Por favor ingresa tus datos.");
    return;
  }

  try {
    const res = await fetch(`${API_AUTH}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok && data.token) {
      // Guardar sesión
      localStorage.setItem("token", `Bearer ${data.token}`);
      localStorage.setItem("userName", data.usuario?.username || username);
      localStorage.setItem("fullName", fullName);

      updateUI();
      controlCertificaciones();

      showAlert("success", "Acceso permitido", `Bienvenido ${data.usuario?.username || username}`);

      // Guardar información completa del usuario actual (para asociar compras)
      const usuarioActual = {
        nombre: data.usuario?.username || username,
        fullName: fullName || "",
        token: data.token
      };
      localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));


      // Limpiar campos y cerrar modal
      document.getElementById("login").value = "";
      document.getElementById("password").value = "";
      if (document.getElementById("fullName")) document.getElementById("fullName").value = "";
      closeLoginModal();
    } else {
      showAlert("error", "Error de autenticación", data?.error || "Credenciales incorrectas.");
    }

  } catch (err) {
    console.error("Error de conexión:", err);
    showAlert("error", "Error de conexión", "No se pudo conectar con el servidor.");
  }
}

// === CERRAR SESIÓN ===
function logout() {
  // Eliminar solo los datos de sesión del usuario actual
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("fullName");
  localStorage.removeItem("usuarioActual"); // limpia la sesión activa, pero no las compras

  // Actualizar interfaz
  updateUI();
  controlCertificaciones();

  // Mostrar alerta y redirigir al login
  Swal.fire({
    icon: "info",
    title: "Sesión cerrada",
    text: "Has cerrado sesión correctamente.",
    confirmButtonColor: "#7e4fd7",
    background: "#121212",
    color: "#e5e5e5"
  }).then(() => {
    window.location.href = "login.html"; // vuelve a login
  });
}


// === ACTUALIZAR INTERFAZ ===
function updateUI() {
  const user = localStorage.getItem("userName");

  if (user) {
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (userNameEl) userNameEl.textContent = `Bienvenido, ${user}`;

    // Quitar clase "requiere-login" de todos los botones si el usuario ha iniciado sesión
    document.querySelectorAll(".btn-cert.requiere-login").forEach(btn => {
      btn.classList.remove("requiere-login");
    });

  } else {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (userNameEl) userNameEl.textContent = "";

    // Volver a agregar la clase "requiere-login" si se cierra sesión
    document.querySelectorAll(".btn-cert:not(.requiere-login)").forEach(btn => {
      btn.classList.add("requiere-login");
    });
  }
}


// === CONTROL DE BOTONES CERTIFICACIONES ===
function controlCertificaciones() {
  const user = localStorage.getItem("userName");
  const botones = document.querySelectorAll(".requiere-login");

  botones.forEach(btn => {
    btn.style.display = user ? "inline-block" : "none";
  });
}

// === EVENTOS ===
document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  controlCertificaciones();
  // setupSuscribirmeButtons();

  if (loginBtn) loginBtn.onclick = openLoginModal;
  if (closeModal) closeModal.onclick = closeLoginModal;
  if (formLogin) formLogin.addEventListener("submit", handleLogin);
  if (logoutBtn) logoutBtn.onclick = logout;

  // Cerrar modal al hacer clic fuera
  window.onclick = function (event) {
    if (event.target === loginModal) closeLoginModal();
  };
});

console.log("Script de login y control de botones cargado correctamente.");

// === Control botones certificaciones ===

// Ocultar botones de certificaciones si no hay sesión iniciada
function controlCertificaciones() {
  const user = localStorage.getItem("userName");
  const botones = document.querySelectorAll(".requiere-login");

  botones.forEach(btn => {
    btn.style.display = user ? "inline-block" : "none";
  });
}

// Ejecutar la verificación al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  controlCertificaciones();
});


// === Manejo de info de cuenta === */
document.addEventListener("DOMContentLoaded", () => {
  const infoSection = document.getElementById("info-section");
  const user = localStorage.getItem("userName");
  const fullName = localStorage.getItem("fullName");
  // const compras = JSON.parse(localStorage.getItem("compras")) || [];
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
const claveCompras = usuario ? `compras_${usuario.nombre}` : "compras_inv";
const compras = JSON.parse(localStorage.getItem(claveCompras)) || [];


  if (user && infoSection) {
    // Construir HTML dinámico para mostrar los datos del usuario
    let comprasHTML = "<ul>";
    if (compras.length > 0) {
      compras.forEach(c => {
        comprasHTML += `<li>${c.descripcion} — ${c.fecha} — ${c.monto}</li>`;
      });
    } else {
      comprasHTML += "<li>No tienes compras registradas.</li>";
    }
    comprasHTML += "</ul>";

    infoSection.innerHTML = `
      <h2>Mi cuenta</h2>
      <p><strong>Usuario:</strong> ${user}</p>
      <p><strong>Nombre completo:</strong> ${fullName || "No registrado"}</p>
      <h3>Compras realizadas</h3>
      ${comprasHTML}
      
    `;

    // Activar logout también aquí
    document.getElementById("logoutBtn2").addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("fullName");
      localStorage.removeItem("compras");

      Swal.fire({
        icon: "info",
        title: "Sesión cerrada",
        text: "Has cerrado sesión correctamente.",
        confirmButtonColor: "#7e4fd7",
        background: "#121212",
        color: "#e5e5e5"
      }).then(() => {
        window.location.reload();
      });
    });
  }
});
