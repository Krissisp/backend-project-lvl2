const { parsersYml } = require('./parsers.js');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const withoutСomparison = (ob, h) => {
  let predRes = '{';
  for(const podOb in ob) {
    if(typeof(ob[podOb]) !== 'object') {
      predRes += '\n' + ' '.repeat(h + 4) + `${podOb}: ${ob[podOb]}`;
    } else {
      predRes += '\n' + ' '.repeat(h) + `${podOb}: `;
      predRes += withoutСomparison(ob[podOb], h + 1);
    }
  }
  predRes += '\n' + ' '.repeat(h -1) + '}'
  return predRes;
};

const stringify = (value1, value2, replacer = ' ', space = 1) => {

  const iter = (ob1, ob2, depth = 0) => {
 
   let result = '{';
     
     for(const element in ob1) {
        if(typeof(ob1[element]) !== 'object' && _.has(ob2, `${element}`) && ob1[element] === ob2[element]) {
          result += '\n' + replacer.repeat(space * depth) + `    ${element}: ${ob1[element]}`; 
        } 

        if(typeof(ob1[element]) !== 'object' && !_.has(ob2, `${element}`)) {
          result += '\n' + replacer.repeat(space * depth) + `- ${element}: ${ob1[element]}`; 
        }

        if(typeof(ob1[element]) !== 'object' && _.has(ob2, `${element}`) && ob1[element] !== ob2[element]) {
          result += '\n' + replacer.repeat(space * depth) + `- ${element}: ${ob1[element]}`; 
          result += '\n' + replacer.repeat(space * depth) + `+ ${element}: ${ob2[element]}`;
        } 

        if(typeof(ob1[element]) === 'object' && !_.has(ob2, `${element}`)) {
          result += '\n'+ replacer.repeat(space * depth) + `- ${element}: `; 
          result += withoutСomparison(ob1[element], depth + 1);
        }

        if(typeof(ob1[element]) === 'object' && _.has(ob2, `${element}`) && typeof(ob2[element]) === 'object') {
          result += '\n'+ replacer.repeat(space * depth) + `  ${element}: `; 
          result += iter(ob1[element], ob2[element], depth + 1);
        }
         
      }
    for(const element2 in ob2){
      if(typeof(ob2[element2]) === 'object' && !_.has(ob1, `${element2}`)) {
        result += '\n'+ replacer.repeat(space * depth) + `+ ${element2}: `; 
        result += withoutСomparison(ob2[element2], depth + 1);
      }

      if(typeof(ob2[element2]) !== 'object' && !_.has(ob1, `${element2}`)) {
        result += '\n'+ replacer.repeat(space * depth) + `+ ${element2}: ${ob2[element2]}`; 
      }
    }
    
    result += '\n' + replacer.repeat(space * (depth -1)) + '}'
   return result;
  }
   return iter(value1, value2, 1)
 };
 

const genDiff = (filepath1, filepath2) => {
  const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
  const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
  const obj = readFile(filepath1);
  const obj2 = readFile(filepath2);
  let objJs;
  let obj2Js;
  if (path.extname(filepath1) === 'json' && path.extname(filepath2) === 'json'){
     objJs = JSON.parse(obj);
     obj2Js = JSON.parse(obj2);
  }

  if (path.extname(filepath1) !== 'json' && path.extname(filepath2) !== 'json'){
     objJs = parsersYml(obj);
     obj2Js = parsersYml(obj2);
  }
  const objFix = Object.entries(objJs).sort();
  const obj2Fix = Object.entries(obj2Js).sort();
  console.log('objFix', objFix)
  console.log('obj2Fix', obj2Fix)

  const comparison = stringify(objJs, obj2Js);
  return comparison;
};

module.exports = { genDiff, withoutСomparison, stringify};
