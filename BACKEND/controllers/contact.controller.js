const CONTACT = require("../data/contact");
const EMAILS = require("../data/emails");


// Recibe y guarda la información en el formulario de contacto
const addContact = (req, res) => { 
    const { email, phone, name, message } = req.body;
    let id = 0;

    // Validación básica
    if (!email || !name || !message) {
        return res.status(400).json({
            message: "Faltan campos obligatorios"
        });
    }

    if (CONTACT.length === 0) {
        id = 1;
    } else {
        id = CONTACT[CONTACT.length - 1].id + 1; 
    }
    const newContact = {
        id,
        name,
        email,
        phone,
        message
    };

    CONTACT.push(newContact);
    console.log("New Message received: ", CONTACT);

    let mensaje = "Nos pondremos en contacto pronto!! Estate al pendiente de tus correos.";

    return res.status(200).json({
        message: mensaje
    });
};

const addEmail = (req,res) =>{
    const email = req.body.email;
    let id = 0;

     // Validación básica
    if (!email || email.trim() === '') {
        return res.status(400).json({
            message: "Falta el campo obligatorio"
        });
    }

    if (EMAILS.length === 0) {
        id = 1;
    } else {
        id = EMAILS[EMAILS.length - 1].id + 1; 
    }

    const newEmail = {
        id,
        email
    };

    EMAILS.push(newEmail);
    console.log("New Subscriber: \n", EMAILS);

    let mensaje = "Bienvenido!! Checa tu correo";

    return res.status(200).json({
        message: mensaje
    });
};

module.exports = {addContact, addEmail};