/* eslint-disable import/unambiguous */
/* eslint-env browser */

const possibleTreatments = {
  grey: (img) => img.convertColor(IJS.ImageKind.GREY),
  invert: (img) => {
    const inverted = img.invert();
    inverted.fillAlpha(255);
    return inverted;
  }
};

let fn = possibleTreatments.grey;

const app = document.getElementById('app');
const fps = document.getElementById('fps');

const selectDiv = document.createElement('div');
selectDiv.style.margin = '5px';

const select = document.createElement('select');
const options = Object.keys(possibleTreatments);
for (const option of options) {
  const opt = document.createElement('option');
  opt.value = option;
  opt.innerText = option;
  select.appendChild(opt);
}
select.addEventListener(
  'change',
  (event) => (fn = possibleTreatments[event.target.value])
);
selectDiv.appendChild(select);
app.appendChild(selectDiv);

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then(initializeStream, printError);
let canvas;
let video;
let frames = 0;
let start;
function initializeStream(mediaStream) {
  video = document.createElement('video');
  app.appendChild(video);
  video.srcObject = mediaStream;
  video.onloadedmetadata = () => {
    video.play();
    canvas = document.createElement('canvas');
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    app.appendChild(canvas);
    start = Date.now();
    requestAnimationFrame(treatment);
  };
}
function treatment() {
  canvas.getContext('2d').drawImage(video, 0, 0);
  const image = IJS.readCanvas(canvas);
  IJS.writeCanvas(canvas, fn(image));
  const framesPerSecond = frames++ / ((Date.now() - start) / 1000);
  if (frames === 1000) {
    start = Date.now();
    frames = 0;
  }
  fps.innerText = `${Math.round(framesPerSecond)} fps`;
  requestAnimationFrame(treatment);
}
function printError(e) {
  console.log(e);
  app.innerHTML = 'Please connect a camera and accept the video feed';
}
