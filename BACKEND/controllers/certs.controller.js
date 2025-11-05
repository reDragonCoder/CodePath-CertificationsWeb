// Controlador generador de certificado PDF
const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs').promises;
const path = require('path');
const { attempts } = require('./questions.controller');

exports.download = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const userId = req.userId;  // Del middleware authRequired

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date();

    const day = date.getDate();

    const month = months[date.getMonth()];

    const year = date.getFullYear();
    
    const fullDate = month + " " + " "+ day + " "+ year;
    
    // Verificar que el attempt pertenece al usuario
    const attempt = await verifyAttempt(attemptId, userId);
    if (!attempt) {
      return res.status(404).json({ message: 'Intento no encontrado' });
    }
    
    // Cargar template PDF
    const templatePath = path.join(__dirname, '../data/templates/Certificate.pdf');
    const exBytes = await fs.readFile(templatePath);
    
    // Generar PDF
    const pdfDoc = await PDFDocument.load(exBytes);
    pdfDoc.registerFontkit(fontkit);
    
    const pages = pdfDoc.getPages();
    const firstP = pages[0];
    const pageWidth = firstP.getWidth();
    const pageHeight = firstP.getHeight();
    
    // Ajustar tamaño de fuente según longitud del nombre
    const userName = attempt.userName;
    let fontSize = 50;
    
    // Reducir tamaño si el nombre es muy largo
    if (userName.length > 25) {
      fontSize = 35;
    } else if (userName.length > 20) {
      fontSize = 40;
    } else if (userName.length > 15) {
      fontSize = 45;
    }
    
   // Calcular ancho del texto para centrarlo
    const textWidth = fontSize * userName.length * 0.55;
    const x = (pageWidth - textWidth) / 2 + 40; 
    const y = pageHeight - 320; 
    
    // Dibujar nombre centrado
    firstP.drawText(userName, {
      x: x,
      y: y,
      size: fontSize,
      color: rgb(0.494, 0.310, 0.843)
    });

    firstP.drawText(fullDate,{
        x:340,        // X coordinate position
        y:340,        // Y coordinate position
        size:20,      // Font size
        color: rgb(0.494, 0.310, 0.843)  // PURPLE
    });

    const pdfBytes = await pdfDoc.save();
    
    console.log(`Certificado generado exitosamente para el intento: ${attemptId} - Nombre: ${attempt.userName}`);
    
    // Enviar al frontend como application/pdf
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate-${attemptId}.pdf`);
    res.send(Buffer.from(pdfBytes));
    
  } catch (error) {
    console.error('Error al generar el certificado:', error);
    res.status(500).json({ message: 'Error al generar el certificado' });
  }
};

// Busca el attempt y obtiene el nombre del usuario
async function verifyAttempt(attemptId, userId) {
  const attempt = attempts.get(attemptId);
  
  // Verificar que existe y pertenece al usuario
  if (!attempt || attempt.userId !== userId) {
    return null;
  }

  // Validar que el usuario aprobó el quiz (70% o más)
  if (!attempt.passed) {
    return null;
  }
  
  return {
    id: attemptId,
    userId: userId,
    userName: attempt.fullName || userId
  };
}