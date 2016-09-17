import Matrix from 'ml-matrix';

const cross = [
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0]
];

const smallCross = [
    [0,1,0],
    [1,1,1],
    [0,1,0]
];

/**
 * Class representing a shape
 * @class Shape
 */

export default class Shape {
    constructor({kind = 'cross', shape, size, width, height} = {}) {
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
    }

    getPoints() {
        let matrix = this.matrix;
        let points = [];
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[0].length; x++) {
                if (matrix[y][x]) {
                    points.push([x - this.halfWidth, y - this.halfHeight]);
                }
            }
        }
        return points;
    }
}

function rectangle(width, height) {
    const matrix = Matrix.zeros(height, width);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            matrix.set(y, x, 1);
        }
    }
    return matrix;
}

function ellipse(width, height) {
    const matrix = Matrix.zeros(height, width);
    let yEven = 1 - height % 2;
    let a = Math.floor((width - 1) / 2); // horizontal ellipse axe
    let b = Math.floor((height - 1) / 2); // vertical ellipse axe
    let a2 = a * a;
    let b2 = b * b;
    for (let y = 0; y <= b; y++) {
        let shift = Math.floor(Math.sqrt(a2 - a2 * y * y / b2));
        for (let x = a - shift; x <= a; x++) {
            matrix.set(b - y, x, 1);
            matrix.set(b + y + yEven, x, 1);
            matrix.set(b - y, width - x - 1, 1);
            matrix.set(b + y + yEven, width - x - 1, 1);
        }
    }
    return matrix;
}

function triangle(width, height) {
    const matrix = Matrix.zeros(height, width);
    for (let y = 0; y < height; y++) {
        let shift = Math.floor((1 - y / height) * width / 2);
        for (let x = shift; x < (width - shift); x++) {
            matrix.set(y, x, 1);
        }
    }
    return matrix;
}
