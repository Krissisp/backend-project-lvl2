const { expect, it } = require('@jest/globals');
const { genDiff } = require('../src/gendiff.cjs');
const {comparisonNested} = require('../__fixtures__/expect.js')

it('test genDiff', () => {
   expect(genDiff('file1.json', 'file2.json')).toEqual(comparisonNested);
   console.log(genDiff('file1.json', 'file2.json'));
});