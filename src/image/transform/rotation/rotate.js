//http://homepages.inf.ed.ac.uk/rbf/HIPR2/rotate.htm
//http://www.cyut.edu.tw/~yltang/program/Rotate1.java
import Image from '../../image';
export default function rotate(degrees, interpolation, {
    width = this.width,
    height = this.height
    } = {}) {
    const radians = (degrees * Math.PI) / 180;
    const newWidth = Math.floor(Math.abs(width * Math.cos(radians))+Math.abs(height * Math.sin(radians)));
    const newHeight = Math.floor(Math.abs(height * Math.cos(radians)) + Math.abs(width * Math.sin(radians)));
    const newImageRotated = Image.createFrom(this, { width: newWidth, height: newHeight });
    const cos = Math.cos(-radians);
    const sin = Math.sin(-radians);
    const x0=Math.floor(newWidth / 2);
    const y0=Math.floor(newHeight / 2);
    const incrementX=Math.floor(width / 2 - x0);
    const incrementY=Math.floor(height / 2 - y0);


    if(interpolation === 'bilinear' && degrees%45 != 0){
        for (let i = 0; i < newWidth; i += 1) {
            for (let j = 0; j < newHeight; j += 1) {
                let x = ((i - x0) * cos - (j - y0) * sin + x0) + incrementX;
                let y = ((j - y0) * cos + (i - x0) * sin + y0) + incrementY;
                let x1 = x | 0;
                let y1 = y | 0;
                let x_diff = x - x1;
                let y_diff = y - y1;
                for (let c = 0; c < this.channels; c++) {


                    if(x < 0 || x > width|| y < 0 || y > height) {
                        if(this.alpha){
                            newImageRotated.setValueXY(i, j, c, this.alpha);
                        }else{
                            newImageRotated.setValueXY(i, j, c, this.maxValue);
                        }

                    }else{
                        let index = (y1 * this.width + x1) * this.channels + c;

                        let A = this.data[index];
                        let B = this.data[index + this.channels];
                        let C = this.data[index + this.width * this.channels];
                        let D = this.data[index + this.width * this.channels + this.channels];

                        let result = (A * (1 - x_diff) * (1 - y_diff) + B * (x_diff) * (1 - y_diff) + C * (y_diff) * (1 - x_diff)
                            + D * (x_diff * y_diff)) | 0;

                        newImageRotated.setValueXY(i, j, c, result);
                    }
                }
            }
        }
    }
    else{
        for (let i = 0; i < newWidth; i += 1) {
            for (let j = 0; j < newHeight; j += 1) {
                for (let c = 0; c < this.channels; c++) {
                    let x = Math.round((i - x0) * cos - (j - y0) * sin + x0)+incrementX;
                    let y = Math.round((j - y0) * cos + (i - x0) * sin + y0)+incrementY;

                    if(x < 0 || x > width || y < 0 || y > height) {
                        if(this.alpha){
                            newImageRotated.setValueXY(i, j, c, this.alpha);
                        }else{
                            newImageRotated.setValueXY(i, j, c, this.maxValue);
                        }

                    }
                    else {
                        newImageRotated.setValueXY(i, j, c, this.getValueXY(x, y, c));
                    }
                }
            }
        }

    }
    return newImageRotated;

}

