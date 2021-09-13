const { parsersYml } = require('./parsers.js');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const withOutComparison = (ob) => {
  let predresult = {}
  for(const element in ob) {
    
    if(typeof(ob[element]) !== 'object') {
      predresult['  ' + element] = ob[element];
    }
    if(typeof(ob[element]) === 'object') {
      predresult['  ' + element] = withOutComparison(ob[element]);
    }
  }
  return predresult
}


const createDiff = (object1, object2) => {
    const mergeObject = {...object1, ...object2};
    const mergeObjectSort = Object.entries(mergeObject).sort();
    return mergeObjectSort.reduce((acc, keyValue ) => { 
        if(!_.has(object1, `${keyValue[0]}`) && _.has(object2, `${keyValue[0]}`)) {
          if(typeof(object2[keyValue[0]]) !== 'object') {
            acc['+ ' + keyValue[0]] = object2[keyValue[0]];
          } 
          if(typeof(object2[keyValue[0]]) === 'object') {
            acc['+ ' + keyValue[0]] = withOutComparison(object2[keyValue[0]])
          }
        }
        if(_.has(object1, `${keyValue[0]}`) && !_.has(object2, `${keyValue[0]}`)) {
          if(typeof(object1[keyValue[0]]) !== 'object') {
            acc['- ' + keyValue[0]] = object1[keyValue[0]];
          } 
          if(typeof(object1[keyValue[0]]) === 'object') {
            acc['- ' + keyValue[0]] = withOutComparison(object1[keyValue[0]])
          }
        }
        if(_.has(object1, `${keyValue[0]}`) && _.has(object2, `${keyValue[0]}`)) {
           if(typeof(object1[keyValue[0]]) !== 'object' && typeof(object2[keyValue[0]]) !== 'object' && object2[keyValue[0]] !== object1[keyValue[0]]) {
               acc['- ' + keyValue[0]] = object1[keyValue[0]];
               acc['+ ' + keyValue[0]] = object2[keyValue[0]];
           }
           if(typeof(object1[keyValue[0]]) !== 'object' && typeof(object2[keyValue[0]]) !== 'object' && object2[keyValue[0]] === object1[keyValue[0]]) {
               acc['  ' + keyValue[0]] = object1[keyValue[0]];
           }
           if(typeof(object1[keyValue[0]]) === 'object' && typeof(object2[keyValue[0]]) !== 'object') {
               acc['- ' + keyValue[0]] = withOutComparison(object1[keyValue[0]]);
               acc['+ ' + keyValue[0]] = object2[keyValue[0]];
           }
           if(typeof(object1[keyValue[0]]) !== 'object' && typeof(object2[keyValue[0]]) === 'object') {
               acc['- ' + keyValue[0]] = object1[keyValue[0]];
               acc['+ ' + keyValue[0]] = withOutComparison(object2[keyValue[0]]);
           }
           if(typeof(object1[keyValue[0]]) === 'object' && typeof(object2[keyValue[0]]) === 'object' ) {
              acc['  ' + keyValue[0]] = createDiff(object1[keyValue[0]], object2[keyValue[0]]);
           }
        }
        return acc;
     }, {})
    
}

const stylish = (value, replacer = ' ', space = 1) => {

 const iter = (object, num) => {
  let result = '{';
   if(typeof(object) === 'object') {
    for(const element in object) {
        result += '\n'+ replacer.repeat(num) + `${element}: `
       if(typeof(object[element]) !== 'object') {
         result += `${object[element]}`; 
       } 
       if(typeof(object[element]) === 'object') {
         result += iter(object[element], num + 4);
       }
     }
  }

  result += '\n' + replacer.repeat(num - space) + '}';
  return result;
 }
  return iter(value, space)
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
  
    const diffObject = createDiff(objJs, obj2Js);
    return stylish(diffObject, ' ', 2);
    
  };
  
  module.exports = { genDiff, createDiff, withOutComparison };