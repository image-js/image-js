let Matrix = require('ml-matrix');


let cross = [
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0]
];

let smallCross = [
    [0,1,0],
    [1,1,1],
    [0,1,0]
];

function getOn(shape) {
    let matrix = shape.matrix;
    let on = [[],[]];
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[0].length; x++) {
            if (matrix[y][x]) {
                on[0].push(x - shape.halfWidth);
                on[1].push(y - shape.halfHeight);
            }
        }
    }
    return on;
}



export default class Shape {
    constructor({kind = 'cross', shape, size, width, height, filled} = {}) {
        if (shape) kind = undefined;
        if (size) {
            width = size;
            height = size;
        }
        if ((width && 1 !== 1) || (height && 1 !== 1)) {
            throw Error('Shape: The width and height has to be odd numbers.');
        }
        if (kind) {
            switch (kind) {
                case 'cross':
                    this.matrix = cross;
                    break;
                case 'smallCross':
                    this.matrix = smallCross;
                    break;
            }
            this.height = this.matrix.length;
            this.width = this.matrix[0].length;
            if ((this.height & 1 === 0) || (this.width & 1 === 0)) {
                throw new Error('Shapes must have an odd height and width');
            }
        } else {
            switch (shape) {
                case 'square':
                case 'rectangle':
                    this.matrix = rectangle(width, height);
                    break;
                case 'circle':
                case 'ellipse':
                    this.matrix = ellipse(width, height);
                    break;
                case 'triangle':
                    this.matrix = triangle(width, height);
                    break;
                default:

            }
        }


        this.halfHeight = (this.height / 2) >> 0;
        this.halfWidth = (this.width / 2) >> 0;
        this.on = getOn(this);
    }
}

function rectangle(width, height) {
    let matrix = Matrix.zeros(height, width);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            matrix[y][x] = 1;
        }
    }
    return matrix;
}

function ellipse(width, height) {
    let matrix = Matrix.zeros(height, width);
    let a = Math.floor(width / 2);
    let b = Math.floor(height / 2);
    for (let y = 0; y < height; y++) {
        let yp = Math.floor(y / 2);
        let shift = Math.floor(width / 2 - Math.sqrt((a * a * b * b - a * a * yp * yp) / b * b));
        for (let x = shift; x < (width - shift); x++) {
            matrix[y][x] = 1;
        }
    }
    return matrix;
}

function triangle(width, height) {
    let matrix = Matrix.zeros(height, width);
    for (let y = 0; y < height; y++) {
        let shift = Math.floor((1 - y / height) * width / 2);
        for (let x = shift; x < (width - shift); x++) {
            matrix[y][x] = 1;
        }
    }
    return matrix;
}
