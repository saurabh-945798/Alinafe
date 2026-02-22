import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";

const execFileAsync = promisify(execFile);

const toMB = (kb) => Math.max(0, Number((kb / 1024).toFixed(2)));
const bytesToMB = (bytes) => Math.max(0, Number((bytes / (1024 * 1024)).toFixed(2)));

export const getDiskFreeSpace = async (targetPath = "/") => {
  // Cross-platform first choice (Node >= 18+): fs.statfs
  try {
    const stats = await fs.statfs(targetPath);
    const bsize = Number(stats.bsize || stats.frsize || 0);
    const blocks = Number(stats.blocks || 0);
    const bfree = Number(stats.bfree || 0);
    const bavail = Number(stats.bavail || bfree);

    if (bsize > 0 && blocks > 0) {
      const totalBytes = bsize * blocks;
      const freeBytes = bsize * bavail;
      const usedBytes = Math.max(0, totalBytes - freeBytes);

      return {
        totalMB: bytesToMB(totalBytes),
        usedMB: bytesToMB(usedBytes),
        freeMB: bytesToMB(freeBytes),
      };
    }
  } catch {
    // fallback below
  }

  // Linux fallback for environments where statfs is unavailable
  try {
    const { stdout } = await execFileAsync("df", ["-kP", targetPath]);
    const lines = stdout.trim().split(/\r?\n/);
    if (lines.length < 2) {
      throw new Error("Unable to read disk usage");
    }

    const parts = lines[1].trim().split(/\s+/);
    if (parts.length < 6) {
      throw new Error("Unexpected disk usage format");
    }

    const totalKB = Number(parts[1]);
    const usedKB = Number(parts[2]);
    const freeKB = Number(parts[3]);

    return {
      totalMB: toMB(totalKB),
      usedMB: toMB(usedKB),
      freeMB: toMB(freeKB),
    };
  } catch (error) {
    throw new Error(`disk space unavailable: ${error?.message || String(error)}`);
  }
};
