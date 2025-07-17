const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const uploadController = require("../controllers/uploadController");
const auth = require("../middlewares/authMiddleware"); // Protege la ruta

router.post("/logo", auth, upload.single("image"), uploadController.uploadLogo);

module.exports = router;
