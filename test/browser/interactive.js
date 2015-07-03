'use strict';

// load data from localStorage
var oldCode = localStorage.getItem('ij-test-code');
var oldImg = localStorage.getItem('ij-test-img') || 'rgb8.png';

var selectElement = $('#image-selector');
images.forEach(function (img) {
    var option = $('<option>' + img + '</option>').attr('value', img);
    if (img === oldImg) {
        option.attr('selected', 'selected');
    }

    selectElement.append(option);
});

selectElement.on('change', function () {
    var imgName = $(this).val();
    localStorage.setItem('ij-test-img', imgName);
    loadNewImage(imgName);
    execute();
});

var loading;
function loadNewImage(img) {
    loading = load(img).then(function (img) {
        setLeft(img);
        return img;
    });
}

$('#run-script').on('click', execute);

var editor = ace.edit('editor');
editor.$blockScrolling = Infinity;
editor.getSession().setMode('ace/mode/javascript');

editor.commands.addCommand({
    name: "run",
    bindKey: {win: "Ctrl-Return", mac: "Command-Return"},
    exec: execute
});

if (oldCode) {
    editor.setValue(oldCode, -1);
}

var error = $('#error');
var empty = new IJ(1, 1);

function execute() {
    loading.then(function (img) {
        img = img.clone();

        var code = editor.getValue();

        localStorage.setItem('ij-test-code', code);

        try {
            eval(code);
            error.text('');
        } catch (e) {
            var text = 'Error: ' + e.message;
            console.warn(text);
            error.text(text);
            setRight(empty);
        }
    });
}

loadNewImage(oldImg);
execute();
