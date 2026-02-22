import mongoose from "mongoose";
import fs from "fs/promises";
import Ad from "../models/Ad.js";
import User from "../models/User.js";
import { EmailService } from "../Services/email.service.js";
import { optimizeImageToJpeg } from "../utils/optimizeImage.js";
import {
  buildUploadUrlFromAbsolute,
  getApiBaseUrl,
  isCloudinaryUrl,
  isLocalUploadUrl,
  localAbsolutePathFromUrl,
} from "../utils/uploadPath.js";
import { uploadsRoot } from "../middlewares/uploadLocalMedia.js";
import { validateMediaUrl } from "../utils/validateMediaUrl.js";

/* ================================
   🧠 CLOUDINARY CONFIG
================================ */
const toBoolean = (value) => value === true || value === "true";
const DEBUG_UPLOADS = String(process.env.DEBUG_UPLOADS || "").toLowerCase() === "true";

const parseArrayInput = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && !value.trim().startsWith("[")) {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const debugUploadLog = (payload) => {
  if (!DEBUG_UPLOADS) return;
  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      level: "debug",
      msg: "upload_debug",
      ...payload,
    })
  );
};

const cleanupAbsoluteFiles = async (absolutePaths = []) => {
  await Promise.all(
    absolutePaths.map(async (p) => {
      if (!p) return;
      try {
        await fs.unlink(p);
      } catch {
        // best effort
      }
    })
  );
};

const ensureValidMediaUrlsOrThrow = (urls = []) => {
  for (const mediaUrl of urls) {
    const check = validateMediaUrl(mediaUrl);
    if (!check.valid) {
      throw new Error(check.message);
    }
  }
};

const normalizeLocalImageUploads = async (files = []) => {
  const items = [];
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    throw new Error("API_BASE_URL not configured");
  }

  for (const file of files) {
    let originalBytes = 0;
    try {
      const beforeStat = await fs.stat(file.path);
      originalBytes = Number(beforeStat.size || 0);
    } catch {}

    const optimizedAbsolutePath = await optimizeImageToJpeg(file.path);
    const normalizedOptimizedPath = String(optimizedAbsolutePath || "").trim();
    if (!normalizedOptimizedPath.toLowerCase().endsWith(".jpg")) {
      throw new Error("Optimized image must end with .jpg");
    }

    try {
      await fs.access(normalizedOptimizedPath);
    } catch {
      throw new Error("Optimized image not found on disk");
    }

    let optimizedBytes = 0;
    try {
      const afterStat = await fs.stat(normalizedOptimizedPath);
      optimizedBytes = Number(afterStat.size || 0);
    } catch {}

    const ratio =
      originalBytes > 0
        ? Number((optimizedBytes / originalBytes).toFixed(3))
        : null;

    const finalUrl = buildUploadUrlFromAbsolute(
      normalizedOptimizedPath,
      uploadsRoot,
      apiBaseUrl
    );

    debugUploadLog({
      kind: "image",
      rawPath: String(file.path || ""),
      uploadsRoot: uploadsRoot,
      optimizedAbs: normalizedOptimizedPath,
      finalUrl,
      apiBaseUrl,
      originalBytes,
      optimizedBytes,
      compressionRatio: ratio,
    });

    items.push({
      url: finalUrl,
      absPath: normalizedOptimizedPath,
    });
  }
  return items;
};

const normalizeLocalVideoUpload = (file) => {
  if (!file?.path) return null;
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("API_BASE_URL not configured");
  }

  const normalizedPath = String(file.path || "").trim();
  if (!normalizedPath.toLowerCase().endsWith(".mp4")) {
    throw new Error("Uploaded video must end with .mp4");
  }

  const finalUrl = buildUploadUrlFromAbsolute(normalizedPath, uploadsRoot, apiBaseUrl);

  debugUploadLog({
    kind: "video",
    rawPath: String(file.path || ""),
    uploadsRoot: uploadsRoot,
    optimizedAbs: normalizedPath,
    finalUrl,
    apiBaseUrl,
    fileSizeBytes: Number(file.size || 0),
    mimetype: file.mimetype || "",
  });

  return { url: finalUrl, absPath: normalizedPath };
};

const deleteLocalFileByUrl = async (mediaUrl) => {
  if (!isLocalUploadUrl(mediaUrl) || isCloudinaryUrl(mediaUrl)) return;
  try {
    const filePath = localAbsolutePathFromUrl(mediaUrl, uploadsRoot);
    await fs.unlink(filePath);
  } catch {
    // ignore missing file errors
  }
};

