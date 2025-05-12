import React, { useEffect, useState } from 'react';
import styles from './ProductBuyNow.scss';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import UiPill from '@webstack/components/UiForm/components/UiPill/UiPill';
import { numberToUsd } from '@webstack/helpers/userExperienceFormats';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import useCart from '~/src/modules/ecommerce/cart/hooks/useCart';
import { ITraits } from '@webstack/components/UiForm/components/FormControl/FormControl';
import { IProduct } from '~/src/models/Shopping/IProduct';

export interface IProductBuyNow {
    product?: IProduct;
    traits?: ITraits;
    btnText?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    goToCart?:boolean;
}

const ProductBuyNow: React.FC<IProductBuyNow> = ({ product, traits, size, btnText = 'Add', goToCart=false }) => {
    // Hooks are called unconditionally at the top level
    const { addCartItem, cart } = useCart();
    const [label, setLabel] = useState<string>('add');
    const {openModal, closeModal }= useModal()
    useEffect(() => {
        if (!product) return; // Move condition inside useEffect for early return
        // The rest of your useEffect logic
        if (!btnText && !product?.metadata?.hide_price ) {
            setLabel(
                product.price?.unit_amount
                ? `${numberToUsd(product.price?.unit_amount)}${product.price?.recurring?.interval ? ' / ' + product.price?.recurring?.interval : ''}`
                : 'Label not available'
            );
        } else {
            setLabel(!product?.active?'unavailable':btnText);
        }
    }, [product, btnText]);

    if (!product) {
        return <>No Product</>;
    }
    const isDisabled = !product?.active || !product?.price?.id;
    let cookieProduct: any = cart?.find((item: any) => item.price.id === product.price.id);
    const qty = cookieProduct?.price?.qty || 0;

    const handleCart = (newQty?: number) => {
        addCartItem({...product, price: {...product.price, qty: Number(newQty)}}); 
        if(goToCart && newQty)openModal({title:`${product.name}, added to cart`, confirm:{statements:[{label:'go to cart', href:'/cart'}, {label:'back', onClick:()=>closeModal()}]}})
    };

    return (
        <>
            <style jsx>{styles}</style>
            {qty === 0 ? (
                <UiButton
                    onClick={() => handleCart(1 + Number(qty))}
                    traits={traits}
                    disabled={isDisabled}
                    size={size}
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
