export default function keyStringConverter(str: string, dashed = false, lowerCase = false) {
  // Replace all occurrences of capital letters with a space and the capital letter
  let result = str.replace(/([A-Z])/g, " $1").toLowerCase();
  if (lowerCase) result = str.toLowerCase();
  // replace all spaces with dashes
  if (dashed) result = result.replaceAll(" ", "-");
  // replace dashes with spaces
  if (!dashed) result = result.replaceAll("-", " ").replaceAll("_", " ");
  if (result === "id") return "ID";
  return result;
}
