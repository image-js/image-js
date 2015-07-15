import IJ from '../ij';

export default function gaussian_filter(n, sigma){
	var cols = this.width;
	var new_img = this.clone();
	var kernel = get_gaussian_kernel(n, sigma);
	var temp = cols*n; //variable for checking the image border
	for(var p = cols*n+n; p < this.data.length - cols*n; p++){
		if(p == temp+cols-n){
			p += 2*n - 1;
		}else{
			new_img.data[p] = convolution(p, this.data, kernel);
		}
	}
}

function get_gaussian_kernel(n, sigma){
	var kernel = [];
	var sigma2 = 2*(sigma*sigma);//2*sigma^2
	var sum = 0;
	for(var y = -n; y <= n; y++){
		for(var x = -n; x <= n; x++){
			var value = -((x*x) + (y*y))/sigma2;
			value = Math.pow(Math.E, value);
			sum += value;
			kernel.push(value);
		}
	}

	for(var i = 0; i < kernel.length; i++){
		kernel[i] /= sum;
	}
	return kernel;
}

function convolution(p, data, kernel){
	var result = 0;
	var n = (int)(Math.sqrt(kernel.length) - 1)/2;
	var neighbors = get_neighbors(data, this.width, p, n);

	var j = -(kernel.length-1);
	for(var i = 0; i < kernel.length; i++){
		result = kernel[i]*neighbors[j];
		j--;
	}
	return result;
}

function get_neighbors(data, cols, p, n){
	var neighbors = [];

	for(var i = -n; i <= n; i++){
		for(var k = -n; k <= n; k++){
			neighbors.push(data[p+(i*cols)+k]);
		}
	}
	return neighbors;
}
