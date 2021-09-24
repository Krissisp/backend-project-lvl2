#!/usr/bin/env node
import genDiff from './src/gendiff1';

const { program } = require('commander');

program
  .command('gendiff')
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference')
  .argument('<filepath1>', 'path to file1')
  .argument('<filepath2>', 'path to file2')
  .argument('<formatName>', 'display format')
  .action((filepath1, filepath2, formatName) => genDiff(filepath1, filepath2, formatName));

console.log(process.argv);
