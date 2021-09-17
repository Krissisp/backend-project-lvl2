const { parsersYml } = require('./parsers.cjs');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const {formatChoice} = require('./formaters/index')

const withOutComparison = (arr) => {
  let predresult = [];
  for(const element in arr) {
    if(typeof(arr[element]) !== 'object') {
      predresult.push([' ', element, arr[element]]);
    }
    if(typeof(arr[element]) === 'object') {
      predresult.push([' ', element, withOutComparison(arr[element])]);
    }
  }
  return predresult
}

const isObject = (value) => {
  if (typeof value !== 'object') {
    return false
  }
  if (value === null) {
    return false
  }
  return true
}

const createDiff = (object1, object2) => {
  const mergeObject = {...object1, ...object2};
  const mergeObjectSort = Object.entries(mergeObject).sort();
  return mergeObjectSort.reduce((acc, keyValue ) => { 
    if(!_.has(object1, `${keyValue[0]}`) && _.has(object2, `${keyValue[0]}`)) {
      if(!isObject(object2[keyValue[0]])) {
        acc.push(['+', keyValue[0], object2[keyValue[0]]]);
      } 
      if(isObject(object2[keyValue[0]])) {
        acc.push(['+', keyValue[0], withOutComparison(object2[keyValue[0]])])
      }
    }
    if(_.has(object1, `${keyValue[0]}`) && !_.has(object2, `${keyValue[0]}`)) {
      if(!isObject(object1[keyValue[0]])) {
        acc.push(['-', keyValue[0], object1[keyValue[0]]]);
      } 
      if(isObject(object1[keyValue[0]])) {
        acc.push(['-', keyValue[0], withOutComparison(object1[keyValue[0]])])
      }
    }
    if(_.has(object1, `${keyValue[0]}`) && _.has(object2, `${keyValue[0]}`)) {
      if(!isObject(object1[keyValue[0]]) && !isObject(object2[keyValue[0]]) && object2[keyValue[0]] !== object1[keyValue[0]]) {
        acc.push(['-', keyValue[0], object1[keyValue[0]]]);
        acc.push(['+', keyValue[0], object2[keyValue[0]]]);
      }
      if(!isObject(object1[keyValue[0]])&& !isObject(object2[keyValue[0]]) && object2[keyValue[0]] === object1[keyValue[0]]) {
        acc.push([' ', keyValue[0], object1[keyValue[0]]]);
      }
      if(isObject(object1[keyValue[0]])&& !isObject(object2[keyValue[0]])) {
        acc.push(['-', keyValue[0], withOutComparison(object1[keyValue[0]])]);
        acc.push(['+', keyValue[0], object2[keyValue[0]]]);
      }
      if(!isObject(object1[keyValue[0]])&& isObject(object2[keyValue[0]])) {
        acc.push(['-', keyValue[0], object1[keyValue[0]]]);
        acc.push(['+', keyValue[0], withOutComparison(object2[keyValue[0]])]);
      }
      if(isObject(object1[keyValue[0]])&& isObject(object2[keyValue[0]])) {
        acc.push([' ', keyValue[0], createDiff(object1[keyValue[0]], object2[keyValue[0]])]);
      }  
    }
  return acc;
  }, [])
};

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
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
  const diffArray = createDiff(objJs, obj2Js);
  return formatChoice(formatName, diffArray);   
};
     
module.exports = { genDiff, createDiff, withOutComparison}