
// returns an array with the average value of each component

export default function average() {
    let result=this.sum;
    for (let c=0; c<result.length; c++) {
        result[c]/=this.size;
    }
    return result;
}
