const { expect, it } = require('@jest/globals');
const { genDiff } = require('../src/withArray.cjs');
const {comparisonNested, dfn} = require('../__fixtures__/expect.js')

it('test genDiff format stylish', () => {
   expect(genDiff('file1.yaml', 'file2.yml', 'stylish')).toEqual(comparisonNested);
});

it('test genDiff format plain', () => {
   expect(genDiff('file1.yaml', 'file2.yml', 'plain')).toEqual(dfn);
});