// Dependencias y configuración
const express = require('express');
const router = express.Router();
const {addContact, addEmail} = require('../controllers/contact.controller');

router.post('/send', addContact);

router.post('/email', addEmail);

module.exports = router;