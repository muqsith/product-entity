export const normalizeInput = (data): Record<string, any> => {
  var normalizedObject = {};

  Object.keys(data).forEach(function (key) {
    normalizedObject[key.toLowerCase()] = data[key];
  });

  return normalizedObject;
};
