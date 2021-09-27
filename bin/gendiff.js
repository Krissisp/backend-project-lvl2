#!/usr/bin/env node
import { program } from 'commander';
import { genDiff } from '../src/diff.js';

program
  .command('gendiff')
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference')
  .argument('<filepath1>', 'path to file1')
  .argument('<filepath2>', 'path to file2')
  .option('-f --format <type>', 'output format', 'stylish')
  .option('-c --colors', 'hhjkjhjk')
  .action((filepath1, filepath2) => {
    const option = program.opts();
    const format = option.format;
    if (format === 'plain') {
      console.log(genDiff(filepath1, filepath2, 'plain'));
    }
    if (format === 'json') {
      console.log(genDiff(filepath1, filepath2, 'json'));
    } else {
      console.log(genDiff(filepath1, filepath2, 'stylish'));
    }
  });
program.parse(process.argv);
