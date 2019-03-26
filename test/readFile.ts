import * as fs from 'fs';
import * as path from 'path';

export function readImage(name: string) {
    const filePath = path.join(__dirname, `./img/${name}`);
    return fs.readFileSync(filePath);
}