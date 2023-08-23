import { IMethod } from "../model/IMethod";


const methodReduce = (methods: IMethod[], hide: string[] = []) => {
    if (!methods) return;
    let fullData = methods.map((item:any) => ({
        id: item.id,
        object: item.object,
        
        customer: item.customer,

        brand: item.card.brand,
        last4: item.card.last4,
        exp_month: item.card.exp_month,
        exp_year: item.card.exp_year,

        city: item.billing_details.address.city,
        country: item.billing_details.address.country,
        line1: item.billing_details.address.line1,
        line2: item.billing_details.address.line2,
        postal_code: item.billing_details.address.postal_code,
        state: item.billing_details.address.state,

        fingerprint: item.card.fingerprint,
        funding: item.card.funding,
        generated_from: item.card.generated_from,
        networks: item.card.networks,
        'three_d_secure_usage-supported': item.card.three_d_secure_usage.supported,
        wallet: item.card.wallet,
        created: item.created,
        livemode: item.livemode,
        type: item.type
    }));

    let visibleData:any = fullData.map(item => {
        let itemCopy:any = { ...item }; // clone the item
        hide.forEach(prop => {
            if ( itemCopy.hasOwnProperty(prop)) {
                delete itemCopy[prop];
            }
        });
        return itemCopy;
    });

    return [fullData, visibleData];
}

export default methodReduce;
 