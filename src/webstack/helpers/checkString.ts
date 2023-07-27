export default function checkString(str: string, arr: string[]) {
  if (!str || str.length < 2) return null;
  str = str?.toLowerCase();
  arr.map((str) => str.toLowerCase());

  const foundSubstring = arr.find((substring: string) =>
    str.includes(substring)
  );
  if (foundSubstring) {
    return foundSubstring.toLowerCase();
  } else {
    return false;
  }
}
