import plain from './plainFormat';
import stylish from './stylishFormat';
import json from './jsonFormat';

const formatChoice = (str, object) => {
  if (str === 'plain') {
    return plain(object);
  }
  if (str === 'stylish') {
    return stylish(object, ' ', 4);
  }
  return json(object);
};

export default formatChoice;
