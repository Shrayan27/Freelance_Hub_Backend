import cloudinary from "cloudinary";
import createError from "../utils/createError.js";

// Only configure cloudinary if all required environment variables are set
let cloudinaryConfigured = false;
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== "your_cloudinary_cloud_name" &&
  process.env.CLOUDINARY_API_KEY !== "your_cloudinary_api_key" &&
  process.env.CLOUDINARY_API_SECRET !== "your_cloudinary_api_secret"
) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  cloudinaryConfigured = true;
}

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createError(400, "No file uploaded"));
    }

    // Check if Cloudinary is configured
    if (!cloudinaryConfigured) {
      // For development, return a local file path as fallback
      const localUrl = `https://freelance-hub-backend-deployment.onrender.com/uploads/${req.file.filename}`;
      return res.status(200).send({ url: localUrl });
    }

    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "fiverr-clone",
    });

    res.status(200).send({ url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    next(err);
  }
};
