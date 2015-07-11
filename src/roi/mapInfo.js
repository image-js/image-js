'use strict';

import IJ from '../ij';


export default function mapInfo(map, {} = {}) {

    this.checkProcessable('mapInfo', {
        bitDepth: [1]
    });


    var size=map.total;
    var mapInfos=new Array(size);
    for (var i=0; i<size; i++) {
        let mapID=-map.negative+i;
        if (i>=map.negative) mapID++;
        mapInfos[i]={
            minX: Number.POSITIVE_INFINITY,
            maxX: Number.NEGATIVE_INFINITY,
            minY: Number.POSITIVE_INFINITY,
            maxY: Number.NEGATIVE_INFINITY,
            surface: 0,
            id: mapID
        }
    }
    var pixels=map.pixels;
    for (let x=0; x<this.width; x++) {
        for (let y=0; y<this.height; y++) {
            let target=y*this.width+x;
            let mspID=pixels[target]+map.negative;
            if (mspID>map.negative) mspID--;
            if (x<mapInfos[mspID].minX) mapInfos[mspID].minX=x;
            if (x>mapInfos[mspID].maxX) mapInfos[mspID].maxX=x;
            if (y<mapInfos[mspID].minY) mapInfos[mspID].minY=y;
            if (y>mapInfos[mspID].maxY) mapInfos[mspID].maxY=y;
            mapInfos[mspID].surface++;
        }
    }
    return mapInfos;
}
