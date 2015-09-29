import Image from './image';
import {env} from './environment';
import includes from 'string-includes';

let types = new Map();
let image;

function getMediaType(type) {
    if (!image) {
        image = new Image(1, 1);
    }
    let theType = types.get(type);
    if (!theType) {
        theType = new MediaType(type);
        types.set(type, theType);
    }
    return theType;
}

export function canWrite(type) {
    if (env === 'node' && type !== 'image/png') {
        return false; // node-canvas throws for other types
    } else {
        return getMediaType(type).canWrite();
    }
}

class MediaType {
    constructor(type) {
        this.type = type;
        this._canWrite = null;
    }

    canWrite() {
        if (this._canWrite === null) {
            this._canWrite = image.toDataURL(this.type).startsWith('data:' + this.type);
        }
        return this._canWrite;
    }
}

export function getType(type) {
    if (!includes(type, '/')) {
        type = 'image/' + type;
    }
    return type;
}
