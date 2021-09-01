const { parsersYml } = require('./parsers.js');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');


const withoutСomparison = (ob, h = 1, space) => {
  let predRes = '{';
  for(const podOb in ob) {
    if(typeof(ob[podOb]) !== 'object') {
      predRes += '\n' + ' '.repeat(h * space + 4) + `${podOb}: ${ob[podOb]}`;
    } else {
      predRes += '\n' + ' '.repeat(h * space + 4) + `${podOb}: `;
      predRes += withoutСomparison(ob[podOb], h + 1, space);
    }
  }
  predRes += '\n' + ' '.repeat(space * h) + '}'
  return predRes;
};

const getOperator = (ob, ob1, key) => {
  if(_.has(ob, `${key}`) && _.has(ob1, `${key}`)) {
    return ' ';
  }
  if(!_.has(ob, `${key}`) && _.has(ob1, `${key}`)) {
    return '+';
  } 
  return '-';
};

const getValue = (ob, ob1, key) => {

  if(!_.has(ob, `${key}`) && _.has(ob1, `${key}`)) {
     return `${ob1[key]}`; 
  } 
  if(_.has(ob, `${key}`) && !_.has(ob1, `${key}`)) {
    return `${ob[key]}`; 
  }
 
  return `${ob[key]}`; 
};

const getValueObject = (ob, ob1, key, depth = 1,  space = 1) => {
  if(_.has(ob, `${key}`) && _.has(ob1, `${key}`)) { 
    return  iter(ob[key], ob1[key], depth + 1, space) + '\n' + ' '.repeat(space * (depth +1)) + '}';
  }
  if(!_.has(ob, `${key}`) && _.has(ob1, `${key}` )) {
    return withoutСomparison(ob1[key], depth + 1, space);
  }
  if(_.has(ob, `${key}`) && !_.has(ob1, `${key}` )) {
    return withoutСomparison(ob[key], depth + 1, space);
  } 
}

const iter = (value1, value2, depth = 0, space)  => {
  const mergeObject = {...value1, ...value2};

  const mergeObjectSort = Object.entries(mergeObject).sort()
  return mergeObjectSort.reduce((acc, element) =>{
    const operator = getOperator(value1, value2, element[0]);
    
    if(typeof(element[1]) === 'object') {
      acc += `\n ${' '.repeat(space * depth)} ${operator} ${element[0]}: `
      acc += getValueObject(value1, value2, element[0], depth, space);
      //acc += '\n' + ' '.repeat(space * depth) + '}'
    } else {
      
    if(_.has(value1, `${element[0]}`) && _.has(value2, `${element[0]}`) && value1[element[0]] !== value2[element[0]]) {
      if(typeof(value1[element[0]]) === 'object' && typeof(value2[element[0]]) !== 'object') {
        acc += `\n ${' '.repeat(space * depth)} - ${element[0]}: ${withoutСomparison(value1[element[0]], depth + 1, space)}`
        acc += `\n ${' '.repeat(space * depth)} + ${element[0]}: ${value2[element[0]]}`
      }
      if(typeof(value1[element[0]]) !== 'object' && typeof(value2[element[0]]) === 'object') {
        acc += `\n ${' '.repeat(space * depth)} - ${element[0]}: ${value1[element[0]]}`
        acc += `\n ${' '.repeat(space * depth)} + ${element[0]}: ${withoutСomparison(value2[element[0]], depth + 1, space)}`
      } 
      if(typeof(value1[element[0]]) !== 'object' && typeof(value2[element[0]]) !== 'object') {
        acc += `\n ${' '.repeat(space * depth)} - ${element[0]}: ${value1[element[0]]}`
        acc += `\n ${' '.repeat(space * depth)} + ${element[0]}: ${value2[element[0]]}`
      }
    } 
    
    else {
      acc += `\n ${' '.repeat(space * depth)} ${operator} ${element[0]}: `
      acc += getValue(value1, value2, element[0]);
    }
    
  }
    return acc;
  }, '{')
};

const stringify = (ob1, ob2, space = 1) => {
  
  return iter(ob1, ob2, 0, space);  
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

  const comparison = stringify(objJs, obj2Js, 4);
  return comparison + '\n}';
};

module.exports = { genDiff, withoutСomparison, stringify, getValueObject, getValue};
