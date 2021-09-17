const { expect, it } = require('@jest/globals');
const { genDiff } = require('../src/gendiff.cjs');
const {comparisonNested, mergeFormat} = require('../__fixtures__/expect.js')
const fs = require('fs');
const path = require('path');

it('test genDiff format stylish', () => {
   expect(genDiff('file1.yaml', 'file2.yml', 'stylish')).toEqual(comparisonNested);
});

it('test genDiff format plain', () => {
   expect(genDiff('file1.yaml', 'file2.yml', 'plain')).toEqual(mergeFormat);
});

it('test genDiff format json', () => {
   const read = (str) => {
      const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
      const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
      const obj = readFile(str);
      const result = JSON.parse(obj);
      return result
   }
   expect(genDiff('file1.yaml', 'file2.yml', 'json')).toEqual(read('expected.json'));
});