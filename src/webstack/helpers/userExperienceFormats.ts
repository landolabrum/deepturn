import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";
import { InvalidCell, NaCell } from "@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell";
type dateProps = string | number | Date;
type returnType = "string" | "object";
import { countries } from "@webstack/models/location";


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
type CardBrand =
  | 'amex'
  | 'diners'
  | 'discover'
  | 'eftpos_au'
  | 'jcb'
  | 'mastercard'
  | 'unionpay'
  | 'visa'
  | 'unknown';

type FormattedCard = [
  CardBrand,
  string
]

export default function formatCreditCard(cardNumber: string): FormattedCard {
  const cleaned = ('' + cardNumber).replace(/\D/g, ''); // Remove any non-numeric characters

  let brand: CardBrand = 'unknown';
  if (/^3[47]/.test(cleaned)) brand = 'amex';
  else if (/^30[0-5]|3[68]/.test(cleaned)) brand = 'diners';
  else if (/^6(?:011|5)/.test(cleaned)) brand = 'discover';
  else if (/^4/.test(cleaned)) brand = 'visa';
  else if (/^(?:2131|1800|35\d{2})/.test(cleaned)) brand = 'jcb';
  else if (/^5[1-5]/.test(cleaned)) brand = 'mastercard';
  // Add other patterns for 'eftpos_au', 'unionpay' if you have them.
  console.log("[ CARD-Brand ]:", brand)
  let formatted: string[] = [];
  switch (brand) {
    case 'visa':
    case 'mastercard':
      // Format: xxxx xxxx xxxx xxxx
      formatted = cleaned.match(/(\d{1,4})/g) || [];
      break;

    case 'amex':
      // Format: 34xx xxxxxx xxxxx
      formatted = cleaned.match(/(\d{1,4})(\d{1,6})(\d{1,5})/) || [];
      break;

    default:
      return [ brand, cleaned ]; // If an unknown brand, return the cleaned card number.
  }

  const formattedNumber = formatted.filter((n: string) => n).join(' '); // Filter and join
  return [ brand, formattedNumber ];
}

// type CardBrand =
//   | 'amex'
//   | 'diners'
//   | 'discover'
//   | 'eftpos_au'
//   | 'jcb'
//   | 'mastercard'
//   | 'unionpay'
//   | 'visa'
//   | 'unknown';

// interface FormattedCard {
//   brand: CardBrand;
//   formattedNumber: string;
// }

// export default function formatCreditCard(cardNumber: string): FormattedCard {
//   const cleaned = ('' + cardNumber).replace(/\D/g, ''); // Remove any non-numeric characters

//   let brand: CardBrand = 'unknown';
//   if (/^3[47]/.test(cleaned)) brand = 'amex';
//   else if (/^3(?:0[0-5]|[68])/.test(cleaned)) brand = 'diners';
//   else if (/^6(?:011|5)/.test(cleaned)) brand = 'discover';
//   else if (/^4/.test(cleaned)) brand = 'visa';
//   else if (/^(?:2131|1800|35\d{3})/.test(cleaned)) brand = 'jcb';
//   else if (/^5[1-5]/.test(cleaned)) brand = 'mastercard';
//   // Add other patterns for 'eftpos_au', 'unionpay' if you have them.

//   let formatted: any = '';
//   switch (brand) {
//     case 'visa':
//     case 'mastercard':
//       // Format: xxxx xxxx xxxx xxxx
//       formatted = cleaned.match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/)!.slice(1);
//       break;

//     case 'amex':
//       // Format: 34xx xxxxxx xxxxx
//       formatted = cleaned.match(/(\d{0,4})(\d{0,6})(\d{0,5})/)!.slice(1);
//       break;

//     default:
//       return { brand, formattedNumber: cleaned }; // If an unknown brand, return the cleaned card number.
//   }

//   const formattedNumber = formatted.filter((n: string) => n).join(' '); // Filter and join
//   return { brand, formattedNumber };
// }

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
export function getYearsArray(length:number, asStrings=true):(string | number)[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: length }, (_, i) => asStrings?(currentYear + i).toString():currentYear + i);
}
export function dateFormat(
  suppliedDate: dateProps,
  options: OptionsProps = {
    time: false,
    returnType: "string",
    format: "MM-DD-YYYY",
    server: false,
    isTimestamp: false
  }
): string | string[] | React.ReactElement {
  if(options.isTimestamp === true && typeof(suppliedDate)==='number'){
    const dateObj = new Date(suppliedDate * 1000); // Convert seconds to milliseconds
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString();
    return `${date} ${time}`;
  }
  else if (options.server) {
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

export function numberToUsd(amount: number) {
  if(!amount)return "loading"
  // let formatted = '0'
  // if(amount)formatted = `${amount.toLocaleString("en-US", {
  //   minimumFractionDigits: 2,
  //   maximumFractionDigits: 2,
  // })}`;
  // formatted = `$${formatted}`;
  // return formatted;
  const formattedAmount = (amount / 100).toFixed(2);
  return `$${formattedAmount}`;
}
export function calculateCartTotal(cart: any) {
  let total = 0;
  for (let product of cart) {
      if (product.price_object && product.price_object.unit_amount && product.price_object.qty) {
          total += product.price_object.unit_amount * product.price_object.qty;
      }
  }
  return numberToUsd(total);
}