const fs = require("fs");
const path = require("path");

// Ruta absoluta SIEMPRE basada en la raíz del proyecto, no en directorios relativos.
const uploadsDir = path.join(__dirname, "uploads");

console.log("[INICIO] __dirname actual:", __dirname);
console.log("[INICIO] Intentando crear carpeta uploads en:", uploadsDir);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("[INICIO] Carpeta 'uploads' creada en:", uploadsDir);
} else {
  console.log("[INICIO] Carpeta 'uploads' ya existía en:", uploadsDir);
}

// Expón la ruta para otras partes de la app si es necesario
module.exports.uploadsDir = uploadsDir;

// Lo demás igual...
require("dotenv").config();
const app = require("./app");
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
