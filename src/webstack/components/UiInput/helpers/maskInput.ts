import formatCreditCard from "@webstack/helpers/userExperienceFormats";

const currentDate = new Date();
const currentYear = currentDate.getFullYear() % 100;
const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed

const maskInput = (e: any, type?: string) => {
    const oldValue = e.target?.defaultValue || "";
    let newValue = e.target?.value || "";
    const isDeleting = newValue.length < oldValue.length;
    // For Expiry Type
    if (type === "expiry") {
        console.log('[ pre newValue ]', newValue)

        if (newValue.includes("/")) {
            const [monthPart, yearPart] = newValue.split("/");
            newValue = monthPart.replace(/\D/g, "") + yearPart.replace(/\D/g, "");
        } else {
            newValue = newValue.replace(/\D/g, "");
        }

        if (newValue.length === 1 && newValue > "1") {
            newValue = `0${newValue}`;
        } else if (newValue.length >= 2) {
            let month = newValue.slice(0, 2);
            let year = newValue.slice(2, 4);

            if (Number(month) > 12) {
                month = "12";
            }

            if (!isDeleting && year.length === 2 && (Number(year) < currentYear || (Number(year) === currentYear && Number(month) <= currentMonth))) {
                year = `${currentYear + 1}`;
            }

            newValue = year ? `${month}/${year}` : `${month}`;
            console.log('[ post newValue ]', newValue)
        }
        return [newValue, undefined];
    }

    // For Card Number Input
    if (e.target?.name === 'number') {
        const [_brand, formattedNumber] = formatCreditCard(newValue);
        // console.log("[_brand, formattedNumber]",[_brand, formattedNumber])
        if (_brand === 'unknown') {
            return [formattedNumber, "fa-exclamation-triangle"];
        }

        return [formattedNumber, _brand];
    }
    if (type === 'tel') {
        const inputType = e?.nativeEvent?.inputType
        const cleanPhone = e.target.value.replace(/\D+/g, '');
        const value = e.target.value;
        console.log('[ cleanPhone ]', inputType)
        const isNumber = !isNaN(value.substring(value.length -1, value.length));
        let formattedPhone = '';
        if(!isNumber)formattedPhone = cleanPhone.length == 0? 1: value.substring(0, value.length - 1);
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
                    break;
            }
        }
        return [formattedPhone, undefined];
    }
    // console.log("[newValue, undefined]",[newValue, undefined])
    return [newValue, undefined];
};

export default maskInput;
