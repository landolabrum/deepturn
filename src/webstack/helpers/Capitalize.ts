export default function capitalize(str:string) {
  return str.split(" ").map((str) => str.charAt(0).toUpperCase() + str.slice(1)).join(" ");
}
export function capitalizeAll(input: string) {
  return input.split(' ').reduce((accumulator, word) => {
    if (accumulator.length > 0) {
      return accumulator + ' ' + capitalize(word);
    } else {
      return capitalize(word);
    }
  }, '');
}