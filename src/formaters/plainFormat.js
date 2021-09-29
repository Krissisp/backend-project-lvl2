import _ from 'lodash';

export default function plain(value) {
  const iter = (array, ansentry) => {
    const result = array.reduce((acc, element, index) => {
      const desiredElement = element[1];
      const valueElement = element[2];
      const firstIndexElement1 = _.indexOf(array.flat(1), desiredElement, 0);
      const lastIndexElement1 = _.indexOf(array.flat(1), desiredElement, firstIndexElement1 + 1);
      const valueNexElement = array.flat(1)[lastIndexElement1 + 1];

      if (index !== 0 && desiredElement === array[index - 1][1]) {
        return acc;
      } if (lastIndexElement1 !== -1) {
        const updateText = `\nProperty '${[...ansentry, desiredElement].join('.')}' was updated.`;
        if ((typeof (valueElement) === 'boolean' || typeof (valueElement) === 'number' || valueElement === null)
        && Array.isArray(valueNexElement)) {
          return `${acc}${updateText} From ${valueElement} to [complex value]`;
        }
        if ((typeof (valueElement) === 'boolean' || typeof (valueElement) === 'number' || valueElement === null)
        && !Array.isArray(valueNexElement) && typeof (valueNexElement) !== 'boolean' && valueNexElement !== null) {
          return `${acc}${updateText} From ${valueElement} to '${valueNexElement}'`;
        }
        if ((typeof (valueElement) === 'boolean' || typeof (valueElement) === 'number' || valueElement === null)
        && (typeof (valueNexElement) === 'boolean' || valueNexElement === null || typeof (valueNexElement) === 'number')) {
          return `${acc}${updateText} From ${valueElement} to ${valueNexElement}`;
        }
        if (typeof (valueElement) !== 'boolean' && typeof (valueElement) !== 'number' && valueElement !== null && !Array.isArray(valueElement)
        && (typeof (valueNexElement) === 'boolean' || valueNexElement === null || typeof (valueNexElement) === 'number')) {
          return `${acc}${updateText} From '${valueElement}' to ${valueNexElement}`;
        }

        if (Array.isArray(valueElement)
        && (typeof (valueNexElement) === 'boolean' || typeof (valueNexElement) === 'number' || valueNexElement === null)) {
          return `${acc}${updateText} From [complex value] to ${valueNexElement}`;
        }
        if (Array.isArray(valueElement)
        && typeof (valueNexElement) !== 'boolean' && typeof (valueNexElement) !== 'number' && valueNexElement !== null) {
          return `${acc}${updateText} From [complex value] to '${valueNexElement}'`;
        }
        if (typeof (valueElement) !== 'boolean' && typeof (valueElement) !== 'number' && valueElement !== null && !Array.isArray(valueElement)
        && typeof (valueNexElement) !== 'boolean' && valueNexElement !== null && typeof (valueNexElement) !== 'number' && !Array.isArray(valueNexElement)) {
          return `${acc}${updateText} From '${valueElement}' to '${valueNexElement}'`;
        }
      } else if (element[0] === '-') {
        return `${acc}\nProperty '${[...ansentry, element[1]].join('.')}' was removed`;
      } else if (element[0] === '+') {
        if (Array.isArray(element[2])) {
          return `${acc}\nProperty '${[...ansentry, element[1]].join('.')}' was added with value: [complex value]`;
        }
        const addedText = `\nProperty '${[...ansentry, element[1]].join('.')}' was added with value:`;
        if (typeof (element[2]) === 'boolean') {
          return `${acc}${addedText} ${element[2]}`;
        }
        return `${acc}${addedText} '${element[2]}'`;
      } else if (Array.isArray(element[2])) {
        if (element[2].length >= 2) {
          return `${acc}\n${iter(element[2], [...ansentry, element[1]])}`;
        }
        return `${acc}\nProperty '${[...ansentry, element[1]].join('.')}' was added with value: [complex value]`;
      }
      return acc;
    }, '');

    return result.trim();
  };
  return iter(value, []);
}
