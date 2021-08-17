
const fs = require('fs');
const path = require('path');

const genDiff = (filepath1, filepath2) => {
  const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
  const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
  let result = '{';
  const obj = readFile(filepath1);
  const obj2 = readFile(filepath2);
  const objJs = JSON.parse(obj);
  const obj2Js = JSON.parse(obj2);
  const objFix = Object.entries(objJs).sort();
  const obj2Fix = Object.entries(obj2Js).sort();
  const object = {};
  const object2 = {};
  for (const [key, value] of objFix) {
    object[key] = value;
  }

  for (const [key2, value2] of obj2Fix) {
    object2[key2] = value2;
  }

  for (const element in object) {
    if (object2.hasOwnProperty(element) && object2[element] === object[element]) {
      result += `\n   ${element}: ${object[element]}`;
    }

    if (object2.hasOwnProperty(element) && object2[element] !== object[element]) {
      result += `\n - ${element}: ${object[element]}`;
      result += `\n + ${element}: ${object2[element]}`;
    }

    if (!object2.hasOwnProperty(element)) {
      result += `\n - ${element}: ${object[element]}`;
    }
  }

  for (const element2 in object2) {
    if (!object.hasOwnProperty(element2)) {
      result += `\n + ${element2}: ${object2[element2]}`;
    }
  }
  result += '\n }';
  return result;
};

module.exports = { genDiff } ;
