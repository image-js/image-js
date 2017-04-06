import convexHull from './monotoneChainConvexHull';

/*
Computes the minimum bounding box around a binary image
 https://www.researchgate.net/profile/Lennert_Den_Boer2/publication/303783472_A_Fast_Algorithm_for_Generating_a_Minimal_Bounding_Rectangle/links/5751a14108ae6807fafb2aa5.pdf
 */
export default function minimalBoundingRectangle() {
    const image = this;
    image.checkProcessable('minimalBoundingRectangle', {bitDepth: 1});

    const p = convexHull.call(this);

    // 1
    let aMin = Infinity;
    let tMin = 1;
    let tMax = 0;
    let sMax = 0;
    let j = 1;
    let k = 0;
    let l = -1;
    let nV = p.length;

    let r0, r1, r2, r3;
    let q;
    let mbr = [null, null, null, null];

    while (k < nV) {
        // 2
        let v = vectorDiff(p[j], p[k]);
        let r = 1 / scalarProduct(v, v);

        // 3
        for (; j < nV; j++) {
            let u = vectorDiff(p[j], p[k]);
            let t = scalarProduct(u, v) * r;
            let pt = vectorSum(vectorMul(v, t), p[k]);
            u = vectorDiff(pt, p[j]);
            let s = scalarProduct(u, u);
            if (t < tMin) {
                tMin = t;
                r0 = pt;
            }
            if (t > tMax) {
                tMax = t;
                r1 = pt;
            }
            if (s > sMax) {
                sMax = s;
                q = pt;
                l = j;
            }
        }

        // 4
        r2 = vectorDiff(vectorSum(r1, p[l]), q);

        // 5
        r3 = vectorDiff(vectorSum(r0, p[l]), q);

        // 6
        let u = vectorDiff(r1, r0);

        // 7
        let a = scalarProduct(u, u) * sMax;

        // 8
        if (a < aMin) {
            aMin = a;
            mbr = [r0, r1, r2, r3];
        }

        k = k + 1;
        j = k + 1;
        if (j === nV) {
            j = 0;
        }
    }

    return mbr;

}

function vectorDiff(a, b, r = [0, 0]) {
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    return r;
}

function vectorSum(a, b, r = [0, 0]) {
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    return r;
}

function vectorMul(a, s, r = [0, 0]) {
    r[0] = a[0] * s;
    r[1] = a[1] * s;
    return r;
}


function scalarProduct(a, b) {
    return a[0] * b[0] + a[1] * b[1];
}
