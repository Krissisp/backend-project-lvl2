#!/usr/bin/env node
import genDiff from '../src/gendiff';

const { program } = require('commander');

// .option('-f, --format <type>', 'output format', 'stylish')
program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference')
  .argument('<filepath1>', 'path to file1')
  .argument('<filepath2>', 'path to file2')
  .action((filepath1, filepath2) => genDiff(filepath1, filepath2));
program.parse(process.argv);
