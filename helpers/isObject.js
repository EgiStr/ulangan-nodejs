export default function isObject(obj) {
  return obj != null && obj.constructor.name === "Object";
}
