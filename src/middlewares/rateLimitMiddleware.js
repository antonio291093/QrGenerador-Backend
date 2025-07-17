const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 peticiones por IP
  message: "Demasiadas peticiones, intenta más tarde.",
});

module.exports = apiLimiter;
