import { expect, it } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { genDiff } from '../src/diff.js';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

it('test genDiff format stylish', () => {
  expect(genDiff('file1.yml', 'file2.yml', 'stylish')).toEqual(readFile('expectStylish.txt'));
});

it('test genDiff format plain', () => {
  expect(genDiff('file1.yml', 'file2.yml', 'plain')).toEqual(readFile('expectPlain.txt'));
});

it('test genDiff format json', () => {
  expect(genDiff('file1.yml', 'file2.yml', 'json')).toEqual(readFile('expected.json'));
});
