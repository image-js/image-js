import Image from '../image';
import {RGB} from '../model/model';

export default function rgba8() {

    let newImage = Image.createFrom(this, {
        bitDepth: 8,
        colorModel: 'RGBA'
    });

    newImage.data = this.getRGBAData();

    return newImage;
}
