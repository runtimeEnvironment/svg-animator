const fs = require('fs');

exports.getFileContent = (path) => {
    return fs.readFileSync(path, {encoding: 'utf-8'});
};