import _ from 'lodash';

const plain = (value) => {
  const iter = (array, ansentry) => {
    const result = array.reduce((acc, element, index) => {
      const desiredElement = element[1];
      const valueElement = element[2];
      const firstIndexElement1 = _.indexOf(array.flat(1), desiredElement, 0);
      const lastIndexElement1 = _.indexOf(array.flat(1), desiredElement, firstIndexElement1 + 1);
      if (lastIndexElement1 !== -1) {
        acc += `\nProperty '${[...ansentry, desiredElement].join('.')}' was updated. `;
        if (typeof (valueElement) === 'boolean') {
          acc += `From ${valueElement} to ${array.flat(1)[lastIndexElement1 + 1]}`;
        } else if (Array.isArray(valueElement)) {
          acc += `From [complex value] to '${array.flat(1)[lastIndexElement1 + 1]}'`;
        } else {
          acc += `From '${valueElement}' to '${array.flat(1)[lastIndexElement1 + 1]}'`;
        }
        array.splice(index + 1, 1);
      } else if (element[0] === '-') {
        acc += `\nProperty '${[...ansentry, element[1]].join('.')}' was removed`;
      } else if (element[0] === '+') {
        if (Array.isArray(element[2])) {
          acc += `\nProperty '${[...ansentry, element[1]].join('.')}' was added with value: [complex value]`;
        } else {
          acc += `\nProperty '${[...ansentry, element[1]].join('.')}' was added with value: `;
          if (typeof (element[2]) === 'boolean') {
            acc += `${element[2]}`;
          } else {
            acc += `'${element[2]}'`;
          }
        }
      } else if (Array.isArray(element[2])) {
        if (element[2].length >= 2) {
          acc += `\n${iter(element[2], [...ansentry, element[1]])}`;
        } else {
          acc += `\nProperty '${[...ansentry, element[1]].join('.')}' was added with value: [complex value]`;
        }
      }
      return acc;
    }, '');

    return result.trim();
  };
  return iter(value, []);
};

export default plain;
