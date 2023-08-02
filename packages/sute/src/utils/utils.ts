

export const isObject = (obj: any) => {
  var type = typeof obj;
  return type === 'object' && !!obj;
}

export const isBoolean = (value: any) => {
  return typeof value === "boolean"
}
