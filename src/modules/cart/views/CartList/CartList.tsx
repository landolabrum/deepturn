import styles from './CartList.scss';
import { ICartItem } from '../../model/ICartItem';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import UiPill from '@webstack/components/UiPill/UiPill';
import ProductImage from '~/src/modules/products/components/ProductImage/ProductImage';
import UiMenu from '@webstack/components/UiMenu/UiMenu';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';


// Remember to create a sibling SCSS file with the same name as this component

const CartList: React.FC<any> = ({ cart, handleQty, collapse = false }: { cart: ICartItem[], handleQty: (x: any, y: any) => void; collapse?: boolean }) => {
    if (!cart) return "no cart";
    const CartItems = ({ fullWidth }: { fullWidth?: boolean }) => {
        return <>
            <style jsx>{styles}</style>
            <div className='cart-list'>
                <AdaptGrid xs={1}>
                    {cart &&
                        cart.map((item, key) => (
                            <div className="cart-list__item" key={key}>
                                <div className="cart-list-content" >
                                    <div className="cart-list-product">
                                        {typeof (item?.images) === "string" && <div className="cart-list__product-image"><ProductImage image={item.images} options={{ size: 100 }} /></div>}
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
                                    <div className="cart-list-qty">
                                        <UiPill
                                            amount={item?.price_object?.qty}
                                            setAmount={(qty) => {
                                                handleQty(item, qty);
                                            }}
                                        />
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