const multer = require("multer");
const path = require("path");

// Tipos de archivo permitidos
const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 5 MB
  fileFilter,
});

module.exports = upload;
