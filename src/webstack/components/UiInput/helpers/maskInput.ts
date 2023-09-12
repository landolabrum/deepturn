import formatCreditCard from "@webstack/helpers/userExperienceFormats";
import { useEffect } from "react";

const currentYear = new Date().getFullYear() % 100;

const maskInput = (e: any, type?: string) => {
    let newValue = e.target?.value || "";
    
    // For Expiry Type
    if (type === "expiry") {
        newValue = newValue.replace(/\D/g, "");
        if (newValue.length === 1 && newValue > "1") {
            newValue = `0${newValue}`;
        } else if (newValue.length >= 2) {
            const month = newValue.slice(0, 2);
            const year = newValue.slice(2, 4);
            
            newValue = year ? `${month}/${year}` : `${month}`;
            
            if (Number(year) < currentYear && newValue.length >= 4) {
                newValue = `${month}/${currentYear}`;
            }
        }
        return [newValue, undefined];
    }
    
    // For Card Number Input
    if (e.target.name === 'number') {
        const [_brand, formattedNumber] = formatCreditCard(newValue);
        console.log("[_brand, formattedNumber]",[_brand, formattedNumber])
        if (_brand === 'unknown') {
            return [formattedNumber, "fa-exclamation-triangle"];
        }
        
        return [formattedNumber, _brand];
    }
    // console.log("[newValue, undefined]",[newValue, undefined])
    return [newValue, undefined];
};

export default maskInput;
