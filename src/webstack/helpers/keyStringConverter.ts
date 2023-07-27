export default function keyStringConverter(str: string, dashed = false, bypass = false) {
  // Replace all occurrences of capital letters with a space and the capital letter
  let result = str.replace(/([A-Z])/g, " $1").toLowerCase();
  if (bypass) result = str.toLowerCase();
  // replace all spaces with dashes
  if (dashed) result = result.replaceAll(" ", "-");
  // replace dashes with spaces
  if (!dashed) result = result.replaceAll("-", " ");
  if (result === "id") return "ID";
  return result;
}
