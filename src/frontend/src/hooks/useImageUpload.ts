import { useState } from "react";

/**
 * Hook for preparing profile/cover images for persistent storage.
 *
 * Converts images to base64 data URLs so they can be stored directly
 * in the backend as URL strings. Unlike blob: URLs which are ephemeral
 * (lost on page refresh), base64 data URLs embed the complete image data
 * and persist because they are stored in the backend's string field.
 *
 * Images are resized/compressed before encoding to keep the URL manageable.
 */

export type UploadProgressState =
  | "idle"
  | "reading"
  | "compressing"
  | "done"
  | "error";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgressState>("idle");
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    setProgress("reading");
    setError(null);

    try {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Invalid file type. Please select an image.");
      }

      // Validate file size (max 10MB before compression)
      const MAX_FILE_SIZE_MB = 10;
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        throw new Error(
          `Image too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`,
        );
      }

      setProgress("compressing");
      const dataUrl = await compressAndEncodeImage(file);

      // Check if the resulting base64 is reasonable size (< 500KB as string)
      if (dataUrl.length > 500 * 1024) {
        // Try with lower quality
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

/**
 * Compress image to maxSize px on largest side and encode as JPEG base64 data URL.
 * Keeps file size reasonable for storage in the backend.
 */
function compressAndEncodeImage(
  file: File,
  maxSize = 800,
  quality = 0.85,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let blobUrl: string | null = null;

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
    }, 15000);

    img.onload = () => {
      clearTimeout(timeoutId);
      try {
        let { width, height } = img;

        // Scale down if needed
        if (width > maxSize || height > maxSize) {
          if (width >= height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        // Guard against zero dimensions
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
              "Canvas context unavailable. Please try a different browser.",
            ),
          );
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Encode as JPEG — good balance of size and fidelity
        const dataUrl = canvas.toDataURL("image/jpeg", quality);

        if (!dataUrl || dataUrl === "data:,") {
          cleanup();
          reject(
            new Error("Failed to encode image. The image may be corrupted."),
          );
          return;
        }

        cleanup();
        resolve(dataUrl);
      } catch (err) {
        cleanup();
        reject(
          err instanceof Error ? err : new Error("Image processing failed."),
        );
      }
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      cleanup();
      reject(
        new Error(
          "Failed to load image. The file may be corrupted or unsupported.",
        ),
      );
    };

    img.src = blobUrl;
  });
}
