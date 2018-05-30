
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


        this.composeStructure();
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
        tmpPath.push(elem.id ? elem.id : elem.tagName + '-' + counter[elem.tagName]++);

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

                this.setValueAtPath(this.structure[number], tmpPath, child.id ? child.id : child.tagName + '-' + counter[child.tagName]++);
            }
        }

    }

    getStructure() {
        return this.structure;
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