/**
 * Nearest neighbor resizing algorithm
 * @private
 * @param {Image} newImage
 * @param {number} newWidth
 * @param {number} newHeight
 */
export default function nearestNeighbor(newImage, newWidth, newHeight) {
  const wRatio = this.width / newWidth;
  const hRatio = this.height / newHeight;

  if (this.bitDepth > 1) {
    for (let i = 0; i < newWidth; i++) {
      const w = Math.floor((i + 0.5) * wRatio);
      for (let j = 0; j < newHeight; j++) {
        const h = Math.floor((j + 0.5) * hRatio);
        for (let c = 0; c < this.channels; c++) {
          newImage.setValueXY(i, j, c, this.getValueXY(w, h, c));
        }
      }
    }
  } else {
    for (let i = 0; i < newWidth; i++) {
      const w = Math.floor((i + 0.5) * wRatio);
      for (let j = 0; j < newHeight; j++) {
        const h = Math.floor((j + 0.5) * hRatio);
        if (this.getBitXY(w, h)) {
          newImage.setBitXY(i, j);
        }
      }
    }
  }
}
