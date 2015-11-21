export default function getPixelsGrid({
    sampling = [10,10],
    painted = false,
    mask
    } = {}) {

    this.checkProcessable('getPixelsGrid', {
        bitDepth: [8, 16],
        channels: 1
    });

    if (!Array.isArray(sampling)) sampling = [sampling,sampling];

    const xSampling = sampling[0];
    const ySampling = sampling[1];
    const nbSamples = xSampling * ySampling;

    const xyS = new Array(nbSamples);
    const zS = new Array(nbSamples);

    const xStep = this.width / xSampling;
    const yStep = this.height / ySampling;
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

    // resize arrays if needed
    xyS.length = position;
    zS.length = position;

    let toReturn = {xyS, zS};

    if (painted) {
        toReturn.painted = this.rgba8().paintPixels(xyS);
    }

    return toReturn;
}
