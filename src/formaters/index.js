const {plain} = require('./plainFormat.js')
const {stylish} = require('./stylishFormat.js')
const {json} = require('./jsonFormat.js')


const formatChoice = (str, object) => {
    if(str === 'plain') {
        return plain(object);
    } 
    else if(str === 'stylish') {
        return stylish(object, ' ', 4);
    }
    return json(object)
};

module.exports = {formatChoice };