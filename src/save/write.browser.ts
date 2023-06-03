/**
 * Dummy throwing write.
 */
export function write() {
  throw new Error('write is not implemented in the browser');
}

/**
 * Dummy throwing writeSync.
 */
export function writeSync() {
  throw new Error('writeSync is not implemented in the browser');
}
