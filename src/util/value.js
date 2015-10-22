import Image from '../image/image';

export function checkNumberArray(value) {
    if (!isNaN(value)) {
        if (value <= 0) throw new Error('checkNumberArray: the value must be greater than 0');
        return value;
    } else {
        if (value instanceof Image) {
            return Image.data;
        }
        if (!Array.isArray(value)) {
            throw new Error('checkNumberArray: the value should be either a number, array or Image');
        }
        return value;
    }
}

