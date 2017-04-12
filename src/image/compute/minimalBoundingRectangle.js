import convexHull from './monotoneChainConvexHull';

/*
Computes the minimum bounding box around a binary image
 https://www.researchgate.net/profile/Lennert_Den_Boer2/publication/303783472_A_Fast_Algorithm_for_Generating_a_Minimal_Bounding_Rectangle/links/5751a14108ae6807fafb2aa5.pdf
 */
export default function minimalBoundingRectangle() {
    const image = this;
    image.checkProcessable('minimalBoundingRectangle', {bitDepth: 1});

    const p = convexHull.call(this);

    let minSurface = +Infinity;
    let mbr;
    console.log(p);
    for (let i = 0; i < p.length; i++) {
        let aX = p[i][0];
        let aY = p[i][1];
        let bX = p[(i+1)%p.length][0];
        let bY = p[(i+1)%p.length][1];

        console.log('Vector', aX, aY, bX, bY);

        let tUndefined=true;
        let tMin=0;
        let tMax=0;
        let maxWidth = 0;
        for (let j = 0; j < p.length; j++) {
            let cX = p[j][0];
            let cY = p[j][1];
      //      console.log('c',cX,cY);
            let power=(bX-aX)**2+(bY-aY)**2;
            let t=((cX-aX)*(bX-aX)+(cY-aY)*(bY-aY))/(power);
            if (tUndefined===true) {
                tUndefined=false;
                tMin=t;
                tMax=t;
            } else {
                if (t<tMin) tMin=t;
                if (t>tMax) tMax=t;
            }
//console.log('t=',t);
            let width=Math.abs((bY - aY) * cX - (bX - aX) * cY + bX * aY - bY * aX) / power**0.5;
            if (width > maxWidth) maxWidth=width;
        }

        let pMin=[aX+tMin*(bX-aX), aY+tMin*(bY-aY)];
        let pMax=[aX+tMax*(bX-aX), aY+tMax*(bY-aY)];

        let currentSurface = maxWidth * getDistance(pMin, pMax);
    //    console.log(maxWidth, pMin, pMax, getDistance(pMin, pMax), currentSurface);
        if (currentSurface < minSurface) {

            minSurface=currentSurface;
            mbr = [
                pMin,
                pMax,
                [],
                []
            ];
            console.log('MIN SURFACE', minSurface, mbr);
        }
    }
    return mbr;
}

function getDistance(p1, p2) {
    return Math.sqrt( (p1[0]-p2[0])**2 + (p1[1]-p2[1])**2 );

}