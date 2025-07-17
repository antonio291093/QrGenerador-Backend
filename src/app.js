const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://qr-generador-frontend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("CORS origin request:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Parseo de cookies
app.use(cookieParser());

// Parseo de JSON
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

// (Opcional) Limitador de requests para mayor seguridad
const apiLimiter = require("./middlewares/rateLimitMiddleware");
app.use("/api/", apiLimiter);

// Exporta la app para usar con index.js o server.js
module.exports = app;
