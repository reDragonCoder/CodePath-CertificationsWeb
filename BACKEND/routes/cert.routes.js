// Dependencias y configuración
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const certsController = require('../controllers/certs.controller');

// Ruta privada: GET /api/certs/:attemptId/pdf
router.get('/:attemptId/pdf', verifyToken, certsController.download);

module.exports = router;
