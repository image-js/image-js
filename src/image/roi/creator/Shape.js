
let cross=[
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0]
];

function getOn(shape) {
    let matrix=shape.matrix;
    let on=[[],[]];
    for (let y=0; y<matrix.length; y++) {
        for (let x=0; x<matrix[0].length; x++) {
            if (matrix[x][y]) {
                on[0].push(x-shape.halfWidth);
                on[1].push(y-shape.halfHeight);
            }
        }
    }
    return on;
}



export default class Shape {
    constructor({shape='cross', size, filled}={}) {
        switch(shape) {
            case 'cross':
                this.matrix=cross;
                break;
        }
        this.height=this.matrix.length;
        this.width=this.matrix[0].length;
        if ((this.height & 1 === 0) || (this.width & 1 === 0)) {
            throw new Error("Shapes must have an odd height and width");
        }
        this.halfHeight=(this.height/2)>>0;
        this.halfWidth=(this.width/2)>>0;
        this.on=getOn(this);
    }
}

