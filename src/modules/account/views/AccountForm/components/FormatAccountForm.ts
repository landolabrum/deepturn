import { phoneFormat } from "@webstack/helpers/userExperienceFormats";
import { countries, states } from "@webstack/models/location";

const AccountFormRemoveFields = [
    'id',
    'object',
    'balance',
    'default_source',
    'delinquent',
    'invoice_settings',
    'invoice_prefix',
    'currency',
    'metadata',
    'preferred_locales',
    'next_invoice_sequence',
    'methods',
    'description',
    'livemode',
    'test_clock',
    'tax_exempt',
    'exp',
    'created',
    'shipping',
    'discount'
];
const AccountFormChildFields = ['address'];
const formatAccountForm = (data: any) => {
    let newData: any = [];
    const optionMaker = (data: any) => Object.entries(data).map(([k, v]) => { return { label: v, href: k } });
    function iT(data: any, width?: string) {
        Object.entries(data).forEach(([field, value]) => {
            const remove = !Boolean(AccountFormRemoveFields.includes(field));
            const useChild = !Boolean(AccountFormChildFields.includes(field));
            if (remove && useChild) newData.push({
                name: field,
                label: field,
                value: field == 'phone' && typeof value == 'string' ? phoneFormat(value, 'US') : value,
                width: width,
                max: field == 'phone' ? 15 : null,
                type: ['country', 'state'].includes(field) ? 'select' : 'text',
                options: ['country', 'state'].includes(field) && field == 'country' ?
                    optionMaker(countries) : optionMaker(states)
            });
            if (!useChild) iT(value, '50%');
        });
    }
    data && iT(data)
    return newData.reverse();
}
export default formatAccountForm;