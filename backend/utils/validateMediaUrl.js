const MEDIA_URL_REGEX =
  /^https?:\/\/[^/]+\/uploads\/(images|videos)\/\d{4}\/\d{2}\/\d{2}\/[A-Za-z0-9._-]+\.(jpg|mp4)$/i;

export const hasWhitespace = (value = "") => /\s/.test(String(value));

export const validateMediaUrl = (url = "") => {
  const value = String(url || "");
  if (!value || hasWhitespace(value)) {
    return {
      valid: false,
      message: "Invalid media URL contains whitespace or is empty",
    };
  }

  if (!MEDIA_URL_REGEX.test(value)) {
    return {
      valid: false,
      message: "Invalid media URL format",
    };
  }

  return { valid: true };
};
