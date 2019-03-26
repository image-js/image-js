import checkHeader from './checkHeader';
import { decodePng } from './decodePng';

export function decode(data: ArrayBufferView) {
    // png
    if(checkHeader(data, [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
        return decodePng(data);
    } else {
        throw new Error('invalid data format');
    }
}