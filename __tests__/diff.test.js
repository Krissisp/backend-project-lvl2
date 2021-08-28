const { expect, it } = require('@jest/globals');
const { genDiff } = require('../src/gendiff.cjs');
//const actual = "{\n - follow: false\n   host: hexlet.io\n - proxy: 123.234.53.22\n - timeout: 50\n + timeout: 20\n + verbose: true\n }";

it('test genDiff', () => {
   // console.log(genDiff('file1.json', 'file2.json'));
    //expect(genDiff('file1.yaml', 'file2.yml')).toEqual()
    expect(genDiff('file1.json', 'file2.json')).toEqual('-');
    console.log(genDiff('file1.json', 'file2.json'));
});

//it('test comparison with the extension "yaml/ yml"', () =>{
   // expect(genDiff('file1.yaml', 'file2.yml')).toEqual(actual);
   // console.log(genDiff('file1.yaml', 'file2.yml'))
//})
