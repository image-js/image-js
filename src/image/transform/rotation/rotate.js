//http://homepages.inf.ed.ac.uk/rbf/HIPR2/rotate.htm
//http://www.cyut.edu.tw/~yltang/program/Rotate1.java
import Image from '../../image';
export default function rotate(degrees, {
    width = this.width,
    height = this.height
    } = {}) {
    if (width > this.width || width < 0)
        throw new RangeError('width is out of range ' + ((width < 0) ? ' < 0' : (' > ' + this.width)));
    if (height > this.height || height < 0)
        throw new RangeError('height is out of range ' + (height < 0) ? ' < 0' : (' > ' + this.height));
    let radians = (degrees * Math.PI) / 180;
    let newImage = Image.createFrom(this, {width , height});
    for (let i = 0; i < width; i += 1) {
        for (let j = 0 ; j < height; j += 1) {
            for(let c = 0; c<this.channels; c++) {
                let x = Math.round((i - (width / 2)) * Math.cos( - radians) - (j - (height / 2)) * Math.sin(-radians)) + Math.round(width / 2);
                let y = Math.round((j - (height / 2)) * Math.cos( - radians) + (i - (width / 2)) * Math.sin(-radians)) + Math.round(height / 2);
                if(x > 0 && x < width) {
                    if(y > 0 && y < height ) {
                        newImage.setValueXY(i,j,c,this.getValueXY(x,y,c));
                    }
                }
            }
        }
    }
    return newImage;
}