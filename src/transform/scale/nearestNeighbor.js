export default function nearestNeighbor(newImage, newWidth, newHeight) {
    const wRatio = this.width / newWidth;
    const hRatio = this.height / newHeight;
    for (let i = 0; i < newWidth; i++) {
        let w = Math.floor(i * wRatio);
        for (let j = 0; j < newHeight; j++) {
            let h = Math.floor(j * hRatio);
            for (let c = 0; c < this.channels; c++) {
                newImage.setValueXY(i, j, c, this.getValueXY(w, h, c));
            }
        }
    }
}
