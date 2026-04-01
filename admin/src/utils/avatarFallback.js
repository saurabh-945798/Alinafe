import defaultAvatarPng from "../../../frontend/assets/—Pngtree—user profile avatar_13369988.png";

export const DEFAULT_AVATAR = defaultAvatarPng;

export const withAvatarFallback = (src) => {
  const value = String(src || "").trim();
  return value || DEFAULT_AVATAR;
};

export const handleAvatarError = (event) => {
  const element = event?.currentTarget;
  if (!element) return;
  if (element.dataset.fallbackApplied === "true") return;
  element.dataset.fallbackApplied = "true";
  element.src = DEFAULT_AVATAR;
};
