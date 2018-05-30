const electron = require('electron'),

    { ipcRenderer: ipc, remote } = electron,

    SvgParser = require('../services/svgParser');
    fileService = require('../services/fileService');

/*
document.getElementsByTagName('svg')[0].childNodes[0].transform.baseVal[0].matrix.a = 1

a:1
b:0
c:0
d:1
e:-425
f:-528
 */

document.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();



    let files = Array.from(e.dataTransfer.files).filter(file => isSVG(file));
    const path = files[0].path;
    handleFile(path);


});

document.addEventListener('dragover', e => {
    e.preventDefault();
    e.stopPropagation();



    console.log('File hover');
});



const isSVG = (file) => {
    return file.type.indexOf('image/svg+xml') !== -1;
};

const handleFile = (path) => {
    let appDiv = document.getElementById('workspace');
    const svgElement = fileService.getFileContent(path);
    appDiv.innerHTML = svgElement;

    let svgParser = new SvgParser(svgElement);
    let objectsArchitecture = svgParser.composeStructure();

    document.getElementById('objects-content').innerHTML = `
        <code> ${JSON.stringify(objectsArchitecture, null, 4)} </code>
    `;
}

ipc.on('open', (evt, path)=> {
    handleFile(path);
});