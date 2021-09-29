import plain from './plainFormat.js';
import stylish from './stylishFormat.js';
import json from './jsonFormat.js';

export default function formatChoice(str, object) {
  if (str === 'plain') {
    return plain(object);
  }
  if (str === 'stylish') {
    return stylish(object, ' ', 4);
  }
<<<<<<< HEAD
  return json(object);
=======
  return JSON.stringify(json(object));
>>>>>>> b91d5187744ad7d712b894ae0454950c073e940f
}
