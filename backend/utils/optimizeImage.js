import fs from "fs/promises";
import path from "path";

let sharpModule = null;
let sharpWarned = false;

const getSharp = async () => {
  if (sharpModule) return sharpModule;
  try {
    const mod = await import("sharp");
    sharpModule = mod.default || mod;
    return sharpModule;
  } catch {
    if (!sharpWarned) {
      console.warn("[optimizeImage] sharp not installed. Skipping optimization.");
      sharpWarned = true;
    }
    return null;
  }
};

export const optimizeImageToJpeg = async (absoluteInputPath) => {
  const sharp = await getSharp();
  if (!sharp) return absoluteInputPath;

  const dir = path.dirname(absoluteInputPath);
  const base = path.basename(absoluteInputPath, path.extname(absoluteInputPath));
  const outputPath = path.join(dir, `${base}.jpg`);
  const tempPath = path.join(dir, `${base}.tmp-${Date.now()}.jpg`);

  try {
    await sharp(absoluteInputPath)
      .rotate()
      .resize({ width: 1400, withoutEnlargement: true })
      .jpeg({ quality: 75, mozjpeg: true })
      .toFile(tempPath);

    await fs.rename(tempPath, outputPath);

    if (outputPath !== absoluteInputPath) {
      await fs.unlink(absoluteInputPath).catch(() => {});
    }

    return outputPath;
  } catch (error) {
    await fs.unlink(tempPath).catch(() => {});
    console.error("[optimizeImage] failed:", error?.message || error);
    return absoluteInputPath;
  }
};
