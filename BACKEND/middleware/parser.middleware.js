// Middleware para parsear el body de las peticiones en formato JSON
const express = require('express');

const parserMiddleware = express.json();

module.exports = parserMiddleware;