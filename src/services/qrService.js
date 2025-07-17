const QRCode = require("qrcode");
const axios = require("axios");
const cloudinary = require("../config/cloudinary");
const Jimp = require("jimp");

// Descarga una imagen desde URL y la convierte en buffer
async function downloadImage(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data, "binary");
}

function getBufferAsync(image, mime) {
  return new Promise((resolve, reject) => {
    image.getBuffer(mime, (err, buffer) => {
      if (err) {
        console.error("Error en getBuffer:", err);
        return reject(err);
      }
      console.log("Buffer generado correctamente");
      resolve(buffer);
    });
  });
}

// Genera el QR con logo y lo sube a Cloudinary
async function generateQrWithLogo({ resourceUrl, logoUrl }) {
  // 1. Genera el QR base como buffer
  const qrBuffer = await QRCode.toBuffer(resourceUrl, {
    errorCorrectionLevel: "H",
    width: 500,
    margin: 2,
    color: { dark: "#000000", light: "#FFFFFF" },
  });

  // 2. Carga el QR en Jimp
  console.log("Generando QR para:", resourceUrl);
  const qrImage = await Jimp.read(qrBuffer);

  // 3. Si hay logo, lo descarga y lo incrusta
  console.log("QR cargado en Jimp");
  if (logoUrl) {
    const logoBuffer = await downloadImage(logoUrl);
    let logo = await Jimp.read(logoBuffer);
    console.log("Logo descargado y cargado en Jimp");
    // Redimensiona el logo (máx 25% del ancho del QR)

    console.log(
      `Dimensiones originales del logo: ${logo.bitmap.width}x${logo.bitmap.height}`
    );
    const qrWidth = qrImage.bitmap.width;
    const logoWidth = qrWidth / 4;
    console.log(`qrWidth: ${qrWidth}, logoWidth: ${logoWidth}`);
    try {
      // Redimensiona el logo (máx 25% del ancho del QR)
      const qrWidth = qrImage.bitmap.width;
      const logoWidth = qrWidth / 4;
      logo.resize(logoWidth, Jimp.AUTO); // <-- Sintaxis correcta
      console.log(
        `Logo redimensionado a: ${logo.bitmap.width}x${logo.bitmap.height}`
      );
    } catch (err) {
      console.error("Error al redimensionar el logo:", err);
      throw err; // O maneja el error según tu flujo
    }

    // === Añadir fondo blanco ===
    // Crea un nuevo canvas blanco del mismo tamaño que el logo redimensionado
    const logoBg = new Jimp(logo.bitmap.width, logo.bitmap.height, 0xffffffff);
    // Pega el logo sobre el fondo blanco
    logoBg.composite(logo, 0, 0);

    // Calcula posición centrada
    const x = (qrWidth - logoWidth) / 2;
    const y = x;
    qrImage.composite(logoBg, x, y);
    console.log("Logo incrustado en el QR");
  }

  // Uso:
  console.log("Uso getBufferAsync");
  const finalBuffer = await getBufferAsync(qrImage, Jimp.MIME_PNG);

  console.log("Se uso");
  // 5. Sube el QR final a Cloudinary
  console.log("Subiendo QR final a Cloudinary...");

  // Cloudinary uploader.upload_stream requiere un stream, así que:
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "qrcodes",
        resource_type: "image",
        format: "png",
      },
      (error, uploadResult) => {
        if (error) return reject(error);
        resolve(uploadResult.secure_url);
      }
    );
    // Envía el buffer al stream
    stream.end(finalBuffer);
  });
}

module.exports = { generateQrWithLogo };
