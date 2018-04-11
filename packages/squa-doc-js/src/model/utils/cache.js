export default function cache(obj, key, fn) {
  if (obj[key] === null) {
    obj[key] = fn(obj);
  }
  return obj[key];
}
