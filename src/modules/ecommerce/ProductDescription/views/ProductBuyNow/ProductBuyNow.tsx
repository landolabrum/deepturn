import styles from './ProductBuyNow.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import UiPill from '@webstack/components/UiPill/UiPill';
import { useEffect, useState } from 'react';
import { numberToUsd } from '@webstack/helpers/userExperienceFormats';
import { useModal } from '@webstack/components/modal/contexts/modalContext';
import useCart from '../../../cart/hooks/useCart'; // Adjust the path as necessary

const ProductBuyNow: React.FC<any> = ({ product, traits }: any) => {
    const { addCartItem, getCartItems } = useCart(); // Assuming useCart returns { addCartItem, cart }
    const cart = getCartItems()
    const [label, setLabel] = useState<string | null>(null);
    const { openModal } = useModal();
    let cookieProduct: any = cart?.find((item: any) => item.id === product.id); // Adjust according to your ICartItem structure
    const qty = cookieProduct?.price?.qty || 0;
    const handleCart = (newQty?: number) => {
        console.log('[ HANDLE CART ]',qty, newQty)
        addCartItem({...product, price:{...product.price,qty:Number(newQty)}}); // Use addCartItem to update the cart
        // if(newQty === 1){
        //     console.log('[ HANDLE CART (newQty === 1)]',cart, newQty)
        // }else{
        //     console.log('[ HANDLE CART (else)]',cart, newQty)

        // }
        // openModal({
        //     confirm: {
        //         title: 'product added to cart',
        //         statements: [{ text: 'cart', href: '/cart' }, { text: 'continue shopping' }]
        //     }
        // });
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
    }, [product, handleCart]);

    return (
        <>
            <style jsx>{styles}</style>
          
            {qty === 0 ? (
                <UiButton
                    variant='dark'
                    onClick={() => handleCart(1 + Number(qty))}
                    traits={traits}
                >{`${label} ${qty}` || 'add'}</UiButton>
            ) : (
                <UiPill traits={traits} variant="center dark" amount={qty} setAmount={(newQty) => handleCart(newQty )} />
            )}
        </>
    );
};

export default ProductBuyNow;

