import fs from 'fs';
import path from 'path';
import _ from 'lodash';
// import { fileURLToPath } from 'url';
import parsersYml from './parsers.js';
import formatChoice from './formaters/index.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

export const isObject = (value) => {
  if (typeof value !== 'object') {
    return false;
  }
  if (value === null) {
    return false;
  }
  return true;
};

export const withOutComparison = (object) => {
  const array = _.entries(object);
  const arraySort = _.sortBy(array);
  return arraySort.reduce((acc, element) => {
    if (!isObject(element[1])) {
      return [...acc, [' ', element[0], element[1]]];
    }
    return [...acc, [' ', element[0], withOutComparison(element[1])]];
  }, []);
};

export const createDiff = (object1, object2) => {
  const mergeObjectWithArray = _.entries({ ...object1, ...object2 });
  const mergeObjectWithArraySort = _.sortBy(mergeObjectWithArray);
  return mergeObjectWithArraySort.reduce((acc, keyValue) => {
    if (!_.has(object1, `${keyValue[0]}`) && _.has(object2, `${keyValue[0]}`)) {
      if (!isObject(object2[keyValue[0]])) {
        return [...acc, ['+', keyValue[0], object2[keyValue[0]]]];
      }
      if (isObject(object2[keyValue[0]])) {
        return [...acc, ['+', keyValue[0], withOutComparison(object2[keyValue[0]])]];
      }
    }
    if (_.has(object1, `${keyValue[0]}`) && !_.has(object2, `${keyValue[0]}`)) {
      if (!isObject(object1[keyValue[0]])) {
        return [...acc, ['-', keyValue[0], object1[keyValue[0]]]];
      }
      if (isObject(object1[keyValue[0]])) {
        return [...acc, ['-', keyValue[0], withOutComparison(object1[keyValue[0]])]];
      }
    }
    if (_.has(object1, `${keyValue[0]}`) && _.has(object2, `${keyValue[0]}`)) {
      if (!isObject(object1[keyValue[0]]) && !isObject(object2[keyValue[0]])
      && object2[keyValue[0]] !== object1[keyValue[0]]) {
        return [
          ...acc,
          ['-', keyValue[0], object1[keyValue[0]]],
          ['+', keyValue[0], object2[keyValue[0]]],
        ];
      }
      if (!isObject(object1[keyValue[0]]) && !isObject(object2[keyValue[0]])
      && object2[keyValue[0]] === object1[keyValue[0]]) {
        return [
          ...acc,
          [' ', keyValue[0], object1[keyValue[0]]],
        ];
      }
      if (isObject(object1[keyValue[0]]) && !isObject(object2[keyValue[0]])) {
        return [
          ...acc,
          ['-', keyValue[0], withOutComparison(object1[keyValue[0]])],
          ['+', keyValue[0], object2[keyValue[0]]],
        ];
      }
      if (!isObject(object1[keyValue[0]]) && isObject(object2[keyValue[0]])) {
        return [
          ...acc,
          ['-', keyValue[0], object1[keyValue[0]]],
          ['+', keyValue[0], withOutComparison(object2[keyValue[0]])],
        ];
      }
      if (isObject(object1[keyValue[0]]) && isObject(object2[keyValue[0]])) {
        return [
          ...acc,
          [' ', keyValue[0], createDiff(object1[keyValue[0]], object2[keyValue[0]])],
        ];
      }
    }
    return acc;
  }, []);
};

export const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  // const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
  const readFile = (filename) => fs.readFileSync(filename, 'utf-8');
  const obj = readFile(filepath1);
  const obj2 = readFile(filepath2);

  const objJs = path.extname(filepath1) === 'json' ? JSON.parse(obj) : parsersYml(obj);
  const obj2Js = path.extname(filepath2) === 'json' ? JSON.parse(obj2) : parsersYml(obj2);

  const diffArray = createDiff(objJs, obj2Js);
  return formatChoice(formatName, diffArray);
};
