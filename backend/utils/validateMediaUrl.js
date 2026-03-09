const ALLOWED_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "mp4",
]);

export const hasWhitespace = (value = "") => /\s/.test(String(value));

const isHttpUrl = (value = "") => /^https?:\/\//i.test(value);

const getPathnameFromUrl = (value = "") => {
  const source = String(value || "");
  if (!source) return "";

  if (isHttpUrl(source)) {
    const parsed = new URL(source);
    return decodeURIComponent(parsed.pathname || "");
  }

  // Legacy/local relative URL support
  const clean = source.split(/[?#]/)[0];
  return decodeURIComponent(clean || "");
};

export const validateMediaUrl = (url = "") => {
  const value = String(url || "").trim();

  if (!value || hasWhitespace(value)) {
    return {
      valid: false,
      message: "Invalid media URL contains whitespace or is empty",
    };
  }

  let pathname = "";
  try {
    pathname = getPathnameFromUrl(value);
  } catch {
    return {
      valid: false,
      message: "Invalid media URL format",
    };
  }

  if (!pathname || pathname.includes("..")) {
    return {
      valid: false,
      message: "Invalid media URL format",
    };
  }

  // Relative paths are only valid for local uploads.
  const isRelative = !isHttpUrl(value);
  if (isRelative && !(pathname.startsWith("/uploads/") || pathname.startsWith("uploads/"))) {
    return {
      valid: false,
      message: "Invalid media URL format",
    };
  }

  const extMatch = pathname.match(/\.([a-zA-Z0-9]+)$/);
  const extension = extMatch?.[1]?.toLowerCase() || "";

  if (!extension || !ALLOWED_EXTENSIONS.has(extension)) {
    return {
      valid: false,
      message: "Invalid media URL format",
    };
  }

  return { valid: true };
};
