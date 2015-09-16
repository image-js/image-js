/**
 * Created by madeleine01, kellyjoha on 12/09/15.
 */

import Image from '../../image';

export default function sampling({
    width = this.width,
    height = this.height
    } = {}) {

        if (width > this.width || width < 0)
            throw new RangeError('width is out of range ' + ((width < 0) ? ' < 0' : (' > ' + this.width)));

        if (height > this.height || height < 0)
            throw new RangeError('height is out of range ' + (height < 0) ? ' < 0' : (' > ' + this.height));

    let newImage = Image.createFrom(this, {width , height});
    let r_width = Math.round(this.width / width);
    let r_height = Math.round(this.height / height);

    for (let i = 0, x = 0; i < this.width, x < width; i += r_width, x++)
        for (let j = 0, y = 0; j < this.height, y < height; j += r_height, y++)
            for(let c=0; c<this.channels; c++)
                newImage.setValueXY(x,y,c,this.getValueXY(i,j,c));

    return newImage;
}
