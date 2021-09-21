#!/usr/bin/env node
import program from 'commander';
import genDiff from '../src/gendiff';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference')
  .argument('<filepath1>', 'path to file1')
  .argument('<filepath2>', 'path to file2')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((filepath1, filepath2) => genDiff(filepath1, filepath2));
program.parse(process.argv);
