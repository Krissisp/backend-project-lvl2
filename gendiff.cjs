const program  = require('commander');
const fs = require('fs');
const path = require('path');
program
.version('0.0.1')
.description('Compares two configuration files and shows a difference')
.argument('<filepath1>', 'path to file1')
.argument('<filepath2>', 'path to file2')
.option('-f, --format [type]', 'output format')
.action(function genDiff(filepath1, filepath2) {
    let result = '{';
    const obj = fs.readFileSync(path.resolve(filepath1), 'utf-8');
    const obj2 = fs.readFileSync(path.resolve(filepath2), 'utf-8');
    const objJs = JSON.parse(obj);
    const obj2Js = JSON.parse(obj2);
    const objFix = Object.entries(objJs).sort();
    const obj2Fix = Object.entries(obj2Js).sort();
    let object = {};
    let object2 = {};
    for (const [key, value] of objFix) {
        object[key] = value;
    }

    for (const [key2, value2] of obj2Fix) {
        object2[key2] = value2;
    }

    for(const element in object) {
        if(object2.hasOwnProperty(element) && object2[element] === object[element] ) {
            result += `\n   ${element}: ${object[element]}`;
        }
        
        if(object2.hasOwnProperty(element) && object2[element] !== object[element] ) {
            result += `\n - ${element}: ${object[element]}`;
            result += `\n + ${element}: ${object2[element]}`;
        }

        if(!object2.hasOwnProperty(element)) {
            result += `\n - ${element}: ${object[element]}`;
        }
    }

    for(const element2 in object2) {
        if(!object.hasOwnProperty(element2)) {
            result += `\n + ${element2}: ${object2[element2]}`;
        }
    }
    result += '\n }';

    console.log(result);
});
program.parse(process.argv);

