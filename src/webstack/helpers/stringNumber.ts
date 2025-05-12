type StringNumProps = {
  toFixed?: number;
  removeChar?: string;
  preChar?: string;
  postChar?: string;
};

const stringNum = (nStr: string | undefined, props: StringNumProps = {}): string => {
  const { toFixed, removeChar, preChar, postChar } = props;

  if (!nStr) return "";

  // Remove all non-numeric characters
  let num: string = nStr.replace(/[^0-9]/g, "");

  // Handle floating-point conversion and formatting
  if (num) {
    num = parseFloat(num).toString();
    if (toFixed !== undefined) {
      num = parseFloat(num).toFixed(toFixed);
    }
  }

  if (preChar) {
    num = preChar + num;
  }

  if (postChar) {
    num = num + postChar;
  }

  return num;
};

export default stringNum;
