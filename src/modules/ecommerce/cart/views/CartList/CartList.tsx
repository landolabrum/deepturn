import styles from './CartList.scss';
import { ICartItem } from '../../model/ICartItem';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import UiPill from '@webstack/components/UiPill/UiPill';
import ProductImage from '~/src/modules/ecommerce/products/components/ProductImage/ProductImage';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import ProductBuyNow from '../../../products/components/ProductBuyNow/ProductBuyNow';


// Remember to create a sibling SCSS file with the same name as this component

const CartList: React.FC<any> = ({ cart, handleQty, collapse = false }: { cart: ICartItem[], handleQty: (item: any) => void; collapse?: boolean }) => {
    if (!cart) return "no cart";
    const CartItems = ({ fullWidth }: { fullWidth?: boolean }) => {
        return <>
            <style jsx>{styles}</style>
            <div className='cart-list'>
                <AdaptGrid xs={1}>
                    {cart &&
                        cart.map((item, key) => (
                            // item?.price_object.qty > 0 &&
                            <div className="cart-list__item" key={key}>
                                <div className="cart-list-content" >
                                    <div className="cart-list-product">
                                        {typeof (item?.images) === "string" && <ProductImage image={item.images} options={{ size: "150px" }} />}
                                        <div className="cart-list-info">
                                            <div className="cart-list-product-info">
                                                <div className="cart-list-name">
                                                    {item?.name}
                                                </div>
                                                <div className="cart-list-description">
                                                    {item?.description}
                                                </div>
                                            </div>
                                            <div className="cart-list-price">
                                                {item?.price}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="cart-list-qty">
                                    <ProductBuyNow product={item} cart={cart} setCart={(it: any) => {
                                        handleQty(it);
                                    }} />
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