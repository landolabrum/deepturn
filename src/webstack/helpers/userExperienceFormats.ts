import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";
import { InvalidCell, NaCell } from "@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell";
type dateProps = string | number | Date;
type returnType = "string" | "object";
import { countries, states } from "@webstack/models/location";


interface OptionsProps {
  time?: boolean;
  returnType?: returnType;
  format?: "MM-DD-YYYY" | "MM-YYYY";
  server?: boolean;
  isTimestamp?: boolean;
}



export function stringToKebab(str?: string) {
  if (!str) return "";
  return str.toLowerCase().replaceAll(" ", "-");
}

// PHONE FORMAT


export const phoneFormat = (
  phoneNumber?: string | null,
  countryCode: string = 'US',
  reverse: boolean = false
): string => {
  const phoneUtil = PhoneNumberUtil.getInstance();
  let formattedNumber = phoneNumber;
  if(formattedNumber == null )return 'n/a';
  if (reverse) {
    const cleanedNumber = formattedNumber.replace(/\D/g, '');
    if (cleanedNumber.startsWith('1')) {
      return `+${cleanedNumber}`;
    } else {
      return `+1${cleanedNumber}`;
    }
  }

  try {
    const parsedNumber = phoneUtil.parseAndKeepRawInput(
      formattedNumber,
      countryCode
    );
    formattedNumber = phoneUtil.format(
      parsedNumber,
      PhoneNumberFormat.NATIONAL
    );
  } catch (e) {
    return formattedNumber;
  }

  return formattedNumber;
};

export type IMethodBrand = 'unknown' | 'amex' | 'diners' | 'discover' | 'visa' | 'jcb' | 'mastercard' | 'eftpos_au' | 'unionpay';
type FormattedCard = [IMethodBrand, string];

export default function formatCreditCard(cardNumber: string): FormattedCard {
    const brands = [
        {regex: /^3[47]/, name: 'amex', format: [4, 6, 5], maxLength: 15},
        {regex: /^30[0-5]|3[68]/, name: 'diners', format: [4, 4, 4, 4], maxLength: 16},
        {regex: /^6(?:011|5)/, name: 'discover', format: [4, 4, 4, 4], maxLength: 16},
        {regex: /^4/, name: 'visa', format: [4, 4, 4, 4], maxLength: 16},
        {regex: /^(?:2131|1800|35\d{2})/, name: 'jcb', format: [4, 4, 4, 4], maxLength: 16},
        {regex: /^5[1-5]/, name: 'mastercard', format: [4, 4, 4, 4], maxLength: 16},
        {regex: /^(?:502[0259]|508[59]|6[37])/, name: 'eftpos_au', format: [4, 4, 4, 4], maxLength: 16},
        {regex: /^62[0-5]/, name: 'unionpay', format: [4, 4, 4, 4], maxLength: 16}
    ];
    
    const cleaned = cardNumber.replace(/\D/g, ''); // Remove any non-numeric characters

    let brand: IMethodBrand = 'unknown';
    let format: number[] = [16];
    let maxLength = 16;

    for (const b of brands) {
        if (b.regex.test(cleaned)) {
            brand = b.name as IMethodBrand;
            format = b.format;
            maxLength = b.maxLength;
            break;
        }
    }

    let formattedNumber = cleaned.slice(0, maxLength);
    let position = 0;
    formattedNumber = format.map((length) => {
        const part = cleaned.substr(position, length);
        position += length;
        return part;
    }).filter(Boolean).join(' ');

    return [brand, formattedNumber];
}




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
export function stateFormat(stateISO: string) {
  const stateCodes: { [key: string]: string } = states;
  if (stateISO?.toLowerCase() in states) {
    stateISO = stateCodes[stateISO?.toLowerCase()];
    return stateISO;
  } else {
    return stateISO ? stateISO.toUpperCase() : NaCell();
  }
}

// DATES
// let monthFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// let dayFull = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

export const dowArray = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
export const monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getYearsArray(length: number, asStrings = true): (string | number)[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: length }, (_, i) => asStrings ? (currentYear + i).toString() : currentYear + i);
}

export function dateFormat(
  suppliedDate:any,
  options:any = {
    time: false,
    returnType: "string",
    format: "MM-DD-YYYY",
    server: false,
    isTimestamp: false
  }
) {
  if (options.isTimestamp === true && typeof suppliedDate === 'number') {
    // Check if the timestamp is in seconds (Unix timestamp), then convert to milliseconds
    if (suppliedDate.toString().length === 10) {
      suppliedDate *= 1000;
    }
    const date = new Date(suppliedDate);
    const formattedDate = date.getFullYear() + "-" +
      String(date.getMonth() + 1).padStart(2, '0') + "-" +
      String(date.getDate()).padStart(2, '0') + " " +
      String(date.getHours()).padStart(2, '0') + ":" +
      String(date.getMinutes()).padStart(2, '0') + ":" +
      String(date.getSeconds()).padStart(2, '0');
  
    return formattedDate;
  }
  else if (options.server) {
    const date = new Date(suppliedDate);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  } else {
    if (typeof suppliedDate === "string") suppliedDate = new Date(suppliedDate);
    const mDY = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const mY = {
      month: "short",
      year: "numeric",
    };
    const timeOptions = {
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
      if (dateString.length < 8) return "InvalidCell()";
      return dateString;
    } catch (e) {
      return "NaCell()";
    }
  }
}

export function colorPercentage(percentage: number, colorReverse?: boolean, background?: { start: string, end: string }) {
  // Extract color components from the background start and end if provided
  const startRed = background ? parseInt(background.start.substring(0, 2), 16) : parseInt(colorReverse ? "ff" : "33", 16);
  const startGreen = background ? parseInt(background.start.substring(2, 4), 16) : parseInt(colorReverse ? "00" : "ff", 16);
  const endRed = background ? parseInt(background.end.substring(0, 2), 16) : parseInt(colorReverse ? "33" : "ff", 16);
  const endGreen = background ? parseInt(background.end.substring(2, 4), 16) : parseInt(colorReverse ? "ff" : "00", 16);

  // Calculate the red and green components based on the percentage
  const red = Math.round((startRed - endRed) * (percentage / 100) + endRed);
  const green = Math.round((startGreen - endGreen) * (percentage / 100) + endGreen);

  // Construct the color string
  const color = `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}00`;

  return color;
}
export function numberToUsd(amount: number) {
  if (!amount) return "loading"
  const formattedAmount = (amount / 100).toFixed(2);
  return `$${formattedAmount}`;
}
export function calculateCartTotal(cart: any) {
  if (!cart) return 0;
  let total = 0;
  for (let product of cart) {
    if (product.price && product.price.unit_amount && product.price.qty) {
      total += product.price.unit_amount * product.price.qty;
    }
  }
  return numberToUsd(total);
}