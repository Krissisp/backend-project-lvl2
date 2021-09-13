const { expect, it } = require('@jest/globals');
const { genDiff } = require('../src/withArray.cjs');
const {comparisonNested} = require('../__fixtures__/expect.js')

it('test genDiff', () => {
   expect(genDiff('file1.yaml', 'file2.yml')).toEqual(comparisonNested);
   console.log(genDiff('file1.yaml', 'file2.yml'));
});