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
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      return await compressAndEncodeImage(file);
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading };
}

/**
 * Compress image to max 800px on largest side and encode as JPEG base64 data URL.
 * Keeps file size reasonable for storage in the backend.
 */
function compressAndEncodeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const blobUrl = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const MAX_SIZE = 800;
        let { width, height } = img;

        // Scale down if needed
        if (width > MAX_SIZE || height > MAX_SIZE) {
          if (width >= height) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          } else {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Encode as JPEG with 85% quality — good balance of size and fidelity
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      } finally {
        URL.revokeObjectURL(blobUrl);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error("Failed to load image"));
    };

    img.src = blobUrl;
  });
}
