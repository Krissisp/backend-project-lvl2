const plain = (value) => {
    let result = '';
    const iter = (array, ansentry) => {
      array.push([])
      for(let i = 0; i < array.length -1; i++) {
        if(array[i][1] === array[i + 1][1]) {
          result += `\nProperty '${[...ansentry, array[i][1]].join('.')}' was updated. `
          if(typeof(array[i][2]) === 'boolean') {
            result += `From ${array[i][2]} to ${array[i + 1][2]}`
          } else {
            if(Array.isArray(array[i][2])) {
            result += `From [complex value] to '${array[i + 1][2]}'`
            } else {
              result += `From '${array[i][2]}' to '${array[i + 1][2]}'`
            }
          }
          i += 2;
        }
        if(array[i][0] === '-') {
          result += `\nProperty '${[...ansentry, array[i][1]].join('.')}' was removed`
        }
        else if(array[i][0] === '+') {
          if(Array.isArray(array[i][2])){
            result += `\nProperty '${[...ansentry, array[i][1]].join('.')}' was added with value: [complex value]`
          } else {
          result += `\nProperty '${[...ansentry, array[i][1]].join('.')}' was added with value: `
          if(typeof(array[i][2]) ==='boolean') {
            result += `${array[i][2]}`
          } else {
            result += `'${array[i][2]}'`
          }
          }
        } else {
          if(Array.isArray(array[i][2])) {
            if(array[i][2].length >= 2) {
              iter(array[i][2], [...ansentry, array[i][1]])
            } else {
              result += `\nProperty '${[...ansentry, array[i][1]].join('.')}' was added with value: [complex value]`
            }
          } 
        }
      }
      return result.trim()
    }
        return iter(value, []);
};
module.exports = {plain};