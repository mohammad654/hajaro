const MAX_DIMENSION_PX = 900;
const OUTPUT_QUALITY = 0.82;
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Validates and downsizes an image in the browser, returning a WebP data URL.
 * Keeps uploads small (and strips EXIF metadata such as GPS location) before they are stored or sent.
 */
export async function downscaleImage(file: File): Promise<string> {
  if (!ACCEPTED_TYPES.includes(file.type))
    throw new Error('Please choose a JPEG, PNG or WebP image.');
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('Images must be smaller than 10 MB.');

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION_PX / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Image processing is not supported in this browser.');
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/webp', OUTPUT_QUALITY);
}
