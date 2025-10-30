type IKeyStringConverterOptions = {
  dashed?: boolean;
  replace?: string;
  textTransform?: string;
} | undefined;

export default function keyStringConverter(str: string, options?: IKeyStringConverterOptions): string {
  // Ensure the string is always in the correct format
  let result = str.replace(/([A-Z])/g, " $1").toLowerCase();

  if (options?.replace) result = result.replace(/_/g, options.replace);
  const transform = options?.textTransform;

  if (options?.dashed) result = result.replaceAll(" ", "-");
  
  if (transform) {
    if (transform === 'lowercase') result = result.toLowerCase();
    if (transform === 'uppercase') result = result.toUpperCase();
    if (transform === 'capitalize') result = result.replace(/\b\w/g, char => char.toUpperCase());
    else console.error("[ KeyStringConverter ]: textTransform defined incorrectly");
  }

  if (!options?.dashed) result = result.replaceAll("-", " ").replaceAll("_", " ");
  
  if (result === "id") return "ID";
  
  // Ensure the result is always a string, return a string
  return String(result);
}
