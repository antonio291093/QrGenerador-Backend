const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("[LOGIN] Intento de login para:", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.warn("[LOGIN] Usuario no encontrado:", email);
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.warn("[LOGIN] Contraseña incorrecta para:", email);
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    console.log("[LOGIN] Login exitoso:", email);
    res.json({
      user: {
        id: user._id,
        email: user.email,
        mustChangePassword: user.mustChangePassword,
      },
    });
  } catch (err) {
    console.error("[LOGIN] Error inesperado:", err);
    res.status(500).json({ message: "Error de servidor" });
  }
};

exports.changePassword = async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({
      message: "La nueva contraseña debe tener al menos 8 caracteres.",
    });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Cambia la contraseña y marca el flag como false
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.mustChangePassword = false;
    await user.save();

    res.json({ message: "Contraseña cambiada correctamente." });
  } catch (err) {
    res.status(500).json({ message: "Error al cambiar la contraseña." });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ message: "Sesión cerrada correctamente." });
};
