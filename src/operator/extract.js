// we will create a small image from a mask


import Image from '../image';

export default function extract(mask, {
    scale = 1,
    position} = {}) {

    this.checkProcessable('extract', {
        bitDepth: [8, 16]
    });

    // we need to find the relative position to the parent
    if (! position) {
        position = mask.getRelativePosition(this);
        if (! position) {
            throw new Error('extract : can not extract an image because the relative position can not be' +
                'determined, try to specify manualy the position as an array of 2 elements [x,y].')
        }
    }
    let extract=Image.createFrom(this, {
        width: mask.width,
        height: mask.height,
        alpha: 1,   // we force the alpha, otherwise dificult to extract a mask ...
        position: position,
        parent: this
    });



    for (let x = 0; x < mask.width; x++) {
        for (let y = 0; y < mask.height; y++) {
            if (mask.getBitXY(x, y)) {
                for (let channel = 0; channel < this.channels; channel++) {
                    let value=this.getValueXY(x + position[0], y + position[1], channel);
                    extract.setValueXY(x, y, channel, value);
                }
            } else { // no match, we make a white transparent
                for (let component = 0; component < this.components; component++) {
                    extract.setValueXY(x, y, component, this.maxValue);
                }
                if (this.alpha) {
                    extract.setValueXY(x, y, this.components, 0);
                }
            }
        }
    }

    return extract;
}
