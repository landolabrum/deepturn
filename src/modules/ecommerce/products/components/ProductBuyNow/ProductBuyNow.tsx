import React, { useCallback, useEffect, useState } from 'react';
import styles from './ProductBuyNow.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import UiPill from '@webstack/components/UiPill/UiPill';
import { ICartItem } from '../../../cart/model/ICartItem';





const ProductBuyNow: React.FC<any> = ({ product, cart, setCart }: any) => {
    const cookieProduct = cart?.find((item: ICartItem) => item.id === product.id);
    const [qty, setQty] = useState<number>(0);
    const handleCart = (nQty?: number) => {
        product.price_object.qty = nQty;
        setCart(product);
    }
    useEffect(() => {
        if(cookieProduct?.price_object.qty)setQty(cookieProduct?.price_object.qty);
    }, [handleCart]);
    if(product.price_object.qty != 0)return <UiPill variant="dark" amount={qty} setAmount={handleCart} />;
    return  <UiButton variant='dark' onClick={() => handleCart(1 + qty)}>buy</UiButton>;
};

export default ProductBuyNow;
