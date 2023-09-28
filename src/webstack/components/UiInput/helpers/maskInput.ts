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
    // console.log("[newValue, undefined]",[newValue, undefined])
    return [newValue, undefined];
};

export default maskInput;
