const fs = require("fs");
const { uploadImage } = require("../services/cloudinaryService");

exports.uploadLogo = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      console.error("No se recibió archivo");
      return res.status(400).json({ message: "No se envió archivo" });
    }

    console.log("Archivo recibido:", file);

    const result = await uploadImage(file.path, "logos");
    fs.unlink(file.path, (err) => {
      if (err) console.error("Error al borrar archivo temporal:", err);
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error("Error al subir imagen:", err);
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr)
          console.error(
            "Error al borrar archivo temporal tras fallo:",
            unlinkErr
          );
      });
    }
    res
      .status(500)
      .json({ message: "Error al subir imagen", error: err.message });
  }
};
