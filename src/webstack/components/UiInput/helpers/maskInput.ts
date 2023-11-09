import formatCreditCard from "@webstack/helpers/userExperienceFormats";

const currentDate = new Date();
const currentYear = currentDate.getFullYear() % 100;
const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed

const maskInput = (e: any, type?: string) => {
    let {name, value, defaultValue }=e.target;
    // if(value == undefined)value = '';
    // console.log('maskl ] ', name, value)
    const oldValue = defaultValue || "";
    const isDeleting = value.length < oldValue.length;
    // For Expiry Type
    if (type === "expiry") {
        if (value.includes("/")) {
            const [monthPart, yearPart] = value.split("/");
            value = monthPart.replace(/\D/g, "") + yearPart.replace(/\D/g, "");
        } else value = value.replace(/\D/g, "");

        if (value.length === 1 && value > "1")value = `0${value}`;
        else if (value.length >= 2) {
            let month = value.slice(0, 2);
            let year = value.slice(2, 4);
            if (Number(month) > 12)month = "12";
            if (!isDeleting && year.length === 2 && (Number(year) < currentYear || (Number(year) === currentYear && Number(month) <= currentMonth)))year = `${currentYear + 1}`;
            value = year ? `${month}/${year}` : `${month}`;
        }
        return [value, undefined];
    }
    else if (name === 'email') {
        value.replace(/[^a-zA-Z0-9@.]+/g, "");
        const atCount = (value.match(/@/g) || []).length;
        const atIndex = value.indexOf("@");
        const dotAfterAtCount = atIndex !== -1 ? (value.substring(atIndex).match(/\./g) || []).length : 0;
        if (atCount > 1 || dotAfterAtCount > 1)value = value.substring(0, value.length - 1);
        return [value, undefined];
    }
    
    else if (name === 'phone') {
        const cleanPhone = value?.replace(/\D+/g, '');
        const inputType = e.nativeEvent?.inputType;
        let formattedPhone = '';
        const lastChar = value.substring(value.length -1, value.length);
        if(isNaN(lastChar))formattedPhone = cleanPhone.length == 0? 1: value.substring(0, value.length - 1);
        if (inputType == 'insertText') {
            switch (cleanPhone.length) {
                case 1:
                    formattedPhone = cleanPhone == '1' ? `${cleanPhone} (` : `1 (${cleanPhone}`;
                    break;
                case 5:
                    formattedPhone = `1 ( ${cleanPhone.substring(1,4)} ) ${cleanPhone.substring(4)}`;
                    break;
                case 8:
                    formattedPhone = `1 ( ${cleanPhone.substring(1,4)} ) ${cleanPhone.substring(4, 7)} - ${cleanPhone.substring(7)}`;
                    break;
                case 12:
                    formattedPhone = `1 ( ${cleanPhone.substring(1,4)} ) ${cleanPhone.substring(4, 7)} - ${cleanPhone.substring(7, 11)}`;
                    break;
                default:
                    formattedPhone = value;
                    break;
            }
        }
        // HANDLE DELETE Non NUMBER CHARS
        else if(inputType == 'deleteContentBackward')formattedPhone = value.replace(/[^0-9]*$/, '');
        return [formattedPhone, undefined];
    }
    // else if (e.target.type === 'text') return [value.replace(/[^a-zA-Z\s]+/g, '') , undefined];
    else if (e.target.type === 'number') return [ value.replace(/[^0-9]+/g, ''), undefined];
    // For Card Number Input
    else if (name === 'number' && name != 'phone') {
        const [_brand, formattedNumber] = formatCreditCard(value);
        if (_brand === 'unknown')return [formattedNumber, "fa-exclamation-triangle"];
        return [formattedNumber, _brand];
    }
    return [value, undefined];
};

export default maskInput;