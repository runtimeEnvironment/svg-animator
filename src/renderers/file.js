const electron = require('electron'),

    { ipcRenderer: ipc, remote } = electron,

    {$} = require('./dom');
    SvgParser = require('../services/svgParser'),
    fileService = require('../services/fileService');

let defaults = {};
let highlightColor = 'blue';
let selected = null;
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



});



const isSVG = (file) => {
    return file.type.indexOf('image/svg+xml') !== -1;
};

const handleFile = (path) => {
    let appDiv = $('#workspace');
    const svgElement = fileService.getFileContent(path);


    let svgParser = new SvgParser(svgElement);
    appDiv.innerHTML = svgParser.getSVG();
    let objectsArchitecture = svgParser.getHTML();

    $('#objects-content').innerHTML = objectsArchitecture;
    arrowClick();
    highlight();
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

const highlight = () => {
    document.querySelectorAll('.name').forEach(name => {
        name.addEventListener('click', function () {
            if(this.style.background !== highlightColor) {
                this.style.background = highlightColor;

                let id = "#" + this.innerHTML.trim();
                const node = $(id);

                defaults[id] = {};
                defaults[id]['stroke'] = node.style.stroke;
                defaults[id]['strokeWidth'] = node.style.strokeWidth;
                defaults[id]['fill'] = node.style.fill;

                node.style.stroke = 'blue';
                node.style.strokeWidth = '3px';
                node.style.fill = '#ADD8E6';

                if(selected)
                    restoreDefaults(selected);

                selected = this;


            } else {
                restoreDefaults(this);
            }

        });
    });
};

const restoreDefaults = (p) => {
    p.style.background = 'none';

    let id = "#" + p.innerHTML.trim();
    const node = $(id);

    node.style.stroke = defaults[id]['stroke'];
    node.style.strokeWidth = defaults[id]['strokeWidth'];
    node.style.fill = defaults[id]['fill'];
};