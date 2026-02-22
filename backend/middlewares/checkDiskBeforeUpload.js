import { getDiskFreeSpace } from "../utils/diskUtils.js";

export const checkDiskBeforeUpload = (minFreeMB = 500, targetPath = "/") => {
  return async (req, res, next) => {
    try {
      const disk = await getDiskFreeSpace(targetPath);

      if (disk.freeMB < minFreeMB) {
        return res.status(503).json({
          success: false,
          message: "Server storage temporarily unavailable",
        });
      }

      return next();
    } catch (error) {
      console.error(
        JSON.stringify({
          level: "error",
          msg: "disk_check_failed",
          error: error?.message || String(error),
        })
      );
      return res.status(503).json({
        success: false,
        message: "Server storage temporarily unavailable",
      });
    }
  };
};
