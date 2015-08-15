/**
 * Created by Cristian on 17/07/2015.
 */
export default function edgeHandlingMethod(newImage, method, k){
    method = method || 'copy';
    for(let x = 0; x < this.width; x++){
        for(let y = 0; y <= k; y++){
            newImage.setValueXY(x, y, 0, method.toLowerCase() === 'black' ? 0 : this.getValueXY(x, y, 0));
            newImage.setValueXY(x, y, 1, this.getValueXY(x, y, 1));
        }
        for(let y = this.height-k; y < this.height; y++){
            newImage.setValueXY(x, y, 0, method.toLowerCase() === 'black' ? 0 : this.getValueXY(x, y, 0));
            newImage.setValueXY(x, y, 1, this.getValueXY(x, y, 1));
        }
    }
    for(let x = 0; x < this.height; x++){
        for(let y = 0; y <= k; y++){
            newImage.setValueXY(y, x, 0, method.toLowerCase() === 'black' ? 0 : this.getValueXY(y, x, 0));
            newImage.setValueXY(y, x, 1, this.getValueXY(y, x, 1));
        }
        for(let y = this.width-k; y < this.width; y++){
            newImage.setValueXY(y, x, 0, method.toLowerCase() === 'black' ? 0 : this.getValueXY(y, x, 0));
            newImage.setValueXY(y, x, 1, this.getValueXY(y, x, 1));
        }
    }
}
