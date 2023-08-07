import React from 'react';
import styles from './CartList.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { ICartItem } from '../../model/ICartItem';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import UiPill from '@webstack/components/UiPill/UiPill';
import ProductImage from '~/src/modules/products/components/ProductImage/ProductImage';

// Remember to create a sibling SCSS file with the same name as this component

const CartList: React.FC<any> = ({ cart, handleQty }: { cart: ICartItem[], handleQty: (x: any, y: any) => void; }) => {
    if (!cart) return "no cart"
    return (
        <>
            <style jsx>{styles}</style>
            <AdaptGrid xs={1}>
                {cart &&
                    cart.map((item, key) => (
                        <div className="cart-list" key={key}>
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
        </>
    );
};

export default CartList;