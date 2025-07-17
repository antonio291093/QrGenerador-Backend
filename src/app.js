const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

// Configura CORS para aceptar cookies y peticiones desde el frontend
app.use(
  cors({
    origin: "http://localhost:3000", // Cambia esto por la URL de tu frontend en producción
    credentials: true,
  })
);

// Middleware para parsear cookies
app.use(cookieParser());

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error de conexión:", err));

// Rutas de tu API
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const qrRoutes = require("./routes/qrRoutes");
app.use("/api/qrs", qrRoutes);

const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);

const apiLimiter = require("./middlewares/rateLimitMiddleware");
app.use("/api/", apiLimiter);

module.exports = app;
