import getClosestCommonParent from "./getClosestCommonParent";
/**
 * Find intersection of points between two different masks
 * @param mask1
 * @param mask2
 */
export default function getIntersection(mask1, mask2){

    let parent = getClosestCommonParent(mask1,mask2);
    let startPos1 = mask1.getRelativePosition(parent);
    let endPos1 = [startPos1[0] + (mask1.height-1), startPos1[1] + (mask1.width-1)];
    let startPos2 = mask2.getRelativePosition(parent);
    let endPos2 = [startPos2[0] + (mask2.height-1), startPos2[1] + (mask2.width-1)];


}