export default function capitalize(str:string) {
  return str.split(" ").map((str) => str.charAt(0).toUpperCase() + str.slice(1)).join(" ");
}