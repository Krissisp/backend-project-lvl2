export default function stylish(value, replacer = ' ', space = 1) {
  const iter = (array, depth) => {
    const result = array.reduce((acc, element) => {
      const indent = element[0].length + replacer.length;

      if (!Array.isArray(element[2])) {
        return `${acc}\n${replacer.repeat(space * depth - indent)}${element[0]} ${element[1]}: ${element[2]}`;
      }
      if (Array.isArray(element[2])) {
        return `${acc}${iter(element[2], depth + 1)}\n${replacer.repeat(space * depth)}}`;
      }
      return acc;
    }, '{');
    return result;
  };
  return `${iter(value, 1)}\n}`;
}
