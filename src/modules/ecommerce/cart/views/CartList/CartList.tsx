import styles from './CartList.scss';
import { ICartItem } from '../../model/ICartItem';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import UiPill from '@webstack/components/UiPill/UiPill';
import ProductImage from '~/src/modules/ecommerce/products/views/ProductImage/ProductImage';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import ProductBuyNow from '../../../products/views/ProductBuyNow/ProductBuyNow';


// Remember to create a sibling SCSS file with the same name as this component

const CartList: React.FC<any> = ({ cart, handleQty, collapse = false }: { cart: ICartItem[], handleQty: (item: any) => void; collapse?: boolean }) => {
    if (!cart) return "error code: cl1";
    const CartItems = ({ fullWidth }: { fullWidth?: boolean }) => {
        return <>
            <style jsx>{styles}</style>
            <div className='cart-list'>
                <AdaptGrid xs={1}>
                    {cart && cart.map((item, key) => (
                        <div className="cart-list__item" key={key}>
                            <div className="cart-list__item-content">
                                <div className="cart-list__item-image">
                                    {typeof (item?.images) === "string" && <ProductImage image={item.images} options={{ size: "150px" }} />}
                                </div>
                                    <div className="cart-list__item-name">
                                        {item?.name}
                                    </div>
                                    <div className="cart-list__item-description">
                                        {item?.description}
                                    </div>
                                    <div className="cart-list__item-amount">
                                        {item?.price}
                                    </div>
                            <div className="cart-list__item-action">
                                <ProductBuyNow product={item} cart={cart} setCart={(it: any) => {
                                    handleQty(it);
                                }} />
                            </div>
                            </div>
                        </div>
                    ))
                    }
                </AdaptGrid>
            </div>
        </>
    }
    if (collapse) return <UiCollapse label={`Order Summary `}>
        <CartItems fullWidth />
    </UiCollapse>;
    return <CartItems />
};

export default CartList;