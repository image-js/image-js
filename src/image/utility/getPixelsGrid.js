export default function getPixelsGrid({
    sampling = [10,10],
    painted = false,
    mask,
    format = 'xy z'
    } = {}) {

    this.checkProcessable('getPixelsGrid', {
        bitDepth: [8, 16],
        channels: 1
    });

    let toReturn = {};

    if (!Array.isArray(sampling)) sampling = [sampling,sampling];

    let xSampling = sampling[0];
    let ySampling = sampling[1];
    let nbSamples = xSampling * ySampling;

    let xyS = new Array(nbSamples);
    let zS = new Array(nbSamples);

    let xStep = this.width / xSampling;
    let yStep = this.height / ySampling;
    let currentX = Math.floor(xStep / 2);


    let position = 0;
    for (let i = 0; i < xSampling; i++) {
        let currentY = Math.floor(yStep / 2);
        for (let j = 0; j < ySampling; j++) {
            let x = Math.round(currentX);
            let y = Math.round(currentY);
            if (!mask || mask.getBitXY(x,y)) {
                xyS[position] = [x,y];
                zS[position] = this.getValueXY(x,y,0);
                position++;
            }
            currentY += yStep;
        }
        currentX += xStep;
    }

    xyS.length = position;
    zS.length = position;

    toReturn.xyS = xyS;
    toReturn.zS = zS;

    if (painted) {
        toReturn.painted = this.rgba8().paintPixels(xyS);
    }

    return toReturn;
}
