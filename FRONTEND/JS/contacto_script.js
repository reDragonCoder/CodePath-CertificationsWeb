const API = "http://localhost:3000/api/contact";

let email = document.getElementById("email");
let phone = document.getElementById("phone");
let name = document.getElementById("name");
let message = document.getElementById("message");
let submitContact = document.getElementById("submitContact");

let emailSubs = document.getElementById("newsletter-email");
let subsEmail = document.getElementById("subsNewsletter");

submitContact.addEventListener("click", newContact);
subsEmail.addEventListener("click", newEmail);

async function newContact(e) {
    e.preventDefault();
    
    try {
        const res = await fetch(`${API}/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.value,     
                phone: phone.value,      
                name: name.value,       
                message: message.value   
            })
        });

        const data = await res.json();
        console.log('Respuesta completa del servidor:', data);

        if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Mensaje enviado!',
                text: data.message,
                confirmButtonColor: '#7e4fd7;',
                background: "#121212",
                color: "#e5e5e5"
            });
            
            // Limpiar formulario
            document.getElementById("form-contacto").reset();
        } else {
            throw new Error(data.message || 'Error al enviar el mensaje');
        }

    } catch(err) {
        console.error("Error al enviar respuestas:", err);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error de conexión con el servidor',
            confirmButtonColor: '#7e4fd7;',
            background: "#121212",
            color: "#e5e5e5"
        });
    }
}

async function newEmail(e) {
    e.preventDefault();
    
    try {
        const res = await fetch(`${API}/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailSubs.value      
            })
        });

        const data = await res.json();
        console.log('Respuesta completa del servidor:', data);

        if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Mensaje enviado!',
                text: data.message,
                confirmButtonColor: '#7e4fd7;',
                background: "#121212",
                color: "#e5e5e5"
            });
            
            // Limpiar formulario
            document.getElementById("newsletter-form").reset();
        } else {
            throw new Error(data.message || 'Error al enviar el mensaje');
        }

    } catch(err) {
        console.error("Error al enviar respuestas:", err);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error de conexión con el servidor',
            confirmButtonColor: '#7e4fd7;',
            background: "#121212",
            color: "#e5e5e5"
        });
    }
}