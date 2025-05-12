export function updateDictionary(previous: any, current: any) {
  const modified: any = { ...previous };
  const changed: string[] = [];

  // Loop through keys in request
  for (const key in previous) {
    if (previous.hasOwnProperty(key)) {
      // Check if key exists in dict2
      if (current.hasOwnProperty(key)) {
        // Compare values of key in both dictionaries
        if (previous[key] !== current[key]) {
          changed.push(key);
          // If values are different, add key-value pair to updatedDict
          modified[key] = current[key];
        }
      } else {
        // If key doesn't exist in dict2, add key-value pair to updatedDict
        modified[key] = previous[key];
      }
    }
  }

  // Loop through keys in dict2
  for (const key in current) {
    if (current.hasOwnProperty(key)) {
      // Check if key exists in request
      if (!previous.hasOwnProperty(key)) {
        // If key doesn't exist in request, add key-value pair to updatedDict
        modified[key] = current[key];
      }
    }
  }

  return { modified, changed };
}

export const keywordGenerator = (obj:any, prefix = ""):string => {
  let keyValuePairs = [];

  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      keyValuePairs.push(keywordGenerator(obj[key], prefix + key + "."));
    } else {
      keyValuePairs.push(`${prefix}${obj[key]}`);
    }
  }

  return keyValuePairs.join(", ");
};

export function insertToDictionary(obj:object, index:number, key:string, value:any) {
  // Convert the object to an array of key-value pairs
  const entries = Object.entries(obj);

  // Insert the new key-value pair at the specified index
  entries.splice(index, 0, [key, value]);

  // Convert the array back to an object
  const newObj = Object.fromEntries(entries);

  return newObj;
}