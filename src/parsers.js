const yaml = require('js-yaml');

const parsersYml = (file) => yaml.load(file);

module.exports = { parsersYml };