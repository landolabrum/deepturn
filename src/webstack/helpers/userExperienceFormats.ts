import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";
import { InvalidCell, NaCell } from "@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell";
type dateProps = string | number | Date;
type returnType = "string" | "object";



interface OptionsProps {
  time?: boolean;
  returnType?: returnType;
  format?: "MM-DD-YYYY" | "MM-YYYY";
  server?: boolean;
}


export const countries = {
  us: "🇺🇸 USA",
  ca: "🇨🇦 Canada",
  mx: "🇲🇽 Mexico",
  de: "🇩🇪 Germany",
  gb: "🇬🇧 United Kingdom",
  fr: "🇫🇷 France",
  es: "🇪🇸 Spain",
  it: "🇮🇹 Italy",
  nl: "🇳🇱 Netherlands",
  be: "🇧🇪 Belgium",
  dk: "🇩🇰 Denmark",
  se: "🇸🇪 Sweden",
  no: "🇳🇴 Norway",
  fi: "🇫🇮 Finland",
  ee: "🇪🇪 Estonia",
  lv: "🇱🇻 Latvia",
  lt: "🇱🇹 Lithuania",
  pl: "🇵🇱 Poland",
  cz: "🇨🇿 Czechia",
  sk: "🇸🇰 Slovakia",
  hu: "🇭🇺 Hungary",
  at: "🇦🇹 Austria",
  ch: "🇨🇭 Switzerland",
  pt: "🇵🇹 Portugal",
  ie: "🇮🇪 Ireland",
  is: "🇮🇸 Iceland",
  gr: "🇬🇷 Greece",
  tr: "🇹🇷 Turkey",
  ru: "🇷🇺 Russia",
  sa: "🇸🇦 Saudi Arabia",
  ae: "🇦🇪 United Arab Emirates",
  qa: "🇶🇦 Qatar",
  kw: "🇰🇼 Kuwait",
  om: "🇴🇲 Oman",
  bh: "🇧🇭 Bahrain",
  in: "🇮🇳 India",
  cn: "🇨🇳 China",
  jp: "🇯🇵 Japan",
  kr: "🇰🇷 South Korea",
  hk: "🇭🇰 Hong Kong",
  tw: "🇹🇼 Taiwan",
  sg: "🇸🇬 Singapore",
  id: "🇮🇩 Indonesia",
  th: "🇹🇭 Thailand",
  ph: "🇵🇭 Philippines",
  au: "🇦🇺 Australia",
  nz: "🇳🇿 New Zealand",
  ar: "🇦🇷 Argentina",
  br: "🇧🇷 Brazil",
  cl: "🇨🇱 Chile",
  co: "🇨🇴 Colombia",
  ec: "🇪🇨 Ecuador",
  pe: "🇵🇪 Peru",
  uy: "🇺🇾 Uruguay",
  ve: "🇻🇪 Venezuela",
  bo: "🇧🇴 Bolivia",
  py: "🇵🇾 Paraguay",
  cr: "🇨🇷 Costa Rica",
  do: "🇩🇴 Dominican Republic",
  sv: "🇸🇻 El Salvador",
  gt: "🇬🇹 Guatemala",
  hn: "🇭🇳 Honduras",
  ni: "🇳🇮 Nicaragua",
  pa: "🇵🇦 Panama",
  bs: "🇧🇸 Bahamas",
  bb: "🇧🇧 Barbados",
  cu: "🇨🇺 Cuba",
  jm: "🇯🇲 Jamaica",
  ht: "🇭🇹 Haiti",
  tt: "🇹🇹 Trinidad & Tobago",
  ag: "🇦🇬 Antigua & Barbuda",
  dm: "🇩🇲 Dominica",
  gd: "🇬🇩 Grenada",
  kn: "🇰🇳 St. Kitts & Nevis",
  lc: "🇱🇨 St. Lucia",
  vc: "🇻🇨 St. Vincent & Grenadines",
  ai: "🇦🇮 Anguilla",
  bm: "🇧🇲 Bermuda",
  ky: "🇰🇾 Cayman Islands",
  ms: "🇲🇸 Montserrat",
  tc: "🇹🇨 Turks & Caicos Islands",
  vg: "🇻🇬 British Virgin Islands",

  // NON EMOJIS
  cf: "Central Africa Republic",
  cm: "Camaroon",
  ly: "Libya",
  am: "Armenia",
  ao: "Angola",
  aq: "Antarctica",
  bi: "Burundi",
  bw: "Botswana",
  bz: "Belize",
  ga: "Gabon",
  ge: "Georgia",
  gh: "Ghana",
  jo: "Jordan",
  la: "Laos",
  lu:"Luxembourg",
  // add more country codes and their corresponding names as needed
};

export function stringToKebab(str?: string) {
  if (!str) return "";
  return str.toLowerCase().replaceAll(" ", "-");
}

// PHONE FORMAT
export const phoneFormat = (
  phoneNumber: string,
  countryCode: string
): string => {
  const phoneUtil = PhoneNumberUtil.getInstance();
  let formattedNumber:string = phoneNumber;
  try {
    const parsedNumber = phoneUtil.parseAndKeepRawInput(
      phoneNumber,
      countryCode
    );
    formattedNumber = phoneUtil.format(
      parsedNumber,
      PhoneNumberFormat.NATIONAL
    );
  } catch (e) {
    return "n/a";
  }
  return formattedNumber;
};

// COUNTRY
export function countryFormat(countryISO: string) {
 
  const countryCodes: { [key: string]: string } = countries;
  if (countryISO?.toLowerCase() in countries) {
    countryISO = countryCodes[countryISO?.toLowerCase()];
    return countryISO;
  } else {
    return countryISO ? countryISO.toUpperCase() : NaCell();
  }
}

// DATES
export function dateFormat(
  suppliedDate: dateProps,
  options: OptionsProps = {
    time: false,
    returnType: "string",
    format: "MM-DD-YYYY",
    server: false,
  }
): string | string[] | React.ReactElement {
  if (options.server) {
    const date = new Date(suppliedDate);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  } else {
    if (typeof suppliedDate === "string") suppliedDate = new Date(suppliedDate);
    const mDY: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const mY: Intl.DateTimeFormatOptions = {
      month: "short",
      year: "numeric",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    try {
      let dateString = suppliedDate.toLocaleString("en-US", mDY);
      if (options?.format && options.format === "MM-YYYY")
        dateString = suppliedDate.toLocaleString("en-US", mY);
      if (options.time) {
        const timeString = suppliedDate.toLocaleString("en-US", timeOptions);
        if (options.returnType === "object") return [dateString, timeString];
        return `${dateString} ${timeString}`;
      }
      if(dateString.length < 8)return InvalidCell();
      return dateString;
    } catch (e) {
      return NaCell();
    }
  }
}

// export function dateServerFormat(dateString: string) {
//   const date = new Date(dateString);
//   return `${date.getFullYear()}-${(date.getMonth() + 1)
//     .toString()
//     .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
// }

// CURRENCY

// export function numberToUsd(amount: number) {
//   const formatted = `$${amount?.toLocaleString("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })}`;
//   return formatted;
// }

export function numberToUsd(amount: number) {
  let formatted = '0'
  if(amount)formatted = `${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  formatted = `$${formatted}`;
  return formatted;
}
