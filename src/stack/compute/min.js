export default function min(images) {

    // TODO check all the images are the same kind

    if (images.length===0) return;

    let min=images[0].min;
    for (let i=1; i<images.length; i++) {
        for (let j=0; j<min.length; j++) {
            min[j]=Math.min(min[j], images[i].min[j]);
        }
    }
    return min;
}
