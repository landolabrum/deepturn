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
    const adaptToUiSelect = (data: any) => Object.entries(data).map(([k, v]) => { return { href: v, label: v } });
    const findState = (id: string) => {
        id = String(id).toLowerCase()
        const usersState: any = Object.entries(states).find(([iso, val]: any) => iso == id);
        if (usersState?.length) return usersState[1];
        return 'false'
    }
    console.log(findState('ut'))
    function iT(data: any, width?: string) {
        Object.entries(data).forEach(([field, value]) => {
            const remove = !Boolean(AccountFormRemoveFields.includes(field));
            const useChild = !Boolean(AccountFormChildFields.includes(field));
            if (remove && useChild) newData.push({
                name: field,
                label: field,
                value: field == 'phone' && typeof value == 'string' ? phoneFormat(value, 'US') :
                    field == 'state' ? findState(value) : value,
                width: width,
                max: field == 'phone' ? 15 : null,
                traits: ['state', 'country'].includes(field) ? { height: '500px' } : {},
                type: ['country', 'state'].includes(field) ? 'select' : 'text',
                options: ['country', 'state'].includes(field) && field == 'country' ?
                    adaptToUiSelect(countries) : field == 'state' && adaptToUiSelect(states)
            });
            if (!useChild) iT(value, 'calc(50% - 5px)');
        });
    }
    data && iT(data)
    return newData.reverse();
}
export default formatAccountForm;