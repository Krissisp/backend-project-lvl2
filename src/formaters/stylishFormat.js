const stylish = (value, replacer = ' ', space = 1) => {
    const iter = (array, depth) => {
     let result = '{';

       for(const element of array) {
        const indent = element[0].length + replacer.length
           result += '\n'+ replacer.repeat(space * depth - indent) + `${element[0]} ${element[1]}: `
          if(!Array.isArray(element[2])) {
            result += `${element[2]}`; 
          } 
          if(Array.isArray(element[2])) {
            result += iter(element[2], depth + 1);
          }
        }
   
     result += '\n' + replacer.repeat(space * (depth - 1)) + '}';
     return result;
    }
     return iter(value, 1)
};

module.exports = { stylish };