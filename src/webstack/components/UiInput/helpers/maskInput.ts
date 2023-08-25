import formatCreditCard from "@webstack/helpers/userExperienceFormats";

const currentYear = new Date().getFullYear() % 100; // Get last two digits of the current year


const maskInput = (e: any, type?: string) => {
    const newValue = e.target?.value;
    let context:any = newValue;
    // METHOD EXPIRATION
    if (type === "expiry" && newValue.length >= 1) {
        const numericValue = newValue.replace(/\D/g, ""); // Remove non-numeric characters
        if (numericValue.length === 1) {
            if (numericValue === "1") {
                context = "1";
            } else if (numericValue >= "2") {
                context = `0${numericValue}`;
            }
        } else if (numericValue.length >= 2) {
            const month = numericValue.slice(0, 2);
            const year = numericValue.slice(2, 4);
            if (Number(year) < currentYear && numericValue.length >= 4) {
                // Restrict year to be current year or above

                context = `${month}/${currentYear}`;
            } else {
                context = year?`${month}/${year}`:`${month}`;
            }
        }
        //  DEFAULT
    }
    else if (e.target.name == 'number') {
        const errorIcon = "fa-exclamation-triangle";
        const [_brand, formattedNumber]: any = formatCreditCard(e.target.value);
        if(_brand !== 'unknown')context = _brand;
        if(_brand == 'unknown'){
            context = errorIcon;
        }
        return [formattedNumber, context];
    }
    return [context, undefined];
};
export default maskInput;