import { IFormField } from "../models/IFormModel";

const handleConstraints = (e: any, constraints: IFormField['constraints']) => {
    const name = e.target.name;
    let value = e.target.value;
    // CONFORM TO LORD CREDIT CARD
    if (name == 'number') value = ('' + e.target.value.split(',')[0]).replace(/\D/g, '');
    if (name == 'expiry') value = !isNaN(Number(value));
    function maxConstraint() {
        // NO MAX? GET A PASS
        if (!constraints?.max) return true;
        const max = typeof constraints?.max == 'number' ? constraints?.max : constraints?.max?.value;
        const notMax = max && max >= Number(value.length);
        // console.log(`[ ${name} ]:`, {
        //     max: `${value.length}/${max}, isValid: ${notMax}`
        // });
        return notMax;
    }

    const checkAll = [maxConstraint,].every(fn => fn());
    return checkAll;
}

export default handleConstraints