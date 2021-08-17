const { expect, it } = require('@jest/globals');
const { test } = require('jest-circus');
const { genDiff } = require('../src/gendiff.cjs');
const actual = "{\n - follow: false\n   host: hexlet.io\n - proxy: 123.234.53.22\n - timeout: 50\n + timeout: 20\n + verbose: true\n }";

it('test genDiff', () => {

    expect(genDiff('file1.json', 'file2.json')).toEqual(actual)
})
