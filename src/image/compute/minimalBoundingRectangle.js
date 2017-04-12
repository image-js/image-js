import convexHullFunction from './monotoneChainConvexHull';

/*
Computes the minimum bounding box around a binary image
 https://www.researchgate.net/profile/Lennert_Den_Boer2/publication/303783472_A_Fast_Algorithm_for_Generating_a_Minimal_Bounding_Rectangle/links/5751a14108ae6807fafb2aa5.pdf
 */
export default function minimalBoundingRectangle(options = {}) {

    const {
        originalPoints = convexHullFunction.call(this)
    } = options;

    const p = new Array(originalPoints.length);

    let minSurface = +Infinity;
    let minSurfaceAngle = 0;
    let mbr;


    for (let i = 0; i < p.length; i++) {
        let angle = getAngle(originalPoints[i], originalPoints[(i + 1) % p.length]);

        rotate(-angle, originalPoints, p);

        // console.log('Using the vector: ', originalPoints[i],  originalPoints[(i + 1) % p.length], 'angle', angle);
        // console.log('newPoints', p);

        // we rotate and translate so that this axe is in the bottom

        let aX = p[i][0];
        let aY = p[i][1];
        let bX = p[(i + 1) % p.length][0];
        let bY = p[(i + 1) % p.length][1];

        let tUndefined = true;
        let tMin = 0;
        let tMax = 0;
        let maxWidth = 0;
        for (let j = 0; j < p.length; j++) {
            let cX = p[j][0];
            let cY = p[j][1];
            let power = (bX - aX) ** 2 + (bY - aY) ** 2;
            let t = ((cX - aX) * (bX - aX) + (cY - aY) * (bY - aY)) / (power);
            if (tUndefined === true) {
                tUndefined = false;
                tMin = t;
                tMax = t;
            } else {
                if (t < tMin) tMin = t;
                if (t > tMax) tMax = t;
            }
            let width = Math.abs((bY - aY) * cX - (bX - aX) * cY + bX * aY - bY * aX) / power ** 0.5;
            if (width > maxWidth) maxWidth = width;
        }

        let pMin = [aX + tMin * (bX - aX), aY + tMin * (bY - aY)];
        let pMax = [aX + tMax * (bX - aX), aY + tMax * (bY - aY)];

        let currentSurface = maxWidth * getDistance(pMin, pMax);
        if (currentSurface < minSurface) {
            minSurfaceAngle = angle;
            minSurface = currentSurface;
            mbr = [
                pMin,
                pMax,
                [pMax[0], pMax[1] + maxWidth],
                [pMin[0], pMin[1] + maxWidth]
            ];
            // console.log('MIN SURFACE', angle, minSurface, mbr);
        }
    }
    rotate(minSurfaceAngle, mbr, mbr);
    return mbr;
}

function getDistance(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);

}

function getDiff(p1, p2) {
    return [p1[0] - p2[0], p1[1] - p2[1]];
}

// the angle that allows to make the line going through p1 and p2 horizontal
function getAngle(p1, p2) {
    let diff = getDiff(p2, p1);
    let vector = norm(diff);
    return Math.acos((vector[0]));
}


function norm(p) {
    let length = Math.sqrt(p[0] ** 2 + p[1] ** 2);
    return [p[0] / length, p[1] / length];

}

function rotate(radians, srcPoints, destPoints) {
    let cos = Math.cos(radians);
    let sin = Math.sin(radians);
    for (let i = 0; i < destPoints.length; ++i) {
        destPoints[i] = [
            cos * srcPoints[i][0] - sin * srcPoints[i][1],
            sin * srcPoints[i][0] + cos * srcPoints[i][1]
        ];
    }
}
