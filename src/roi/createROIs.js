'use strict';

import IJ from '../ij';


export default function createROIs({
        positive=true,
        negative=true,
        minSurface=0,
        maxSurface=Number.POSITIVE_INFINITY
    } = {}) {

    this.checkProcessable('mark', {
        bitDepth: [1]
    });

    var maskInfo=this.mapMask();
    var pixels=maskInfo.pixels;
    var rois=this.mapInfo(maskInfo);

    var images=new Array(rois.length);
    var ptr=0;
    for (let i=0; i<rois.length; i++) {
        let roi=rois[i];
        if (((roi.id<0 && negative) || roi.id>0 && positive)
            && roi.surface>minSurface
            && roi.surface<maxSurface) {

            let width = roi.maxX - roi.minX + 1;
            let height = roi.maxY - roi.minY + 1;
            let img = new IJ(width, height, {
                kind: 'BINARY',
                position: [roi.minX, roi.minY]
            });
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    if (pixels[x + roi.minX + (y + roi.minY) * this.width] === roi.id) img.setBitXY(x, y);
                }
            }
            images[ptr++] = img;
        }
    }
    images.length=ptr;
    return images;
}
