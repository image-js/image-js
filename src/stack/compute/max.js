export default function max(images) {

    // TODO check all the images are the same kind

    if (images.length===0) return;

    let max=images[0].max;
    for (let i=1; i<images.length; i++) {
        for (let j=0; j<max.length; j++) {
            max[j]=Math.max(max[j], images[i].max[j]);
        }
    }
    return max;
}
