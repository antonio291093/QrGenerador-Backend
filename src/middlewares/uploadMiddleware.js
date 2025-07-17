const multer = require("multer");
const path = require("path");
const fs = require("fs");

// IMPORTANTE: Usa la misma lógica para calcular la ruta absoluta
const uploadsDir = path.join(__dirname, "uploads");

// Asegúrate que exista incluso si solo se requiere el middleware
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Tipos de archivo permitidos
const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

const storage = multer.diskStorage({
  // Usar siempre la ruta absoluta para evitar errores de contexto
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido. Solo imágenes y PDFs."), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;
