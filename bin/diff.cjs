#!/usr/bin/env node
const  { genDiff, createDiff, withOutComparison }  = require('../src/withArray.cjs');


const { program } = require('commander');

program
.version('0.0.1')
.description('Compares two configuration files and shows a difference')
.argument('<filepath1>', 'path to file1')
.argument('<filepath2>', 'path to file2')
.option('-f, --format [type]', 'output format', 'stylish')
.action((filepath1, filepath2) => genDiff(filepath1, filepath2));
program.parse(process.argv);