export function getKeyFromValue(obj: any, value: any) {
  for (const [key, val] of Object.entries(obj)) {
    if (val === value) {
      return key;
    }
  }
  return null;
}