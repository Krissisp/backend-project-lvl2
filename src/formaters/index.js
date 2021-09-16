const {plain} = require('./plainFormat.js')
const {stylish} = require('./stylishFormat.js')

const formatChoice = (str, object) => {
    if(str === 'plain') {
        return plain(object);
    }
        return stylish(object, ' ', 4);
};

module.exports = {formatChoice };