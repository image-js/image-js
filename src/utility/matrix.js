
export default function Matrix(width,height,defaultValue) {
    this.matrix=new Array(width);
    for (let x=0; x<width; x++) {
        this.matrix[x]=new Array(height);
    }
    if (defaultValue) {
        for (let x=0; x<width; x++) {
            for (let y=0; y<height; y++) {
                this.matrix[x][y]=defaultValue;
            }
        }
    }

    Object.defineProperty(this.matrix, 'width', {writable:true});

    this.matrix.width=function() {
        return this.length;
    }

    Object.defineProperty(this.matrix, 'width', {writable:true});

    this.matrix.width=function() {
        if (! this[0]) return 0;
        return this[0].length;
    }

    Object.defineProperty(this.matrix, 'localMin', {writable:true});

    this.matrix.localMin=function(x,y) {
        let min=this[x][y];
        let position=[x,y];
        for (let i=(Math.max(0,x-1)); i<Math.min(this.length,x+2); i++) {
            for (let j=(Math.max(0,y-1)); j<Math.min(this[0].length,y+2); j++) {
                if (this[i][j]<min) {
                    min=this[i][j];
                    position=[i,j];
                }
            }
        }
        return {
            position: position,
            value: min
        };
    }

    Object.defineProperty(this.matrix, 'localMax', {writable:true});

    this.matrix.localMax=function(x,y) {
        let max=this[x][y];
        let position=[x,y];
        for (let i=(Math.max(0,x-1)); i<Math.min(this.length,x+2); i++) {
            for (let j=(Math.max(0,y-1)); j<Math.min(this[0].length,y+2); j++) {
                if (this[i][j]>max) {
                    max=this[i][j];
                    position=[i,j];
                }
            }
        }
        return {
            position: position,
            value: max
        };
    }

    this.matrix.localSearch=function(x,y,value) {
        let results=[];
        for (let i=(Math.max(0,x-1)); i<Math.min(this.length,x+2); i++) {
            for (let j=(Math.max(0,y-1)); j<Math.min(this[0].length,y+2); j++) {
                if (this[i][j]===value) {
                   results.push([i,j]);
                }
            }
        }
        return results;
    }

    return this.matrix;
}

