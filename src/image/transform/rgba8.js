import Image from '../image';
import {RGB} from '../model/model';

export default function rgba8() {

    let newImage = new Image(this.width, this.height, {
        kind:'RGBA'
    });

    newImage.data = this.getRGBAData();
    return newImage;
}
