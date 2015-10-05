import Image from '../image';
import {validateChannel} from './../../util/channel';

<<<<<<< HEAD
export default function getRow(row, channel=0) {
=======
export default function getRow(row, channel = 0) {
>>>>>>> Remove .only and fix syntax

    this.checkProcessable('getRow', {
        bitDepth: [8, 16]
    });

    this.checkRow(row);
    this.checkChannel(channel);

<<<<<<< HEAD
    let array=new Array(this.width);
    let ptr=0;
    let begin=row*this.width*this.channels+channel;
    let end=begin + this.width*this.channels;
    for (let j = begin; j < end; j += this.channels) {
        array[ptr++]=this.data[j];
=======
    let array = new Array(this.width);
    let ptr = 0;
    let begin = row * this.width * this.channels + channel;
    let end = begin + this.width * this.channels;
    for (let j = begin; j < end; j += this.channels) {
        array[ptr++] = this.data[j];
>>>>>>> Remove .only and fix syntax
    }

    return array;
}
