'use strict';

load('rgb8.png').then(function (a) {
    setLeft(a);

    var editor = ace.edit('editor');
    editor.$blockScrolling = Infinity;
    editor.getSession().on('change', execute);

    var oldCode = localStorage.getItem('ij-test-code');
    if (oldCode) {
        editor.setValue(oldCode, -1);
    }

    function execute() {
        var img = a.clone();
        var code = editor.getValue();

        localStorage.setItem('ij-test-code', code);

        try {
            eval(code);
        } catch (e) {
            console.warn('Error: ' + e.message);
        }
    }

    execute();
});
