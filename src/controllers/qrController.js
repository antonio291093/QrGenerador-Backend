const User = require("../models/User");
const { generateQrWithLogo } = require("../services/qrService");
const cloudinary = require("../config/cloudinary"); // Asegúrate de tener

exports.getQrs = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user.qrs);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los QR" });
  }
};

exports.createQr = async (req, res) => {
  console.log("Datos recibidos:", req.body);
  const { resourceUrl, logoUrl } = req.body;

  try {
    // 1. Genera el QR con logo y súbelo a Cloudinary
    const qrCloudinaryUrl = await generateQrWithLogo({ resourceUrl, logoUrl });

    // 2. Guarda el QR en el usuario autenticado
    const user = await User.findById(req.userId);
    const newQr = {
      url: qrCloudinaryUrl,
      resourceUrl,
      logoUrl,
    };
    user.qrs.push(newQr);
    await user.save();

    res.status(201).json(user.qrs[user.qrs.length - 1]);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al crear el QR", error: err.message });
  }
};

function getCloudinaryPublicId(url) {
  if (!url) return null;
  // Adaptado para evitar extraer mal el public_id si la URL no es válida
  const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.\/]+(?:\/[^\.\/]+)*)\./);
  return matches ? matches[1] : null;
}

function isCloudinaryUrl(url) {
  return typeof url === "string" && url.includes("res.cloudinary.com");
}

exports.deleteQr = async (req, res) => {
  const { qrId } = req.params;
  console.log(`[deleteQr] Iniciando eliminación de QR con id: ${qrId}`);

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      console.warn(`[deleteQr] Usuario no encontrado: ${req.userId}`);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    console.log(`[deleteQr] Usuario encontrado: ${user.email || user._id}`);

    // Primero localiza el QR a eliminar
    const qrToDelete = user.qrs.id(qrId);

    if (!qrToDelete) {
      console.warn(`[deleteQr] QR no encontrado: ${qrId}`);
      return res.status(404).json({ message: "QR no encontrado" });
    }
    console.log(`[deleteQr] QR encontrado. URL: ${qrToDelete.url}`);

    // SOLO intenta eliminar si apunta a Cloudinary
    if (qrToDelete.logoUrl && isCloudinaryUrl(qrToDelete.logoUrl)) {
      const logoPublicId = getCloudinaryPublicId(qrToDelete.logoUrl);
      if (logoPublicId) {
        try {
          const logoResult = await cloudinary.uploader.destroy(logoPublicId);
          console.log(`[deleteQr] Logo eliminado de Cloudinary:`, logoResult);
        } catch (logoErr) {
          console.error(
            `[deleteQr] Error al eliminar logo de Cloudinary:`,
            logoErr
          );
        }
      }
    }

    if (qrToDelete.url && isCloudinaryUrl(qrToDelete.url)) {
      const publicId = getCloudinaryPublicId(qrToDelete.url);
      if (publicId) {
        try {
          const cloudinaryResult = await cloudinary.uploader.destroy(publicId);
          console.log(
            `[deleteQr] Imagen eliminada de Cloudinary:`,
            cloudinaryResult
          );
        } catch (cloudErr) {
          console.error(
            `[deleteQr] Error al eliminar imagen de Cloudinary:`,
            cloudErr
          );
        }
      } else {
        console.warn(
          `[deleteQr] No se encontró publicId para eliminar en Cloudinary.`
        );
      }
    }

    user.qrs.pull({ _id: qrId });
    await user.save();
    res.json({ message: "QR e imagen eliminados correctamente" });
  } catch (err) {
    console.error(`[deleteQr] Error general:`, err);
    res
      .status(500)
      .json({ message: "Error al eliminar el QR", error: err.message });
  }
};
