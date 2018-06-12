
const svgElements = ['path', 'circle', 'line', 'ellipse', 'polygon', 'text', 'image'];
let counter = {
    svg: 1,
    path: 1,
    g: 1,
    circle: 1,
    line: 1,
    ellipse: 1,
    polygon: 1,
    text: 1
};

class SvgParser {

    constructor(svg) {

        this.svg = new DOMParser().parseFromString(svg, 'text/xml');
        this.structure = [{}];
        this.htmlStructure = "";
        this.elementsIds = [];


        this.composeStructure();
        this.fillHtmlStructure([0]);
    }

    composeStructure() {

        let svgs = Array.from(this.svg.childNodes).filter(el => el.tagName === 'svg');
        svgs.forEach((svg, index) => {
            this.fillStructure(svg, index);
        });
    }

    getElementAtPath(path, arr) {

        let tmp = arr[path[0]];

        if(path.length === 1)
            return tmp;

        return this.getElementAtPath(path.slice(1), tmp);
    }

    setValueAtPath(obj, path, value = '0') {

        if(path.length === 1) {
            if(!obj[path[0]]) {
                obj[path[0]] = [];
            }
            obj[path[0]].push(value);
            return;
        }

        if(!obj[path[0]])
            obj[path[0]] = {};

        return this.setValueAtPath(obj[path[0]], path.slice(1), value);
    }

    fillStructure(elem, number, path = []) {

        let tmpPath = path.filter(e => svgElements.indexOf(e) === -1);

        let elemId = this.assignId(elem);

        tmpPath.push(elemId);

        for(let child of elem.childNodes) {
            if(child.tagName === 'g') {

                if(svgElements.indexOf(tmpPath[tmpPath.length - 1]) !== -1) {
                    tmpPath = tmpPath.splice(0, tmpPath.length - 1)
                }

                if(tmpPath[tmpPath.length -1] !== 'g')
                    tmpPath.push('g');

                this.fillStructure(child, number, tmpPath);
            } else if(svgElements.indexOf(child.tagName) !== -1) {

                if(svgElements.indexOf(tmpPath[tmpPath.length - 1]) !== -1)
                    tmpPath = tmpPath.slice(0, tmpPath.length -1);

                    tmpPath.push(child.tagName);

                    let value = this.assignId(child);


                this.setValueAtPath(this.structure[number], tmpPath, value);
            }
        }

    }

    fillHtmlStructure(path) {
        let elems;

        try {
            elems = Object.keys(this.getElementAtPath(path, this.structure));
        } catch(e) {
            console.error(path);
        }

        let visible = path.length === 1 ? 'show' : 'hidden';
        let newPath = path;

        for(let el of elems) {

            if(svgElements.indexOf(el) === -1 && el != 'g') {

                this.htmlStructure += `
                    <div class="${visible} group">
                        <div class="group-props">
                            <p class="name">${el}</p>
                            <svg viewBox="0 0 20 20" class="arrow arrow-down">
                                <path d="M0 0 L10 10 L0 20"></path>
                            </svg>
                        </div>      
                `;

                newPath.push(el);


                this.fillHtmlStructure(newPath);

                if(elems.length > 1) {
                    newPath.splice(newPath.indexOf(el), newPath.length);
                }

                this.htmlStructure += "</div>";

            } else if(svgElements.indexOf(el) !== -1) {
                this.htmlStructure += `
                    <div class="hidden group-objects">
                `;
                newPath.push(el);

                Object.values(this.getElementAtPath(newPath, this.structure)).forEach(fin => {
                    this.htmlStructure += `
                        <p class="name">${fin}</p>
                    `
                });
                this.htmlStructure += `
                    </div>
                `;
                newPath.pop();
            } else {
                newPath.push(el);
                this.fillHtmlStructure(newPath);
            }



        };


    }

    getHTML() {
        return this.htmlStructure;
    }

    getStructure() {
        return this.structure;
    }

    createRandomId(tag) {
        return tag + "-" + this.random() + "" + this.random() + "" + this.random() + "" + this.random() + "" + this.random() + "" + this.random() + "" + this.random();

    }

    random() {
        if(Math.random() > 0.5) {
            return String.fromCharCode(Math.floor(Math.random() * (91 - 65) + 65));
        } else {
            return String.fromCharCode(Math.floor(Math.random() * (123 - 97) + 97));
        }
    }

    assignId(node) {
        let value;

        if(node.id && this.elementsIds.indexOf(node.id) === -1) {
            value = node.id;
            this.elementsIds.push(node.id);
        } else {
            while(value === undefined || this.elementsIds.indexOf(value) !== -1) {
                value = this.createRandomId(node.tagName);
            }
            node.id = value;
            this.elementsIds.push(value);
        }

        return value;
    }

    getSVG() {
        return new XMLSerializer().serializeToString(this.svg);
    }


    /*
        structure = {
            path: [],
            g: [{
            page: {
                path: [],
                g: [{
                     person: {
                        path: [face],
                        g: [{
                                eye-left: {
                                    path: [inside, outside],
                                    g: []
                            },
                            {
                                eye-right: {
                                    path: [inside, outside],
                                    g: []
                                }
                            }
                        }]
                     }
                }]
            }]
        }
     */


}

module.exports = SvgParser;