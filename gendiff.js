#!/usr/bin/env node
import program from 'commander';
import genDiff from './src/gendiff1';

program
  .command('gendiff')
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference')
  .argument('<filepath1>', 'path to file1')
  .argument('<filepath2>', 'path to file2')
  .argument('<formatName>', 'display format')
  .option('-f --format <type>', 'output format', 'stylish')
  .action((filepath1, filepath2, formatName) => genDiff(filepath1, filepath2, formatName));

program.parse(process.argv);
