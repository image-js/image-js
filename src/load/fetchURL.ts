import { decode } from './decode.js';

/**
 * Fetches image URL and decodes it.
 * @param dataUrl - Image URL.
 * @returns decoded image data.
 */
export async function fetchURL(dataUrl: string) {
  const response = await fetch(dataUrl);
  const arrayBuffer = await response.arrayBuffer();
  const image = decode(new DataView(arrayBuffer));
  return image;
}
