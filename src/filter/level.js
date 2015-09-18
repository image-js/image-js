// this code gives the same result as invert()
// but is based on a matrix of pixels
// may be easier to implement some algorithm
// but it will likely be much slower

export default function level({algorithm='full'}={}) {
    this.checkProcessable('level', {
        bitDepth: [8, 16],
        dimension: 2
    });

    switch (algorithm) {
        case 'full':

            let min=this.min;
            let max=this.max;
            let factor=new Array(this.channels);
            for (let c=0; c<this.components; c++) {
                if (max[c]!==min[c]) {
                    factor[c]=this.maxValue/(max[c]-min[c]);
                } else {
                    factor[c]=0;
                }
            }

            /*
             TODO check the border effect and find a solution !
             For 8 bits images we should calculate for the space between -0.5 and 255.5
             so that after ronding the first and last points still have the same population
             But doing this we need to deal with Math.round that gives 256 if the value is 255.5
              */


            for (let c=0; c<this.components; c++) {
                if (factor[c]!==0) {
                    for (let i=0; i<this.data.length; i+=this.channels) {
                        this.data[i+c]=Math.round((this.data[i+c]-min[c])*factor[c])
                    }
                }
            }

            break;
        default:
            throw new Error('level: algorithm not implement: '+algorithm);
    }
}
