import express from "express";
import {
  createAd,
  getUserAds,
  getAllAds,
  getAdById,
  updateAd,
  deleteAd,
  markAsSold,
  incrementView,
  updateFavoriteCount,
  searchAds,
  getPromoAds,
} from "../Controllers/adController.js";

import verifyFirebaseToken from "../middlewares/verifyFirebaseToken.js";
import adPermissionMiddleware from "../middlewares/adPermissionMiddleware.js";
import multerErrorHandler from "../middlewares/multerErrorHandler.js";
import uploadLocalMedia, { uploadsRoot } from "../middlewares/uploadLocalMedia.js";
import { uploadLimiter } from "../middlewares/rateLimit.js";
import { checkDiskBeforeUpload } from "../middlewares/checkDiskBeforeUpload.js";

const router = express.Router();

router.post(
  "/create",
  verifyFirebaseToken,
  uploadLimiter,
  checkDiskBeforeUpload(500, uploadsRoot),
  uploadLocalMedia.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
  multerErrorHandler,
  createAd
);

router.get("/user/:uid", verifyFirebaseToken, getUserAds);
router.get("/search/ads", searchAds);
router.get("/promo", getPromoAds);
router.get("/", getAllAds);
router.put("/:id/view", incrementView);
router.put("/:id/favorite", verifyFirebaseToken, updateFavoriteCount);

router.put("/:id/sold", verifyFirebaseToken, adPermissionMiddleware, markAsSold);

router.put(
  "/:id",
  verifyFirebaseToken,
  adPermissionMiddleware,
  uploadLimiter,
  checkDiskBeforeUpload(500, uploadsRoot),
  uploadLocalMedia.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
  multerErrorHandler,
  updateAd
);

router.delete("/:id", verifyFirebaseToken, adPermissionMiddleware, deleteAd);
router.get("/:id", getAdById);

export default router;
