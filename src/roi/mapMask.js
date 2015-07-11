'use strict';

import IJ from '../ij';

export default function mapMask({} = {}) {

    this.checkProcessable('mapMask', {
        bitDepth: [1]
    });

    // based on a binary image we will create plently of small images
    var pixels=new Int16Array(this.size); // maxValue: 32767, minValue: -32768

    // split will always return an array of images
    var positiveID=0;
    var negativeID=0;
    var self=this;


    for (let x=0; x<this.width; x++) {
        for (let y=0; y<this.height; y++) {
            if (pixels[y*this.width+x]===0) {
                // need to process the whole surface
                analyseSurface(x,y);
            }
        }
    }

    function analyseSurface(x,y) {
        let MAX_ARRAY=0x0ffff;
        let targetState=self.getBitXY(x,y);
        let id=targetState ? ++positiveID : --negativeID;
        let xToProcess=new Uint16Array(MAX_ARRAY+1); // assign dynamically ????
        let yToProcess=new Uint16Array(MAX_ARRAY+1);
        let from=0;
        let to=0;
        xToProcess[0]=x;
        yToProcess[0]=y;
        while(from<=to) {
            let currentX=xToProcess[from & MAX_ARRAY];
            let currentY=yToProcess[from & MAX_ARRAY];
            pixels[currentY*self.width+currentX]=id;
            // need to check all around this pixel
            if (currentX>0 && pixels[currentY*self.width+currentX-1]===0 &&
                self.getBitXY(currentX-1,currentY)==targetState) {
                    to++;
                    xToProcess[to & MAX_ARRAY]=currentX-1;
                    yToProcess[to & MAX_ARRAY]=currentY;
                    pixels[currentY*self.width+currentX-1]=-32765;
            }
            if (currentY>0 && pixels[(currentY-1)*self.width+currentX]===0 &&
                self.getBitXY(currentX,currentY-1)==targetState) {
                    to++;
                    xToProcess[to & MAX_ARRAY]=currentX;
                    yToProcess[to & MAX_ARRAY]=currentY-1;
                    pixels[(currentY-1)*self.width+currentX]=-32766;
            }
            if (currentX<self.width-1 && pixels[currentY*self.width+currentX+1]===0 &&
                self.getBitXY(currentX+1,currentY)==targetState) {
                    to++;
                    xToProcess[to & MAX_ARRAY]=currentX+1;
                    yToProcess[to & MAX_ARRAY]=currentY;
                    pixels[currentY*self.width+currentX+1]=-32767;
            }
            if (currentY<self.height-1 && pixels[(currentY+1)*self.width+currentX]===0 &&
                self.getBitXY(currentX,currentY+1)==targetState) {
                    to++;
                    xToProcess[to & MAX_ARRAY]=currentX;
                    yToProcess[to & MAX_ARRAY]=currentY+1;
                    pixels[(currentY+1)*self.width+currentX]=-32768;
            }
            from++;

            if ((to-from)>MAX_ARRAY) {
                throw new Error ("analyseMask can not finish, the array to manage internal data is not big enough." +
                "You could improve this by changing MAX_ARRAY");
            }
        }
    }

    return {
        pixels: pixels,
        negative: -negativeID,
        positive: positiveID,
        total: positiveID-negativeID
    };
}
