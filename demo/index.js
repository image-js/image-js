'use strict';

const editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.session.setMode('ace/mode/javascript');

let image = null;

const fileInput = document.getElementById('file');
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const fileReader = new FileReader();
  fileReader.onload = (e) => {
    loadImage(e.target.result);
  };
  fileReader.readAsArrayBuffer(file);
});

const loadExampleButton = document.getElementById('loadExample');
loadExampleButton.addEventListener('click', async function loadExample() {
  const example = 'img/cyclopean_isles_sicily_italy.jpg';
  const req = await fetch(example);
  const data = await req.arrayBuffer();
  loadImage(data);
});

const doTreatmentButton = document.getElementById('doTreatment');
doTreatmentButton.addEventListener('click', function doTreatment() {
  const code = editor.getValue();
  const evaled = eval(`(${code})`);
  const result = evaled(image, IJS);
  setCanvas('result', result);
});

function loadImage(data) {
  image = IJS.decode(new Uint8Array(data));
  image = image.convertColor(IJS.ImageKind.RGB);
  setCanvas('image', image);
}

function setCanvas(id, image) {
  const canvas = document.getElementById(id);
  IJS.writeCanvas(canvas, image);
}
