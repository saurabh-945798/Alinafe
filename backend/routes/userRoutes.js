import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import verifyFirebaseToken from "../middlewares/verifyFirebaseToken.js";
import multerErrorHandler from "../middlewares/multerErrorHandler.js";

import {
  registerUser,
  getUserProfile,
  updateUserProfile,
  updateUserPhoto,
  logoutUser,
  sendEmailOtp,
  verifyEmailOtp,
  setUserPassword,
  updateUserPassword,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPasswordWithOtp,
  resolveLoginIdentifier,
} from "../Controllers/userController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.resolve(__dirname, "../uploads");

const imageMimeToExt = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const getDatePartition = () => {
  const now = new Date();
  return {
    yyyy: String(now.getUTCFullYear()),
    mm: String(now.getUTCMonth() + 1).padStart(2, "0"),
    dd: String(now.getUTCDate()).padStart(2, "0"),
  };
};

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { yyyy, mm, dd } = getDatePartition();
    const dir = path.join(uploadsRoot, "images", yyyy, mm, dd);
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = imageMimeToExt[file.mimetype];
    if (!ext) {
      return cb(new Error("Only JPG, JPEG, PNG, WEBP images are allowed"));
    }
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  },
});

const allowedProfilePhotoMimes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const profilePhotoFileFilter = (req, file, cb) => {
  if (allowedProfilePhotoMimes.has(file?.mimetype)) {
    return cb(null, true);
  }
  return cb(new Error("Only JPG, JPEG, PNG, WEBP images are allowed"), false);
};

const upload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: profilePhotoFileFilter,
});

router.post("/register", verifyFirebaseToken, registerUser);
router.post("/logout", verifyFirebaseToken, logoutUser);
router.post("/login/resolve", resolveLoginIdentifier);

router.post("/email/send-otp", verifyFirebaseToken, sendEmailOtp);
router.post("/email/verify-otp", verifyFirebaseToken, verifyEmailOtp);

router.post("/password/set", verifyFirebaseToken, setUserPassword);
router.post("/password/update", verifyFirebaseToken, updateUserPassword);
router.post("/password/send-otp", verifyFirebaseToken, sendPasswordResetOtp);
router.post("/password/verify-otp", verifyFirebaseToken, verifyPasswordResetOtp);
router.post("/password/reset", verifyFirebaseToken, resetPasswordWithOtp);

router.get("/me", verifyFirebaseToken, getUserProfile);
router.put("/me", verifyFirebaseToken, updateUserProfile);
router.put(
  "/me/photo",
  verifyFirebaseToken,
  upload.single("photo"),
  multerErrorHandler,
  updateUserPhoto
);

export default router;
