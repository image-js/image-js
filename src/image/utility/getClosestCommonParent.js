/**
 * Finds common parent between two different masks
 * @memberof Image
 * @instance
 * @param {Image} mask - a mask (1 bit image)
 * @return {Image} - the lowest common parent of both masks
 */
export default function getClosestCommonParent(mask) {
  let depthMask1 = getDepth(this);
  let depthMask2 = getDepth(mask);

  let furthestParent;
  if (depthMask1 >= depthMask2) {
    furthestParent = getFurthestParent(this, depthMask1);
  } else {
    furthestParent = getFurthestParent(mask, depthMask2);
  }

  if (depthMask1 === 0 || depthMask2 === 0) {
    // comparing with at least one original image -> no common parent
    return furthestParent;
  }
  let m1 = this;
  let m2 = mask;

  while (depthMask1 !== depthMask2) {
    if (depthMask1 > depthMask2) {
      m1 = m1.parent;
      if (m1 === null) {
        return furthestParent;
      }
      depthMask1 = depthMask1 - 1;
    } else {
      m2 = m2.parent;
      if (m2 === null) {
        return furthestParent;
      }
      depthMask2 = depthMask2 - 1;
    }
  }

  while (m1 !== m2 && m1 !== null && m2 !== null) {
    m1 = m1.parent;
    m2 = m2.parent;
    if (m1 === null || m2 === null) {
      return furthestParent;
    }
  }

  // TODO
  // no common parent, use parent at top of hierarchy of m1
  // we assume it works for now
  if (m1 !== m2) {
    return furthestParent;
  }

  return m1;
}

/**
 * Find the depth of the mask with respect to its arborescence.
 * Helper function to find the common parent between two masks.
 * @param {Image} mask - a mask (1 bit Image)
 * @return {number} - depth of mask
 * @private
 */
function getDepth(mask) {
  let d = 0;
  let m = mask;
  // a null parent means it's the original image
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
