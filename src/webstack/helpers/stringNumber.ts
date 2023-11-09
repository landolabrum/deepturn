interface StringNumProps {
  toFixed?: number;
  removeChar?: string;
  preChar?: string;
  postChar?: string;
}
const stringNum = (nStr: undefined | string, { toFixed, removeChar, preChar, postChar }: StringNumProps) => {
  if (!nStr) return "";
  let num: string | number = nStr;
  if (removeChar) num.replaceAll(removeChar, "");
  num = parseFloat(num);
  if (toFixed) {
    num = num.toFixed(toFixed).toString();
    const split = num.split(".");
    if (split[1].startsWith("00")) num = split[0];
  } else {
    num = num.toString();
  }
  if (preChar) num = preChar + num;
  if (postChar) num = num + postChar;
  return num;
};
export default stringNum;
