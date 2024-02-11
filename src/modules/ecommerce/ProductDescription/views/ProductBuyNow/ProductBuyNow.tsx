import styles from './ProductBuyNow.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import UiPill from '@webstack/components/UiPill/UiPill';
import { useEffect, useState } from 'react';
import { numberToUsd } from '@webstack/helpers/userExperienceFormats';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import useCart from '../../../cart/hooks/useCart'; // Adjust the path as necessary
import { ICartItem } from '../../../cart/model/ICartItem';

const ProductBuyNow: React.FC<any> = ({ product, traits }: any) => {
    const { addCartItem, cart } = useCart(); // Assuming useCart returns { addCartItem, cart }
    const [label, setLabel] = useState<string | null>(null);
    const { openModal } = useModal();
    let cookieProduct: any = cart?.find((item: any) => item.product_id === product.id); // Adjust according to your ICartItem structure
    const qty = cookieProduct?.qty || 0;

    const handleCart = (newQty?: number) => {
        const updatedProduct = { ...product, qty: newQty }; // Ensure this structure matches ICartItem
        addCartItem(updatedProduct); // Use addCartItem to update the cart
        openModal({
            confirm: {
                title: 'product added to cart',
                statements: [{ text: 'cart', href: '/cart' }, { text: 'continue shopping' }]
            }
        });
    };

    useEffect(() => {
        const price = product?.price;
        if (!product?.metadata?.hide_price) {
            setLabel(
                `${numberToUsd(product.price?.unit_amount)} ${price?.recurring?.interval ? ' / ' + price?.recurring?.interval : ''}`
            );
        } else {
            setLabel('get quote');
        }
    }, [product]);

    return (
        <>
            <style jsx>{styles}</style>
          
            {qty === 0 ? (
                <UiButton
                    variant='dark'
                    onClick={() => handleCart(1 + qty)}
                    traits={traits}
                >{label || 'add'}</UiButton>
            ) : (
                <UiPill traits={traits} variant="center dark" amount={qty} setAmount={(newQty) => handleCart(newQty + qty)} />
            )}
        </>
    );
};

export default ProductBuyNow;

