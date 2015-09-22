import {sync as rmSync} from 'rimraf';
import {mkdirSync} from 'fs';
import {getImage} from '../test';

export {getImage, getHash} from '../test';

import Image from '../../src/image';

export {Image};

export function load(name) {
    return Image.load(getImage(name));
}

export function getSquare() {
    return new Image(3,3,[
        0,  0,  255,255, // red
        0,  255,0,  255, // green
        255,0,  0,  255, // blue
        255,255,0,  255, // yellow
        255,0,  255,255, // magenta
        0,  255,255,255, // cyan
        0,  0,  0,  255, // black
        255,255,255,255, // white
        127,127,127,255  // grey
    ]);
}

export let tmpDir = __dirname + '/TMP';
export function refreshTmpDir() {
    rmSync(tmpDir);
    mkdirSync(tmpDir);
}
