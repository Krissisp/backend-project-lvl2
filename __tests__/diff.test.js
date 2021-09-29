import { expect, it } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { genDiff } from '../src/diff.js';

const read = (str) => {
  const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
  const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
  const obj = readFile(str);
  const result = JSON.parse(obj);
  return result;
};

it('test genDiff format stylish', () => {
  expect(genDiff('file1.yml', 'file2.yml', 'stylish')).toEqual(read('expectStylish.txt'));
});

it('test genDiff format plain', () => {
  expect(genDiff('file1.yml', 'file2.yml', 'plain')).toEqual(read('expectPlain.txt'));
});

it('test genDiff format json', () => {
  expect(genDiff('file1.yml', 'file2.yml', 'json')).toEqual(read('expected.json'));
});
