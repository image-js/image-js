import { colord, extend } from 'colord';
import labPlugin from 'colord/plugins/lab';

extend([labPlugin]);

console.log(colord({ r: 255, g: 0, b: 0 }).toLab());

console.log(colord({ l: 50, a: -128, b: -128 }).toRgb());
console.log(colord({ l: 50, a: 127, b: 127 }).toRgb());
