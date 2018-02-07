export function getType(type) {
  if (!type.includes('/')) {
    type = `image/${type}`;
  }
  return type;
}