/* ================================
   🟢 CREATE AD (Pending by default)
================================ */
export const createAd = async (req, res) => {
  try {
    const body = { ...req.body };
    const firebaseUser = req.firebaseUser || {};

    if (!firebaseUser.uid || !body.title || !body.description || !body.category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    Object.keys(body).forEach((key) => {
      if (body[key] === "" || body[key] === null || body[key] === undefined) {
        delete body[key];
      }
    });

    body.ownerUid = firebaseUser.uid;
    const ownerUser = await User.findOne({ uid: firebaseUser.uid }).select("name email phone");
    body.ownerEmail = ownerUser?.email || firebaseUser.email || "";
    body.ownerName =
      ownerUser?.name ||
      firebaseUser.name ||
      body.ownerEmail?.split("@")[0] ||
      "User";
    body.ownerPhone = ownerUser?.phone || "";

    body.negotiable = toBoolean(body.negotiable);
    body.deliveryAvailable = toBoolean(body.deliveryAvailable);

    const imageUploadItems = await normalizeLocalImageUploads(req.files?.images || []);
    const imagePaths = imageUploadItems.map((i) => i.url);
    const createdAbsPaths = imageUploadItems.map((i) => i.absPath);

    const autoTags = new Set();
    if (body.title) {
      body.title
        .toLowerCase()
        .split(" ")
        .forEach((word) => {
          if (word.length > 2) autoTags.add(word);
        });
    }

    if (body.category) autoTags.add(body.category.toLowerCase());
    if (body.subcategory) autoTags.add(body.subcategory.toLowerCase());

    if (Array.isArray(body.tags)) {
      body.tags.forEach((t) => autoTags.add(String(t).toLowerCase()));
    }

    body.tags = Array.from(autoTags);

    const uploadedVideo = req.files?.video?.[0] || null;
    const videoUploadItem = normalizeLocalVideoUpload(uploadedVideo);
    const localVideoUrl = videoUploadItem?.url || "";
    if (videoUploadItem?.absPath) createdAbsPaths.push(videoUploadItem.absPath);

    try {
      ensureValidMediaUrlsOrThrow(imagePaths);
      if (localVideoUrl) ensureValidMediaUrlsOrThrow([localVideoUrl]);
    } catch (validationError) {
      await cleanupAbsoluteFiles(createdAbsPaths);
      return res.status(400).json({
        success: false,
        message: validationError.message || "Invalid media URL generated",
      });
    }

    const videoData = localVideoUrl
      ? {
          url: localVideoUrl,
          thumbnail: "",
          duration: 0,
          size: 0,
          format: "",
          publicId: "",
        }
      : {};

    const newAd = await Ad.create({
      ...body,
      images: imagePaths,
      video: videoData,
      status: "Pending",
      reportReason: "",
    });

    if (body.ownerEmail) {
      EmailService.sendTemplate({
        to: body.ownerEmail,
        template: "AD_POSTED",
        data: {
          name: body.ownerName || "there",
          title: body.title || "your ad",
        },
      }).catch((err) => {
        console.error("Ad posted email failed:", err?.message || err);
      });
    }

    const updateFields = {};
    if (body.city && body.city.trim() !== "") updateFields.city = body.city.trim();
    if (body.location && body.location.trim() !== "") updateFields.location = body.location.trim();

    if (Object.keys(updateFields).length > 0) {
      await User.updateOne({ uid: firebaseUser.uid }, { $set: updateFields });
    }

    return res.status(201).json({
      success: true,
      message: "Ad submitted successfully and is pending admin approval.",
      ad: newAd,
    });
  } catch (error) {
    console.error("CREATE AD ERROR:", error);
    if (
      String(error?.message || "").toLowerCase().includes("api_base_url not configured")
    ) {
      return res.status(500).json({
        success: false,
        message: "API_BASE_URL not configured",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error while creating ad",
    });
  }
};


/* ================================
   👤 GET USER ADS
================================ */
export const getUserAds = async (req, res) => {
  try {
    const { uid } = req.params;
    const requesterUid = req.user?.uid;
    const requesterRole = req.user?.role;

    if (!requesterUid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (requesterUid !== uid && requesterRole !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const ads = await Ad.find({ ownerUid: uid }).sort({ createdAt: -1 });
    res.status(200).json(ads);
  } catch (error) {
    console.error("Error fetching user ads:", error);
    res.status(500).json({ message: "Server error" });
  }
};




/* ================================
   ⭐ GET PROMO ADS (HOMEPAGE)
   - Approved / Active only
   - Limited items
   - Lightweight fields
================================ */
export const getPromoAds = async (req, res) => {
  try {
    const { category, limit = 3 } = req.query;

    const filters = {
      status: { $in: ["Approved", "Active"] },
    };

    if (category) {
      filters.category = category;
    }

    const ads = await Ad.find(filters)
      .sort({ createdAt: -1 }) // latest first
      .limit(Number(limit))
      .select(
        "_id title price images condition city location ownerName"
      );


    res.status(200).json({
      success: true,
      ads,
    });
  } catch (error) {
    console.error("PROMO ADS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch promo ads",
    });
  }
};



/* ================================
   🌍 GET ALL ADS
================================ */
export const getAllAds = async (req, res) => {
  try {
    let {
      q = "",
      location = "",
      category,
      condition,
      page = 1,
      limit = 20,
    } = req.query;

    q = q.trim();
    location = location.trim();

    const filters = {
      status: { $in: ["Approved", "Active"] },
    };

    if (location) {
      filters.city = { $regex: `^${location}`, $options: "i" };
    }

    if (category) {
      filters.category = category;
    }

    if (condition && ["New", "Used"].includes(condition)) {
      filters.condition = condition;
    }

    if (q) {
      filters.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { subcategory: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [ads, total] = await Promise.all([
      Ad.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "title description price images category subcategory " +
            "city location " +
            "ownerName status views favouritesCount negotiable featured createdAt " +
            "condition brand model storage year mileage warranty " +
            " partCategory originalType workingStatus accessoryType vehicleType " +
            "bedrooms bathrooms area furnishing parking washroom roomType plotArea plotType facing  " +
            "salary experience company quantity serviceType availability serviceArea sportType weight brand " +
            "size color type " +
            "age breed gender " +
            "fileType accessType"
        ),
      Ad.countDocuments(filters),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      ads,
    });
  } catch (err) {
    console.error("ADS FETCH ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to fetch ads" });
  }
};


/* ================================
   ✏️ UPDATE AD
================================ */
export const updateAd = async (req, res) => {
  try {
    const updates = { ...req.body };
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    if (Object.prototype.hasOwnProperty.call(updates, "negotiable")) {
      updates.negotiable = toBoolean(updates.negotiable);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "deliveryAvailable")) {
      updates.deliveryAvailable = toBoolean(updates.deliveryAvailable);
    }

    const updatedTags = new Set();
    if (updates.title) {
      updates.title
        .toLowerCase()
        .split(" ")
        .forEach((word) => {
          if (word.length > 2) updatedTags.add(word);
        });
    }

    if (updates.category) updatedTags.add(updates.category.toLowerCase());
    if (updates.subcategory) updatedTags.add(updates.subcategory.toLowerCase());

    if (Array.isArray(updates.tags)) {
      updates.tags.forEach((t) => updatedTags.add(String(t).toLowerCase()));
    }

    if (updatedTags.size > 0) {
      updates.tags = Array.from(updatedTags);
    }

    const removeImageUrls = parseArrayInput(req.body.removeImageUrls);
    const removeSet = new Set(removeImageUrls);
    const retainedImages = (ad.images || []).filter((url) => !removeSet.has(url));

    for (const removeUrl of removeImageUrls) {
      await deleteLocalFileByUrl(removeUrl);
    }

    const appendedImageItems = await normalizeLocalImageUploads(req.files?.images || []);
    const appendedImageUrls = appendedImageItems.map((i) => i.url);
    const createdAbsPaths = appendedImageItems.map((i) => i.absPath);
    updates.images = [...retainedImages, ...appendedImageUrls];

    const removeCurrentVideo = toBoolean(req.body.removeCurrentVideo);
    if (removeCurrentVideo && ad.video?.url) {
      await deleteLocalFileByUrl(ad.video.url);
      updates.video = {
        url: "",
        thumbnail: "",
        duration: 0,
        size: 0,
        format: "",
        publicId: "",
      };
    }

    if (req.files?.video?.[0]) {
      if (ad.video?.url) {
        await deleteLocalFileByUrl(ad.video.url);
      }
      const videoUploadItem = normalizeLocalVideoUpload(req.files.video[0]);
      const newVideoUrl = videoUploadItem?.url || "";
      if (videoUploadItem?.absPath) createdAbsPaths.push(videoUploadItem.absPath);
      updates.video = {
        url: newVideoUrl || "",
        thumbnail: "",
        duration: 0,
        size: 0,
        format: "",
        publicId: "",
      };
    }

    delete updates.removeImageUrls;
    delete updates.removeCurrentVideo;

    try {
      ensureValidMediaUrlsOrThrow(updates.images || []);
      if (updates.video?.url) ensureValidMediaUrlsOrThrow([updates.video.url]);
    } catch (validationError) {
      await cleanupAbsoluteFiles(createdAbsPaths);
      return res.status(400).json({
        success: false,
        message: validationError.message || "Invalid media URL generated",
      });
    }

    const updatedAd = await Ad.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    res.status(200).json({
      message: "Ad updated successfully",
      ad: updatedAd,
    });
  } catch (error) {
    console.error("Error updating ad:", error);
    if (
      String(error?.message || "").toLowerCase().includes("api_base_url not configured")
    ) {
      return res.status(500).json({
        success: false,
        message: "API_BASE_URL not configured",
      });
    }
    res.status(500).json({ message: "Server error" });
  }
};
/* ================================
   ❌ DELETE AD
================================ */
export const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    for (const imageUrl of ad.images || []) {
      await deleteLocalFileByUrl(imageUrl);
    }

    if (ad.video?.url) {
      await deleteLocalFileByUrl(ad.video.url);
    }

    await ad.deleteOne();
    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error) {
    console.error("Error deleting ad:", error);
    res.status(500).json({ message: "Server error" });
  }
};
/* ================================
   💰 MARK AS SOLD
================================ */
export const markAsSold = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    ad.status = "Sold";
    await ad.save();

    res.status(200).json({ message: "Ad marked as sold", ad });
  } catch (error) {
    console.error("Error marking ad as sold:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   👁️ INCREMENT AD VIEW COUNT
================================ */
export const incrementView = async (req, res) => {
  try {
    const { userId, guestId } = req.body;
    const uniqueViewer = userId || guestId;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Ad ID" });
    }

    const ad = await Ad.findById(id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    if (userId && ad.ownerUid === userId) {
      return res.json({ message: "Owner viewed — no increment" });
    }

    if (uniqueViewer && ad.viewedBy.includes(uniqueViewer)) {
      return res.json({ message: "Already viewed", views: ad.views });
    }

    ad.views = (ad.views || 0) + 1;
    if (uniqueViewer) ad.viewedBy.push(uniqueViewer);

    await ad.save();
    res.json({ message: "View incremented", views: ad.views });
  } catch (error) {
    console.error("❌ Error updating view count:", error);
    res.status(500).json({
      message: "Server error while updating view count",
    });
  }
};

/* ================================
   ⚙️ CHANGE AD STATUS
================================ */
export const changeAdStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Active", "Hidden", "Expired", "Sold"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    ad.status = status;
    await ad.save();

    res.status(200).json({ message: `Ad status changed to ${status}`, ad });
  } catch (error) {
    console.error("Error changing ad status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   🟣 GET SINGLE AD BY ID (WITH SELLER)
================================ */
export const getAdById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    const seller = await User.findOne({ uid: ad.ownerUid }).select(
      "name email phone"
    );

    res.status(200).json({
      ...ad.toObject(),
      seller: seller || null,
    });
  } catch (error) {
    console.error("Error fetching ad:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   ❤️ FAVORITES COUNT
================================ */
export const updateFavoriteCount = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const ad = await Ad.findById(id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    if (action === "add") ad.favouritesCount = (ad.favouritesCount || 0) + 1;
    if (action === "remove" && ad.favouritesCount > 0)
      ad.favouritesCount -= 1;

    await ad.save();
    res.status(200).json({
      message: "Favorites updated",
      favouritesCount: ad.favouritesCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   🔎 SEARCH ADS
================================ */
export const searchAds = async (req, res) => {
  try {
    const { query, location } = req.query;

    const filters = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { subcategory: { $regex: query, $options: "i" } },
      ],
    };

    if (location && location !== "All Malawi") {
      filters.city = { $regex: location, $options: "i" };
    }

    const ads = await Ad.find(filters).sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};







