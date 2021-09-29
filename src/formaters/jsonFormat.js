export default function json(array) {
  return array.reduce((acc, element) => {
    const key = `${element[0]} ${element[1]}`;
    if (Array.isArray(element[2])) {
      return {
        ...acc,
        [key]: json(element[2]),
      };
    }
    return {
      ...acc,
      [key]: element[2],
    };
  }, {});
}
