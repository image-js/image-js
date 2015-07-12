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
            meanX: 0,
            meanY: 0,
            surface: 0,
            id: mapID
        }
    }
    var pixels=map.pixels;
    for (let x=0; x<this.width; x++) {
        for (let y=0; y<this.height; y++) {
            let target=y*this.width+x;
            let mapID=pixels[target]+map.negative;
            if (mapID>map.negative) mapID--;
            if (x<mapInfos[mapID].minX) mapInfos[mapID].minX=x;
            if (x>mapInfos[mapID].maxX) mapInfos[mapID].maxX=x;
            if (y<mapInfos[mapID].minY) mapInfos[mapID].minY=y;
            if (y>mapInfos[mapID].maxY) mapInfos[mapID].maxY=y;
            mapInfos[mapID].meanX+=x;
            mapInfos[mapID].meanY+=y;
            mapInfos[mapID].surface++;
        }
    }
    for (var i=0; i<size; i++) {
        let mapID=-map.negative+i;
        if (i>=map.negative) mapID++;
        mapInfos[i].meanX/=mapInfos[i].surface;
        mapInfos[i].meanY/=mapInfos[i].surface;
    }
    return mapInfos;
}
