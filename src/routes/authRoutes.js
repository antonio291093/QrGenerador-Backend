const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/login", authController.login);
router.post("/change-password", authMiddleware, authController.changePassword);
router.post("/logout", authController.logout);

module.exports = router;
