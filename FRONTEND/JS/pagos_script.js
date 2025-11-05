document.addEventListener("DOMContentLoaded", () => {
  // Obtener el curso seleccionado del localStorage
  const cursoSeleccionado = JSON.parse(localStorage.getItem("cursoSeleccionado"));

  if (cursoSeleccionado) {
    // Actualizar la información en la sección resumen
    const nombreProducto = document.getElementById("productName");
    const precioProducto = document.getElementById("price");

    if (nombreProducto) nombreProducto.textContent = cursoSeleccionado.nombre;
    if (precioProducto) precioProducto.textContent = cursoSeleccionado.precio;
  } else {
    // Si no hay curso guardado, muestra un mensaje o un valor por defecto
    document.getElementById("productName").textContent = "Producto no seleccionado";
    document.getElementById("price").textContent = "$0.00";
  }
});


// /FRONTEND/JS/pago.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del formulario
    const cardNumberInput = document.getElementById('cardNumber');
    const cvvInput = document.getElementById('cvv');
    const expMonthInput = document.getElementById('expMonth');
    const expYearInput = document.getElementById('expYear');
    const cardHolderInput = document.getElementById('cardHolder');
    const passwordInput = document.getElementById('password');
    
    // Elementos de preview de la tarjeta
    const previewCardNumber = document.getElementById('previewCardNumber');
    const previewExpiry = document.getElementById('previewExpiry');
    const previewName = document.getElementById('previewName');
    const previewCvv = document.getElementById('previewCvv');
    const cardBrandLogo = document.getElementById('cardBrandLogo');
    const cardContainer = document.querySelector('.credit-card-container');
    
    // Logos de las tarjetas
    const cardLogos = {
        'visa': 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
        'mastercard': 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
        'amex': 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg',
        'default': 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png'
    };

    // Inicializar valores por defecto
    previewName.textContent = 'Jonathan Michael';
    previewExpiry.textContent = '09/22';
    previewCvv.textContent = '***';

    // Función para detectar la marca de la tarjeta
    function detectCardBrand(cardNumber) {
        const cleaned = cardNumber.replace(/\s/g, '');
        
        if (/^4/.test(cleaned)) {
            return 'visa';
        } else if (/^5[1-5]/.test(cleaned)) {
            return 'mastercard';
        } else if (/^3[47]/.test(cleaned)) {
            return 'amex';
        } else {
            return 'default';
        }
    }

    // Función para actualizar el logo de la tarjeta
    function updateCardLogo(cardNumber) {
        if (cardNumber.replace(/\s/g, '').length >= 1) {
            const brand = detectCardBrand(cardNumber);
            const logos = document.querySelectorAll('.card-logo img, .back-logo img');
            logos.forEach(logo => {
                logo.src = cardLogos[brand];
                logo.alt = `${brand} logo`;
            });
        } else {
            const logos = document.querySelectorAll('.card-logo img, .back-logo img');
            logos.forEach(logo => {
                logo.src = cardLogos['default'];
                logo.alt = 'card logo';
            });
        }
    }

    // Formatear número de tarjeta y actualizar preview
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
        
        // Actualizar preview de la tarjeta
        if (formattedValue) {
            const cleaned = formattedValue.replace(/\s/g, '');
            if (cleaned.length <= 16) {
                let displayValue = formattedValue;
                const totalSpaces = Math.floor((16 - cleaned.length) / 4);
                const remainingDots = 16 - cleaned.length;
                
                if (cleaned.length < 16) {
                    displayValue += '•'.repeat(remainingDots + totalSpaces);
                }
                
                previewCardNumber.textContent = displayValue;
            }
        } else {
            previewCardNumber.textContent = '•••• •••• •••• ••••';
        }
        
        // Actualizar logo de la tarjeta
        updateCardLogo(formattedValue);
    });

    // Actualizar CVV en el reverso de la tarjeta
    cvvInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        
        if (e.target.value) {
            // Mostrar CVV real en el reverso
            previewCvv.textContent = e.target.value;
        } else {
            previewCvv.textContent = '•••';
        }
    });

    // Efecto visual cuando el CVV está enfocado 
    cvvInput.addEventListener('focus', function() {
        if (window.innerWidth > 768) {
            cardContainer.classList.add('flipped');
        }
    });

    cvvInput.addEventListener('blur', function() {
        cardContainer.classList.remove('flipped');
    });

    // Actualizar nombre del titular
    cardHolderInput.addEventListener('input', function(e) {
        previewName.textContent = e.target.value || 'Jonathan Michael';
    });

    // Actualizar fecha de expiración
    expMonthInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        if (e.target.value > 12) e.target.value = '12';
        updateExpiry();
    });

    expYearInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        updateExpiry();
    });

    function updateExpiry() {
        const month = expMonthInput.value.padStart(2, '0') || '09';
        const year = expYearInput.value.padStart(2, '0') || '22';
        previewExpiry.textContent = `${month}/${year}`;
    }

    // Manejar el botón de pago
    document.querySelector('.pay-btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Validaciones básicas
        if (!cardNumberInput.value || cardNumberInput.value.replace(/\s/g, '').length !== 16) {
            // alert('Por favor ingrese un número de tarjeta válido (16 dígitos)');
            Swal.fire({
                icon: "warning",
                title: "Número de tarjeta inválido",
                text: "Por favor ingrese un número de tarjeta válido (16 dígitos).",
                confirmButtonColor: "#7e4fd7",
                background: "#121212",
                color: "#e5e5e5"
            });

            cardNumberInput.focus();
            return;
        }
        
        if (!cvvInput.value || cvvInput.value.length < 3) {
            // alert('Por favor ingrese un CVV válido');
            Swal.fire({
              icon: "warning",
              title: "CVV inválido",
              text: "Por favor ingrese un CVV válido.",
              confirmButtonColor: "#7e4fd7",
              background: "#121212",
              color: "#e5e5e5"
            });

            cvvInput.focus();
            return;
        }
        
        if (!expMonthInput.value || !expYearInput.value) {
            // alert('Por favor ingrese una fecha de expiración válida');
            Swal.fire({
              icon: "warning",
              title: "Fecha de expiración inválida",
              text: "Por favor ingrese una fecha de expiración válida.",
              confirmButtonColor: "#7e4fd7",
              background: "#121212",
              color: "#e5e5e5"
            });

            expMonthInput.focus();
            return;
        }
        
        if (!cardHolderInput.value) {
            // alert('Por favor ingrese el nombre del titular de la tarjeta');
            Swal.fire({
              icon: "warning",
              title: "Nombre del titular faltante",
              text: "Por favor ingrese el nombre del titular de la tarjeta.",
              confirmButtonColor: "#7e4fd7",
              background: "#121212",
              color: "#e5e5e5"
            });

            cardHolderInput.focus();
            return;
        }
        
        if (!passwordInput.value) {
            // alert('Por favor ingrese su contraseña');
            Swal.fire({
              icon: "warning",
              title: "Contraseña requerida",
              text: "Por favor ingrese su contraseña.",
              confirmButtonColor: "#7e4fd7",
              background: "#121212",
              color: "#e5e5e5"
            });

            passwordInput.focus();
            return;
        }

        // Simular procesamiento de pago
        const payButton = this;
        const originalText = payButton.textContent;
        
        payButton.textContent = 'Procesando...';
        payButton.disabled = true;
        payButton.style.background = '#9ca3af';

        setTimeout(() => {
            Swal.fire({
                icon: "success",
                title: "¡Pago exitoso!",
                text: "¡Pago procesado exitosamente!",
                confirmButtonColor: "#7e4fd7",
                 background: "#121212",
                color: "#e5e5e5"
            }).then(() => {
                // === Guardar compra solo al confirmar ===
                const cursoSeleccionado = JSON.parse(localStorage.getItem("cursoSeleccionado"));
                // Obtener el usuario actual
                const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
                const claveCompras = usuario ? `compras_${usuario.nombre}` : "compras_inv";
                // Cargar las compras de ese usuario
                let compras = JSON.parse(localStorage.getItem(claveCompras)) || [];

                // Evitar duplicados
                if (cursoSeleccionado) {
                    const yaExiste = compras.some(c => c.descripcion === cursoSeleccionado.nombre);
                    if (!yaExiste) {
                        compras.push({
                            pago: true,
                            fecha: new Date().toLocaleDateString(),
                            descripcion: cursoSeleccionado.nombre,
                            monto: cursoSeleccionado.precio
                        });
                        localStorage.setItem(claveCompras, JSON.stringify(compras));
                    }
                }
                // Redirigir después de guardar
                window.location.href = "login.html";
            });

            // Restaurar botón visualmente
            payButton.textContent = originalText;
            payButton.disabled = false;
            payButton.style.background = '';
        }, 2000);
    });
    // Inicializar logo de tarjeta
    updateCardLogo('');
});