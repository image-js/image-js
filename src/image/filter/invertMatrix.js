// this code gives the same result as invert()
// but is based on a matrix of pixels
// may be easier to implement some algorithm
// but it will likely be much slower

// this method is 50 times SLOWER than invert !!!!!!

export default function invertMatrix() {
    this.checkProcessable('invertMatrix', {
        bitDepth: [8, 16],
        dimension: 2
    });
    let matrix = this.getMatrix();
    for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
            for (let k = 0; k < this.components; k++) {
                matrix[x][y][k] = this.maxValue - matrix[x][y][k];
            }
        }
    }
    this.setMatrix(matrix);
}
