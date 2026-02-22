import path from "path";

const normalizeNoWhitespace = (value = "") =>
  String(value).replace(/\s+/g, "");

export const getApiBaseUrl = () =>
  normalizeNoWhitespace(process.env.API_BASE_URL || "").replace(/\/+$/, "");

export const isCloudinaryUrl = (url = "") =>
  /^https?:\/\/res\.cloudinary\.com\//i.test(url);

export const isLocalUploadUrl = (url = "") => {
  if (!url || typeof url !== "string") return false;
  const cleanUrl = normalizeNoWhitespace(url);
  if (cleanUrl.startsWith("/uploads/")) return true;
  const API_BASE_URL = getApiBaseUrl();
  if (!API_BASE_URL) return false;
  return cleanUrl.startsWith(`${API_BASE_URL}/uploads/`);
};

export const buildUploadUrlFromAbsolute = (
  absFilePath,
  uploadsRootAbs,
  apiBaseUrl
) => {
  const safeApiBase = normalizeNoWhitespace(apiBaseUrl || "").replace(/\/+$/, "");
  if (!safeApiBase) {
    throw new Error("API_BASE_URL not configured");
  }

  const normalizedRoot = path.resolve(uploadsRootAbs);
  const normalizedPath = path.resolve(absFilePath);

  if (!normalizedPath.startsWith(normalizedRoot)) {
    throw new Error("File path is outside uploads root");
  }

  const relativePathRaw = path
    .relative(normalizedRoot, normalizedPath)
    .split(path.sep)
    .join("/");
  const relativePath = normalizeNoWhitespace(relativePathRaw);

  if (!relativePath || relativePath.startsWith("..")) {
    throw new Error("Invalid upload relative path");
  }
  if (/\s/.test(relativePath)) {
    throw new Error("Upload path contains whitespace");
  }
  if (!/^(images|videos)\/\d{4}\/\d{2}\/\d{2}\/[A-Za-z0-9._-]+\.[A-Za-z0-9]+$/.test(relativePath)) {
    throw new Error("Upload path shape is invalid");
  }

  return `${safeApiBase}/uploads/${relativePath}`;
};

export const localAbsolutePathFromUrl = (mediaUrl, uploadsRoot) => {
  if (!mediaUrl || typeof mediaUrl !== "string") {
    throw new Error("Invalid media URL");
  }

  let pathname = normalizeNoWhitespace(mediaUrl);

  if (/^https?:\/\//i.test(pathname)) {
    let parsed;
    try {
      parsed = new URL(pathname);
    } catch {
      throw new Error("Invalid absolute media URL");
    }
    pathname = normalizeNoWhitespace(parsed.pathname || "");
  }

  if (!pathname.startsWith("/uploads/")) {
    throw new Error("Not a local uploads URL");
  }

  const relativePart = pathname.replace(/^\/uploads\//, "");
  const safeBase = path.resolve(uploadsRoot);
  const finalAbsolutePath = path.resolve(path.join(safeBase, relativePart));

  if (!finalAbsolutePath.startsWith(safeBase)) {
    throw new Error("Path traversal detected");
  }

  return finalAbsolutePath;
};
