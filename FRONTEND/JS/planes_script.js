// === Detectar clics en todos los botones que llevan a pago.html (UNIFICADO) ===
document.querySelectorAll(".btn-suscribirme, .btn-cert").forEach(boton => {
    boton.addEventListener("click", (e) => {
        e.preventDefault();

        const user = localStorage.getItem("userName");

        if (!user) {
            Swal.fire({
                icon: "info",
                title: "Inicia sesión",
                text: "Debes iniciar sesión para poder suscribirte.",
                confirmButtonText: "Ir al login",
                confirmButtonColor: "#7e4fd7",
                background: "#121212",
                color: "#e5e5e5",
            }).then(() => {
                window.location.href = "login.html";
            });
            return;
        }

        // Detectar el nombre del curso
        const card = e.target.closest(".plan-card, .cert-card");
        if (!card) return;

        const nombre = card.querySelector("h3")?.textContent?.trim() || "";
        const precio = card.querySelector(".price, li:last-child")?.textContent?.replace("Costo:", "").trim() || "MXN 0";

        // Si no es la certificación en C++, bloquear el botón de pago
        if (!nombre.includes("C++")) {
            Swal.fire({
                icon: "warning",
                title: "No disponible",
                text: "Por ahora solo la certificación en C++ está habilitada para pago.",
                confirmButtonColor: "#7e4fd7",
                background: "#121212",
                color: "#e5e5e5",
            });
            return;
        }

        // Si sí es C++, permitir el proceso normal
        localStorage.setItem("cursoSeleccionado", JSON.stringify({ nombre, precio }));
        window.location.href = "pago.html";
    });
});

// === Controlar botones según usuario y compras ===
document.addEventListener("DOMContentLoaded", () => {
    try {
        const usuarioData = localStorage.getItem("usuarioActual");
        if (!usuarioData) return;

        const usuario = JSON.parse(usuarioData);
        const claveCompras = `compras_${usuario.nombre}`;
        const compras = JSON.parse(localStorage.getItem(claveCompras)) || [];

        const botonesPago = document.querySelectorAll(".btn-suscribirme, .btn-cert");

        botonesPago.forEach(boton => {
            const texto = boton.textContent.trim().toLowerCase();
            if (texto.includes("examen")) return; // ignorar botones de examen

            const card = boton.closest(".plan-card, .cert-card");
            const nombreCurso = card?.querySelector("h3")?.textContent?.trim();
            if (!nombreCurso) return;

            // Deshabilitar todo lo que no sea C++
            if (!nombreCurso.includes("C++")) {
                boton.disabled = true;
                boton.classList.add("btn-disabled");
                boton.textContent = "No disponible";
                boton.style.cursor = "not-allowed";
                boton.style.opacity = "0.6";
                return; // saltar control de compra
            }

            // Verificar si C++ ya fue comprado
            const yaComprado = compras.some(c => c.descripcion === nombreCurso);

            boton.disabled = yaComprado;
            boton.classList.toggle("btn-disabled", yaComprado);
            boton.textContent = yaComprado ? "✓ Comprado" : "Pagar";
            boton.style.cursor = yaComprado ? "not-allowed" : "pointer";
            boton.style.opacity = yaComprado ? "0.6" : "1";

            if (yaComprado) boton.replaceWith(boton.cloneNode(true));
        });

        // === Habilitar botón de examen si tiene el curso de C++ ===
        const tieneCursoCpp = compras.some(c => c.descripcion === "Certificación en C++ Advanced Developer");
        if (tieneCursoCpp) {
            const btnExamen = document.querySelector(".btn-examen-cpp, .btn-examen");
            if (btnExamen) {
                btnExamen.disabled = false;
                btnExamen.classList.remove("btn-disabled");
                btnExamen.style.opacity = "1";
                btnExamen.style.cursor = "pointer";

                const nuevoBtn = btnExamen.cloneNode(true);
                btnExamen.parentNode.replaceChild(nuevoBtn, btnExamen);

                nuevoBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    window.location.href = "pagina_comenzar.html";
                });
            }
        }

    } catch (error) {
        console.error("Error al controlar botones:", error);
    }
});



