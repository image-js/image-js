import type { BriefDescriptor } from '../descriptors/getBriefDescriptors.js';

/**
 * Compute the Hamming distance between two bit strings.
 * @see {@link https://en.wikipedia.org/wiki/Hamming_distance}
 * @param descriptor1 - First bit string.
 * @param descriptor2 - Second bit string.
 * @returns The Hamming distance.
 */
export function getHammingDistance(
  descriptor1: BriefDescriptor,
  descriptor2: BriefDescriptor,
): number {
  let sum = 0;
  for (let i = 0; i < descriptor1.length; i++) {
    sum += descriptor1[i] ^ descriptor2[i];
  }

  return sum;
}
