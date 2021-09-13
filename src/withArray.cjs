const { parsersYml } = require('./parsers.cjs');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

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

const createDiff = (object1, object2) => {
    const mergeObject = {...object1, ...object2};
    const mergeObjectSort = Object.entries(mergeObject).sort();
    return mergeObjectSort.reduce((acc, keyValue ) => { 
        if(!_.has(object1, `${keyValue[0]}`) && _.has(object2, `${keyValue[0]}`)) {
          if(typeof(object2[keyValue[0]]) !== 'object') {
            acc.push(['+', keyValue[0], object2[keyValue[0]]]);
          } 
          if(typeof(object2[keyValue[0]]) === 'object') {
            acc.push(['+', keyValue[0], withOutComparison(object2[keyValue[0]])])
          }
        }
        if(_.has(object1, `${keyValue[0]}`) && !_.has(object2, `${keyValue[0]}`)) {
          if(typeof(object1[keyValue[0]]) !== 'object') {
            acc.push(['-', keyValue[0], object1[keyValue[0]]]);
          } 
          if(typeof(object1[keyValue[0]]) === 'object') {
            acc.push(['-', keyValue[0], withOutComparison(object1[keyValue[0]])])
          }
        }
        if(_.has(object1, `${keyValue[0]}`) && _.has(object2, `${keyValue[0]}`)) {
           if(typeof(object1[keyValue[0]]) !== 'object' && typeof(object2[keyValue[0]]) !== 'object' && object2[keyValue[0]] !== object1[keyValue[0]]) {
               acc.push(['-', keyValue[0], object1[keyValue[0]]]);
               acc.push(['+', keyValue[0], object2[keyValue[0]]]);
           }
           if(typeof(object1[keyValue[0]]) !== 'object' && typeof(object2[keyValue[0]]) !== 'object' && object2[keyValue[0]] === object1[keyValue[0]]) {
               acc.push([' ', keyValue[0], object1[keyValue[0]]]);
           }
           if(typeof(object1[keyValue[0]]) === 'object' && typeof(object2[keyValue[0]]) !== 'object') {
               acc.push(['-', keyValue[0], withOutComparison(object1[keyValue[0]])]);
               acc.push(['+', keyValue[0], object2[keyValue[0]]]);
           }
           if(typeof(object1[keyValue[0]]) !== 'object' && typeof(object2[keyValue[0]]) === 'object') {
               acc.push(['-', keyValue[0], object1[keyValue[0]]]);
               acc.push(['+', keyValue[0], withOutComparison(object2[keyValue[0]])]);
           }
           if(typeof(object1[keyValue[0]]) === 'object' && typeof(object2[keyValue[0]]) === 'object' ) {
              acc.push([' ', keyValue[0], createDiff(object1[keyValue[0]], object2[keyValue[0]])]);
           }  
        }
        return acc;
     }, [])
    
}

const stylish = (value, replacer = ' ', space = 1) => {
    const iter = (array, depth) => {
     let result = '{';

       for(const element of array) {
        const indent = element[0].length + replacer.length
           result += '\n'+ replacer.repeat(space * depth - indent) + `${element[0]} ${element[1]}: `
          if(!Array.isArray(element[2])) {
            result += `${element[2]}`; 
          } 
          if(Array.isArray(element[2])) {
            result += iter(element[2], depth + 1);
          }
        }
   
     result += '\n' + replacer.repeat(space * (depth - 1)) + '}';
     return result;
    }
     return iter(value, 1)
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
     
       const diffObject = createDiff(objJs, obj2Js);
       return stylish(diffObject, ' ', 4);
       
     };
     
     module.exports = { genDiff, createDiff, withOutComparison };