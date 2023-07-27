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
