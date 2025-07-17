const express = require("express");
const router = express.Router();
const qrController = require("../controllers/qrController");
const auth = require("../middlewares/authMiddleware");

// Todas las rutas protegidas por autenticación
router.get("/", auth, qrController.getQrs); // Obtener todos los QR del usuario
router.post("/", auth, qrController.createQr); // Crear un nuevo QR
router.delete("/:qrId", auth, qrController.deleteQr); // Eliminar un QR por ID

module.exports = router;
