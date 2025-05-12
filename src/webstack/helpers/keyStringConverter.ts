
type IKeyStringConverterOptions = {
  dashed?: boolean;
  replace?: string;
  textTransform?: string;
} | undefined;
export default function keyStringConverter(str: string, options?:IKeyStringConverterOptions) {
  // Replace all occurrences of capital letters with a space and the capital letter
  let result = str.replace(/([A-Z])/g, " $1").toLowerCase();
  if (options?.replace) result = result.replace(/_/g, options.replace);
  const transform = options?.textTransform;
  if (options?.dashed) result = result.replaceAll(" ", "-");
  if (transform){
    if(transform == 'lowercase') result = str.toLowerCase();
    if(transform == 'uppercase') result = str.toUpperCase();
    if(transform == 'capitalize') result = str.replace(/\b\w/g, char => char.toUpperCase());
    else console.error("[ KeyStringConverter ]: textTransform defined incorrectly")
  }
  if (!options?.dashed) result = result.replaceAll("-", " ").replaceAll("_", " ");
  if (result === "id") return "ID";
  return result;
}
