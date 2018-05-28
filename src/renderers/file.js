const electron = require('electron'),

    { ipcRenderer: ipc } = electron,

    fileService = require('../services/fileService');

document.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();

    let appDiv = document.getElementById('app');

    console.log(e.dataTransfer.files[0]);
    let text = '<p> Files dropped: <p>';
    let files = Array.from(e.dataTransfer.files).filter(file => isSVG(file));
    for(let f of files) {
        text += `<p> ${f.path} </p>`;
    }

    appDiv.innerHTML = fileService.getFileContent(files[0].path);

});

document.addEventListener('dragover', e => {
    e.preventDefault();
    e.stopPropagation();

    document.getElementsByTagName('h1')[0].innerHTML = "Drop here";

    console.log('File hover');
});

const isSVG = (file) => {
    return file.type.indexOf('image/svg+xml') !== -1;
};