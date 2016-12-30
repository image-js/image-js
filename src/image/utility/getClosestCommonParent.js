/**
 * Finds common parent between two different masks
 * @param {Image} - a mask (1 bit image)
 * @param {Image} - a mask (1 bit image)
 * @returns {Image} - the lowest common parent of both masks or throws error if no common parent
 */
export default function getClosestCommonParent(mask1, mask2) {

    let depthMask1 = getDepth(mask1);
    let depthMask2 = getDepth(mask2);

    let furthestParent;
    if(depthMask1 >= depthMask2){
        furthestParent = getFurthestParent(mask1, depthMask1);
    }else{
        furthestParent = getFurthestParent(mask2, depthMask2);
    }

    if (depthMask1 === 0 || depthMask2 === 0) {
        //comparing with at least one original image -> no common parent
        return furthestParent;
    }
    let m1 = mask1;
    let m2 = mask2;



    while (depthMask1 !== depthMask2) {
        if (depthMask1 > depthMask2) {
            m1 = m1.parent;
            if (m1 === undefined) {
                return furthestParent;
            }
            depthMask1 = depthMask1 - 1;
        } else {
            m2 = m2.parent;
            if (m2 === undefined) {
                return furthestParent;
            }
            depthMask2 = depthMask2 - 1;
        }
    }

    while (m1 !== m2 && typeof m1 !== undefined && typeof  m2 !== undefined) {
        m1 = m1.parent;
        m2 = m2.parent;
        if (m1 === undefined || m2 === undefined) {
            return furthestParent;
        }
    }

    //TODO
    //no common parent, use parent at top of hierarchy of m1
    //we assume it works for now
    if (m1 !== m2) {
       return furthestParent;
    }

    return m1;
}

/**
 * Find the depth of the mask with respect to its arborescence.
 * Helper function to find the common parent between two masks.
 * @param {Image} - a mask (1 bit Image)
 * @return {number} - depth of mask
 */
function getDepth(mask) {
    let d = 0;
    let m = mask;
    //a null parent means it's the original image
    while (m.parent != null) {
        m = m.parent;
        d++;
    }
    return d;
}

function getFurthestParent(mask, depth) {
    let m = mask;
    while (depth > 0) {
        m = m.parent;
        depth = depth - 1;
    }
    return m;
}

