
// returns an array with the average value of each component

export default function average() {
    let result=new Array(this.channels);
    for (let c=0; c<result.length; c++) {
        result[c]=this.sum[c]/this.size;
    }
    return result;
}
