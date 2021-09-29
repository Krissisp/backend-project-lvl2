export default function json(array) {
  return array.reduce((acc, element) => {
    const acc1 = acc;
    if (Array.isArray(element[2])) {
      acc1[`${element[0]} ${element[1]}`] = json(element[2]);
    }
    if (!Array.isArray(element[2])) {
    // const key = `${element[0]} ${element[1]}`;
      acc1[`${element[0]} ${element[1]}`] = element[2];
    }
    return acc1;
  }, {});
}
