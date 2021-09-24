const json = (array) => array.reduce((acc, element) => {
  if (Array.isArray(element[2])) {
    acc[`${element[0]} ${element[1]}`] = element[2];
  }
  if (!Array.isArray(element[2])) {
    // const key = `${element[0]} ${element[1]}`;
    acc[`${element[0]} ${element[1]}`] = element[2];
  }
  return JSON.stringify(JSON.parse(acc));
}, {});

export default json;
