import express from "express";
import mongoose from "mongoose";
import Ad from "../models/Ad.js";

const router = express.Router();

const CRAWLER_REGEX =
  /(facebookexternalhit|whatsapp|twitterbot|linkedinbot|telegrambot|slackbot)/i;

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const trimSlashes = (value = "") => String(value).replace(/\/+$/, "");

const toAbsoluteUrl = (rawUrl, baseUrl) => {
  const normalizedBase = trimSlashes(baseUrl);
  const source = String(rawUrl || "").trim();
  if (!source) return "";
  if (/^https?:\/\//i.test(source)) return source;
  if (source.startsWith("/")) return `${normalizedBase}${source}`;
  return `${normalizedBase}/${source}`;
};

const buildCompactLocation = (ad) => {
  const parts = [ad?.location, ad?.city, ad?.state]
    .map((p) => String(p || "").trim())
    .filter(Boolean);
  return [...new Set(parts)].join(", ");
};

router.get("/og/ad/:id", async (req, res) => {
  const { id } = req.params;

  const siteBase = trimSlashes(
    process.env.APP_BASE_URL || process.env.FRONTEND_URL || "https://alinafe.in"
  );
  const pageUrl = `${siteBase}/ad/${id}`;
  const userAgent = String(req.headers["user-agent"] || "");
  const isCrawler = CRAWLER_REGEX.test(userAgent);

  if (!isCrawler) {
    return res.redirect(302, pageUrl);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ad id");
  }

  try {
    const ad = await Ad.findById(id)
      .select("title price images location city state")
      .lean();

    if (!ad) {
      return res.status(404).send("Ad not found");
    }

    const title = String(ad?.title || "Listing").trim();
    const priceText =
      ad?.price !== undefined && ad?.price !== null && ad?.price !== ""
        ? `\u20B9 ${Number(ad.price).toLocaleString("en-IN")}`
        : "";

    const locationText = buildCompactLocation(ad);
    const description = [priceText, locationText].filter(Boolean).join(" | ");

    const firstImage = Array.isArray(ad?.images) ? ad.images[0] : "";
    const fallbackImage = `${siteBase}/logo.png`;
    const imageUrl = toAbsoluteUrl(firstImage, siteBase) || fallbackImage;

    const pageTitle = `${title} - ALINAFE`;
    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta property="og:title" content="${escapeHtml(pageTitle)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${escapeHtml(imageUrl)}" />
<meta property="og:url" content="${escapeHtml(pageUrl)}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Alinafe" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
</head>
<body>Preview</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=60");
    return res.status(200).send(html);
  } catch (error) {
    console.error("og_preview_error:", error);
    return res.status(500).send("Preview unavailable");
  }
});

export default router;
