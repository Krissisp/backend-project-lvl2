#!/usr/bin/env node
import { Command } from 'commander';
import { genDiff } from '../src/diff.js';

const program = new Command();

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference')
  .argument('<filepath1>', 'path to file1')
  .argument('<filepath2>', 'path to file2')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((filepath1, filepath2, formatName) => {
    if (formatName === undefined || formatName.format === 'stylish') {
      console.log(genDiff(filepath1, filepath2, 'stylish'));
    }
    if (formatName.format === 'plain') {
      console.log(genDiff(filepath1, filepath2, 'plain'));
    } else {
      console.log(genDiff(filepath1, filepath2, 'json'));
    }
  });
program.parse(process.argv);
