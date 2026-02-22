import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadsRoot = path.resolve(__dirname, "../uploads");

const imageMimeToExt = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const videoMimeToExt = {
  "video/mp4": ".mp4",
};

const allowedImageMimes = new Set(Object.keys(imageMimeToExt));
const allowedVideoMimes = new Set(Object.keys(videoMimeToExt));

const getDatePartition = () => {
  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  return { yyyy, mm, dd };
};

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const extFromMime = (fieldname, mimetype) => {
  if (fieldname === "images") return imageMimeToExt[mimetype] || "";
  if (fieldname === "video") return videoMimeToExt[mimetype] || "";
  return "";
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const mediaType = file.fieldname === "video" ? "videos" : "images";
    const { yyyy, mm, dd } = getDatePartition();
    const dir = path.join(uploadsRoot, mediaType, yyyy, mm, dd);
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = extFromMime(file.fieldname, file.mimetype);
    if (!ext) {
      return cb(new Error("Unsupported file type"));
    }
    const unique = `${Date.now()}-${crypto.randomUUID()}${ext}`;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "images") {
    if (allowedImageMimes.has(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("Only jpeg/jpg/png/webp images are allowed"), false);
  }

  if (file.fieldname === "video") {
    if (allowedVideoMimes.has(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("Only mp4 video is allowed"), false);
  }

  return cb(new Error("Invalid upload field"), false);
};

const uploadLocalMedia = multer({
  storage,
  fileFilter,
  limits: {
    files: 10,
    fileSize: 20 * 1024 * 1024,
  },
});

export default uploadLocalMedia;
