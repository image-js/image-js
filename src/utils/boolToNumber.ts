import type { BitValue } from '../Mask.js';

/**
 * Converts a bit value to the corresponding number.
 * @param value - The bit to convert.
 * @returns The bit value as a number.
 */
export function boolToNumber(value: BitValue): number {
  let result;
  if (typeof value === 'boolean') {
    result = value ? 1 : 0;
  } else {
    result = value;
  }

  return result;
}
