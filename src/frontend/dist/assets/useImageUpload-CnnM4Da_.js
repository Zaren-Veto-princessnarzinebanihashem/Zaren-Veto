import { b as createLucideIcon, r as reactExports } from "./index-B7Ujb7fy.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
];
const Camera = createLucideIcon("camera", __iconNode);
function useImageUpload() {
  const [uploading, setUploading] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState("idle");
  const [error, setError] = reactExports.useState(null);
  const uploadImage = async (file) => {
    setUploading(true);
    setProgress("reading");
    setError(null);
    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Invalid file type. Please select an image.");
      }
      const MAX_FILE_SIZE_MB = 10;
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        throw new Error(
          `Image too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`
        );
      }
      setProgress("compressing");
      const dataUrl = await compressAndEncodeImage(file);
      if (dataUrl.length > 500 * 1024) {
        const smallerUrl = await compressAndEncodeImage(file, 600, 0.7);
        setProgress("done");
        return smallerUrl;
      }
      setProgress("done");
      return dataUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      setProgress("error");
      throw err instanceof Error ? err : new Error(message);
    } finally {
      setUploading(false);
    }
  };
  const reset = () => {
    setUploading(false);
    setProgress("idle");
    setError(null);
  };
  return { uploadImage, uploading, progress, error, reset };
}
function compressAndEncodeImage(file, maxSize = 800, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let blobUrl = null;
    const cleanup = () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        blobUrl = null;
      }
    };
    try {
      blobUrl = URL.createObjectURL(file);
    } catch {
      reject(new Error("Could not read the image file."));
      return;
    }
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error("Image loading timed out."));
    }, 15e3);
    img.onload = () => {
      clearTimeout(timeoutId);
      try {
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width >= height) {
            height = Math.round(height * maxSize / width);
            width = maxSize;
          } else {
            width = Math.round(width * maxSize / height);
            height = maxSize;
          }
        }
        if (width <= 0 || height <= 0) {
          cleanup();
          reject(new Error("Invalid image dimensions."));
          return;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          cleanup();
          reject(
            new Error(
              "Canvas context unavailable. Please try a different browser."
            )
          );
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        if (!dataUrl || dataUrl === "data:,") {
          cleanup();
          reject(
            new Error("Failed to encode image. The image may be corrupted.")
          );
          return;
        }
        cleanup();
        resolve(dataUrl);
      } catch (err) {
        cleanup();
        reject(
          err instanceof Error ? err : new Error("Image processing failed.")
        );
      }
    };
    img.onerror = () => {
      clearTimeout(timeoutId);
      cleanup();
      reject(
        new Error(
          "Failed to load image. The file may be corrupted or unsupported."
        )
      );
    };
    img.src = blobUrl;
  });
}
export {
  Camera as C,
  useImageUpload as u
};
