import { plain } from './plainFormat.js';
import { stylish } from './stylishFormat.js';
import { json } from './jsonFormat.js';

export const formatChoice = (str, object) => {
  if (str === 'plain') {
    return plain(object);
  }
  if (str === 'stylish') {
    return stylish(object, ' ', 4);
  }
  return JSON.stringify(json(object));
};
