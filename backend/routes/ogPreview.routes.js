import express from "express";
import mongoose from "mongoose";
import Ad from "../models/Ad.js";

const router = express.Router();

// Bots / crawlers that fetch OpenGraph previews
const CRAWLER_REGEX =
  /(facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot|TelegramBot|Slackbot)/i;

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const trimSlashes = (v = "") => String(v).replace(/\/+$/, "");

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

/**
 * OG Preview Route (ONLY for crawlers)
 * ✅ Use this URL in WhatsApp share preview:
 *    https://alinafe.in/og/ad/<AD_ID>
 *
 * Normal user ad page remains:
 *    https://alinafe.in/ad/<AD_ID>
 */
router.get("/og/ad/:id", async (req, res) => {
  const { id } = req.params;

  const userAgent = req.get("user-agent") || "";
  const isCrawler = CRAWLER_REGEX.test(userAgent);

  // If normal user hits OG route, redirect them to the real React page
  const SITE_BASE = trimSlashes(
    process.env.APP_BASE_URL ||
      process.env.FRONTEND_URL ||
      "https://alinafe.in"
  );

  if (!isCrawler) {
    return res.redirect(302, `${SITE_BASE}/ad/${id}`);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res
      .status(400)
      .send("<!doctype html><html><body>Invalid ad id</body></html>");
  }

  try {
    const ad = await Ad.findById(id)
      .select("title price images location city state")
      .lean();

    if (!ad) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res
        .status(404)
        .send("<!doctype html><html><body>Ad not found</body></html>");
    }

    const title = (ad?.title || "Listing").trim();
    const priceText =
      ad?.price !== undefined && ad?.price !== null && ad?.price !== ""
        ? `₹ ${Number(ad.price).toLocaleString("en-IN")}`
        : "";
    const locationText = buildCompactLocation(ad);
    const description = [priceText, locationText].filter(Boolean).join(" | ");

    // Build OG image absolute URL
    const firstImage = Array.isArray(ad?.images) ? ad.images[0] : "";
    const fallbackImage = `${SITE_BASE}/logo.png`;

    // Ensure image URL is absolute and https
    const imageUrl = toAbsoluteUrl(firstImage, SITE_BASE) || fallbackImage;

    // og:url should be the real public page (React route)
    const pageUrl = `${SITE_BASE}/ad/${id}`;
    const pageTitle = `${title} - ALINAFE`;

    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(pageTitle)}</title>

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
  <body>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
  </body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    // Keep cache short for fast updates (WhatsApp caches aggressively)
    res.setHeader("Cache-Control", "public, max-age=60");
    return res.status(200).send(html);
  } catch (error) {
    console.error("og_preview_error:", error?.message || error);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res
      .status(500)
      .send("<!doctype html><html><body>Preview unavailable</body></html>");
  }
});

export default router;