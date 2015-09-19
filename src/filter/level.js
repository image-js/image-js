import validateChannel from '../misc/validateChannel';


export default function level({algorithm='full', components}={}) {
    this.checkProcessable('level', {
        bitDepth: [8, 16],
        dimension: 2
    });

    // we have the possibility to select on which channel we want to apply the code
    // we will check that really all the channels are present !
    if (Array.isArray(components)) {
        for (let c=0; c<channels.length; c++) {
            components[c] = validateChannel(this,channels[c]);
        }
    } else {
        channels=new Array(this.components);
        for (let c=0; c<this.components; c++) {
            channels[c]=c;
        }
    }


    switch (algorithm) {
        case 'full':
            let delta=1e-5; // sorry no better value that this "best guess"
            let min=this.min;
            let max=this.max;
            let factor=new Array(this.channels);
            for (let c of channels) {
                if (max[c]!==min[c]) {
                    factor[c]=(this.maxValue+1-delta)/(max[c]-min[c]);
                } else {
                    factor[c]=0;
                }
                min[c]+=((0.5-delta/2)/factor[c])
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
