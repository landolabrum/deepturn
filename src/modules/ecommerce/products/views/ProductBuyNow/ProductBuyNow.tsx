import styles from './ProductBuyNow.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import UiPill from '@webstack/components/UiPill/UiPill';
import { ICartItem } from '../../../cart/model/ICartItem';
import { useNotification } from '@webstack/components/Notification/Notification';
import { useEffect, useState } from 'react';
import { numberToUsd } from '@webstack/helpers/userExperienceFormats';


const ProductBuyNow: React.FC<any> = ({ product, cart, setCart, traits }: any) => {

    const [label, setLabel] = useState<string | null>(null);
    let cookieProduct = cart?.find((item: ICartItem) => item.id === product.id);
    const qty = cookieProduct?.price_object?.qty ? cookieProduct.price_object.qty : 0;
    const [notif, setNotif] = useNotification();
    const handleCart = (newQty?: number) => {
        product.price_object.qty = newQty;
        setCart(product);
        setNotif({
            active: true,
            list: [{ label: product?.name, message: "added to cart", href: "cart" }]
        })
    }


    useEffect(() => {
        const price_object = product?.price_object;
        setLabel(
            `${numberToUsd(product.price_object?.unit_amount)} ${price_object?.recurring?.interval ? ' / ' + price_object?.recurring?.interval : ''}`
        )
    }, [product]);
    return <>
        <style jsx>{styles}</style>
        {qty == 0 ? (
            <UiButton
                variant='dark'
                onClick={() => handleCart(1 + qty)}
                traits={traits}
            >
                    {label || 'add'}
            </UiButton>
        ) : (
            <UiPill traits={traits} variant="center dark" amount={qty} setAmount={handleCart} />
        )
        }
    </>;
};

export default ProductBuyNow;

// const mockProduct = { 
//     "id": "prod_OjLRt77tfxiSJ2",
//     "description": "Subscription 1 Description 1.",
//     "name": "Subscription 1",
//     "created": "9/29/2023 8:17:29 PM",
//     "images": "https://files.stripe.com/links/MDB8YWNjdF8xRzM4SVhJb2RlS1pSTERWfGZsX3Rlc3RfS01ORlBVUzVIeW1CZ004MU1ZeWxnd20400PhULWtTH",
//     "price_object": { 
//         "id": "price_1NvskHIodeKZRLDVcmvDIz43",
//         "object": "price",
//         "active": true, 
//         "billing_scheme": "per_unit",
//         "created": 1696040249, 
//         "currency": "usd",
//         "custom_unit_amount": null, 
//         "livemode": false,
//         "lookup_key": null,
//         "metadata": {},
//         "nickname": null,
//         "product": "prod_OjLRt77tfxiSJ2",
//         "recurring": {
//             "aggregate_usage": null,
//             "interval": "month",
//             "interval_count": 1,
//             "trial_period_days": null,
//             "usage_type": "licensed"
//         },
//         "tax_behavior": "exclusive",
//         "tiers_mode": null,
//         "transform_quantity": null,
//         "type": "recurring",
//     "unit_amount": 6900, "unit_amount_decimal": "6900" }, "type": "service",
//     "price": "$69.00",
//     "metadata": { "category": "subscription" } }
