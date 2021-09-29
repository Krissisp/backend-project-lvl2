export default function stylish(value, replacer = ' ', space = 1) {
  const iter = (array, depth) => {
    const result = array.reduce((acc, element) => {
      const indent = element[0].length + replacer.length;

      if (!Array.isArray(element[2])) {
        return `${acc}${replacer.repeat(space * depth - indent)}${element[0]} ${element[1]}: ${element[2]}\n`;
      }

      return `${acc}${replacer.repeat(space * depth - indent)}${element[0]} ${element[1]}: {\n${iter(element[2], depth + 1)}\n${replacer.repeat(space * depth)}}\n`;
    }, '');
    return result.trim();
  };
  return `${iter(value, 1)}\n}`;
}
