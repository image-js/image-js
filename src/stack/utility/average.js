/*
 We will try to move a set of images in order to get only the best common part of them
 The match is always done on the first image ?
*/
import Stack from '../stack';
import Image from '../../image/image';

export default function average({} = {}) {
    this.checkProcessable('average', {
        bitDepth: [8, 16]
    });

    let data=new Uint32Array(this[0].data.length);
    for (let i=0; i<this.length; i++) {
        let current=this[i];
        for (let j=0; j<this[0].data.length; j++) {
            data[j]+=current.data[j];
        }
    }

    let image = Image.createFrom(this[0]);
    let newData=image.data;

    for (let i=0; i<this[0].data.length; i++) {
        newData[i]=data[i]/this.length;
    }

    return image;
}
