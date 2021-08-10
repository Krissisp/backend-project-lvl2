const program  = require('commander');
program
.version('0.0.1')
.description('Compares two configuration files and shows a difference')
.arguments('<filepath1>', 'path to file1')
.arguments('<filepath2>', 'path to file2');

program
  .option('-f, --format [type]', 'output format');

program.parse(process.argv)

