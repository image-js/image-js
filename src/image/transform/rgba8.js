import Image from '../image';

/**
 * Make a copy of the current image and convert to a RGBA 8 bits
 * @memberof Image
 * @instance
 */

export default function rgba8() {

    let newImage = new Image(this.width, this.height, {
        kind:'RGBA'
    });

    newImage.data = this.getRGBAData();
    return newImage;
}
