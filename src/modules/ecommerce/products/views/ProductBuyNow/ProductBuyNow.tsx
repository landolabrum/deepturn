import styles from './ProductBuyNow.scss';
import UiButton from '@webstack/components/UiButton/UiButton';
import UiPill from '@webstack/components/UiPill/UiPill';
import { ICartItem } from '../../../cart/model/ICartItem';


const ProductBuyNow: React.FC<any> = ({ product, cart, setCart, label = "add", traits }: any) => {
    let cookieProduct = cart?.find((item: ICartItem) => item.id === product.id);
    const qty = cookieProduct?.price_object?.qty ? cookieProduct.price_object.qty : 0;
    const handleCart = (newQty?: number) => {
        product.price_object.qty = newQty;
        setCart(product);
    }
    return <>
        <style jsx>{styles}</style>
        {qty == 0 ? (
            <UiButton variant='dark' onClick={() => handleCart(1 + qty)}>{label}</UiButton>
        ) : (
            <UiPill traits={traits} variant="center dark" amount={qty} setAmount={handleCart} />
        )
        }
    </>;
};

export default ProductBuyNow;
