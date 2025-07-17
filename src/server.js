const fs = require("fs");
const path = require("path");

// 1. Calcula la ruta absoluta para la carpeta 'uploads'
const uploadsDir = path.join(__dirname, "uploads");

// 2. Imprime logs para saber exactamente dónde estás parado
console.log("[INICIO] __dirname actual:", __dirname);
console.log("[INICIO] Intentando crear carpeta uploads en:", uploadsDir);

// 3. Crea la carpeta si NO existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("[INICIO] Carpeta 'uploads' creada en:", uploadsDir);
} else {
  console.log("[INICIO] Carpeta 'uploads' ya existía en:", uploadsDir);
}

// 4. Configura variables de entorno y carga la app principal
require("dotenv").config();
const app = require("./app");

// 5. Levanta el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
