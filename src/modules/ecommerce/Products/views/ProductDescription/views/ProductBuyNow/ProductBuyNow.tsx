import React, { useEffect, useState } from 'react';
import styles from './ProductBuyNow.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import UiPill from '@webstack/components/UiPill/UiPill';
import { numberToUsd } from '@webstack/helpers/userExperienceFormats';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import useCart from '~/src/modules/ecommerce/cart/hooks/useCart';
import { ITraits } from '@webstack/components/FormControl/FormControl';
import { IProduct } from '~/src/models/Shopping/IProduct';

export interface IProductBuyNow {
    product?: IProduct;
    traits?: ITraits;
    btnText?: string;
}

const ProductBuyNow: React.FC<IProductBuyNow> = ({ product, traits, btnText = 'Add' }) => {
    // Hooks are called unconditionally at the top level
    const { addCartItem, getCartItems } = useCart();
    const [label, setLabel] = useState<string>('add');
    const { openModal } = useModal(); // Assuming this is used elsewhere in the component

    useEffect(() => {
        if (!product) return; // Move condition inside useEffect for early return
        // The rest of your useEffect logic
        if (!btnText && !product?.metadata?.hide_price) {
            setLabel(
                product.price?.unit_amount
                ? `${numberToUsd(product.price?.unit_amount)}${product.price?.recurring?.interval ? ' / ' + product.price?.recurring?.interval : ''}`
                : 'Label not available'
            );
        } else {
            setLabel(btnText);
        }
    }, [product, btnText]);

    if (!product) {
        return <>No Product</>;
    }

    const cart = getCartItems();
    let cookieProduct: any = cart.find((item: any) => item.id === product.id);
    const qty = cookieProduct?.price?.qty || 0;

    const handleCart = (newQty?: number) => {
        addCartItem({...product, price: {...product.price, qty: Number(newQty)}}); 
    };

    return (
        <>
            <style jsx>{styles}</style>
            {qty === 0 ? (
                <UiButton
                    onClick={() => handleCart(1 + Number(qty))}
                    traits={traits}
                    variant='primary'
                >
                    {label}
                </UiButton>
            ) : (
                <UiPill
                    traits={traits}
                    variant="center dark"
                    amount={qty}
                    setAmount={(newQty) => handleCart(newQty)}
                />
            )}
        </>
    );
};

export default ProductBuyNow;
