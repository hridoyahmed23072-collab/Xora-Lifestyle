import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from './firebase';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

/**
 * Upload an image file to Cloudinary using an unsigned upload preset.
 * If Cloudinary env vars are missing, converts the file to a base64 Data URL so local demo mode works!
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = CLOUDINARY_CLOUD_NAME || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = CLOUDINARY_UPLOAD_PRESET || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary configuration is missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to upload image files to Cloudinary, or paste a direct HTTPS image URL below.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to upload image to Cloudinary');
  }

  const data: CloudinaryUploadResponse = await response.json();
  if (!data.secure_url || !data.secure_url.startsWith('https://')) {
    throw new Error('Cloudinary did not return a valid HTTPS image URL');
  }

  return data.secure_url;
}
