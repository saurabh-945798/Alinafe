import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import multerErrorHandler from "../middlewares/multerErrorHandler.js";
import uploadLocalMedia, { uploadsRoot } from "../middlewares/uploadLocalMedia.js";
import { checkDiskBeforeUpload } from "../middlewares/checkDiskBeforeUpload.js";
import { uploadLimiter } from "../middlewares/rateLimit.js";
import { updateAd } from "../Controllers/adController.js";

import {
  getAllUsers,
  getUserDetails,
  banUser,
  unbanUser,
  getAllAds,
  getAdById,
  approveAd,
  rejectAd,
  deleteAdByAdmin,
  getAdsStats,
} from "../Controllers/adminController.js";

import { getAdminStats } from "../Controllers/adminOverview.controller.js";
import {
  addSubcategory,
  createCategory,
  deleteCategory,
  deleteSubcategory,
  getAdminCategories,
  updateCategory,
  updateCategoryStatus,
  updateSubcategory,
  updateSubcategoryStatus,
} from "../Controllers/categoryAdminController.js";

const router = express.Router();

router.get("/overview", authMiddleware, getAdminStats);

router.get("/users", authMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, getUserDetails);
router.put("/users/:id/ban", authMiddleware, banUser);
router.put("/users/:id/unban", authMiddleware, unbanUser);

router.get("/ads", authMiddleware, getAllAds);
router.get("/ads/stats/summary", authMiddleware, getAdsStats);
router.get("/ads/:id", authMiddleware, getAdById);
router.put(
  "/ads/:id",
  authMiddleware,
  uploadLimiter,
  checkDiskBeforeUpload(500, uploadsRoot),
  uploadLocalMedia.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
  multerErrorHandler,
  updateAd
);
router.patch("/ads/:id/approve", authMiddleware, approveAd);
router.patch("/ads/:id/reject", authMiddleware, rejectAd);
router.delete("/ads/:id", authMiddleware, deleteAdByAdmin);

router.get("/categories", authMiddleware, getAdminCategories);
router.post("/categories", authMiddleware, createCategory);
router.put("/categories/:id", authMiddleware, updateCategory);
router.patch("/categories/:id/status", authMiddleware, updateCategoryStatus);
router.delete("/categories/:id", authMiddleware, deleteCategory);
router.post("/categories/:id/subcategories", authMiddleware, addSubcategory);
router.put(
  "/categories/:id/subcategories/:subcategoryId",
  authMiddleware,
  updateSubcategory
);
router.patch(
  "/categories/:id/subcategories/:subcategoryId/status",
  authMiddleware,
  updateSubcategoryStatus
);
router.delete(
  "/categories/:id/subcategories/:subcategoryId",
  authMiddleware,
  deleteSubcategory
);

export default router;
