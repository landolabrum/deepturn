import styles from './CartList.scss';
import { ICartItem } from '../../model/ICartItem';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import ProductImage from '~/src/modules/ecommerce/products/views/ProductImage/ProductImage';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import ProductBuyNow from '../../../products/views/ProductBuyNow/ProductBuyNow';
import { ITraits } from '@webstack/components/FormControl/FormControl';

// Remember to create a sibling SCSS file with the same name as this component

const CartList: React.FC<any> = ({ cart, handleQty, collapse = false, variant, traits }: { cart: ICartItem[], handleQty: (item: any) => void; collapse?: boolean, variant: string, traits: ITraits }) => {
    if (!cart) return "error code: cl1";
    const CartItems = ({ fullWidth }: { fullWidth?: boolean }) => {
        return <>
            <style jsx>{styles}</style>
            <div className='cart-list'>
                <AdaptGrid xs={1}>
                    {cart && cart.map((item, key) => (
                        <div className="cart-list__item" key={key}>
                            <div className={`cart-list__item-content ${variant == 'mini'?"cart-list__item-content-mini":''}`}>
                                <div className="cart-list__item-image" data-name={item?.name}>
                                   <ProductImage image={item.images} options={{size: "100px"}}/>
                                </div>
                                <div className={`cart-list__item-body`}>
                                    <div className="cart-list__item-name">
                                        {item?.name}
                                    </div>
                                    <div className="cart-list__item-description">
                                        {item?.description}
                                    </div>
                                    <div className="cart-list__item-amount">
                                        {item?.price}
                                    </div>
                                    </div>
                            <div className="cart-list__item-action">
                                <ProductBuyNow traits={traits} product={item} cart={cart} setCart={(it: any) => {
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