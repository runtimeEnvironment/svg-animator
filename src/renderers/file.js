const electron = require('electron'),

    { ipcRenderer: ipc, remote } = electron,

    {$} = require('./dom');
    SvgParser = require('../services/svgParser'),
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
    let appDiv = $('#workspace');
    const svgElement = fileService.getFileContent(path);
    appDiv.innerHTML = svgElement;

    let svgParser = new SvgParser(svgElement);
    let objectsArchitecture = svgParser.getHTML();

    $('#objects-content').innerHTML = objectsArchitecture;
    arrowClick();
};

ipc.on('open', (evt, path)=> {
    handleFile(path);
});

const arrowClick = () => {
    document.querySelectorAll('.arrow').forEach(arrow => {

        arrow.addEventListener('click', function (e) {
            e.preventDefault();

            const parent = this.parentNode;
            const parentOfParent = parent.parentNode;
            const children = parentOfParent.childNodes;


            const classList = Array.from(this.classList);

            if(classList.indexOf('arrow-down') !== -1) {
                this.classList.remove('arrow-down');
                this.classList.add('arrow-left');

                children.forEach(child => {
                    if('classList' in child) {
                        console.log(child);
                        if(child.classList.contains('hidden')) {
                            child.classList.remove('hidden');
                            child.classList.add('show');
                        }
                    }
                });
            } else {
                this.classList.remove('arrow-left');
                this.classList.add('arrow-down');

                children.forEach(child => {
                    if('classList' in child) {
                        if(child.classList.contains('show')) {
                            child.classList.remove('show');
                            child.classList.add('hidden');
                        }
                    }
                });
            }

        });

    });
};