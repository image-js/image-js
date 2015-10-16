//http://homepages.inf.ed.ac.uk/rbf/HIPR2/rotate.htm
//http://www.cyut.edu.tw/~yltang/program/Rotate1.java
import Image from '../../image';
export default function rotate(degrees, {
    width = this.width,
    height = this.height
    } = {}) {
    const radians = (degrees * Math.PI) / 180;
    const newWidth = Math.round(Math.abs(width * Math.cos(radians))+Math.abs(height * Math.sin(radians)));
    const newHeight = Math.round(Math.abs(height * Math.cos(radians)) + Math.abs(width * Math.sin(radians)));
    const newImageRotated = Image.createFrom(this, { width: newWidth, height: newHeight });
    const cos = Math.cos(-radians);
    const sin = Math.sin(-radians);
    const x0=Math.round(newWidth / 2);
    const y0=Math.round(newHeight / 2);
    const incrementX=Math.round(width / 2 - x0);
    const incrementY=Math.round(height / 2 - y0);



    for (let i = 0; i < newWidth; i += 1) {
        for (let j = 0; j < newHeight; j += 1) {
            for (let c = 0; c < this.channels; c++) {
                let x = Math.round((i - x0) * cos - (j - y0) * sin + x0);
                let y = Math.round((j - y0) * cos + (i - x0) * sin + y0);

                        if(x <= -incrementX || x >= width - incrementX || y <= -incrementY || y >= height - incrementY) {
                            newImageRotated.setValueXY(i, j, c, 255);
                        }
                        else {
                            newImageRotated.setValueXY(i, j, c, this.getValueXY(x + incrementX, y + incrementY, c));
                        }
            }
        }
    }


    return newImageRotated;
}
