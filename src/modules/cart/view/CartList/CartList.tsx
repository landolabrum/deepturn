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
                        <div className="cart__item" key={key}>
                            <div className="cart__item-product">
                                {typeof (item?.images) === "string" && <ProductImage image={item.images} options={{ size: 100 }} />}
                                <div className="cart__item-info">
                                    <div className="cart__item-product-info">
                                        <div className="cart__item-name">
                                            {item?.name}
                                        </div>
                                        <div className="cart__item-description">
                                            {item?.description}
                                        </div>
                                    </div>
                                    <div className="cart__item-price">
                                        {item?.price}
                                    </div>
                                </div>
                            </div>
                            <div className="cart__item-qty">
                                <UiPill
                                    amount={item?.price_object?.qty}
                                    setAmount={(qty) => {
                                        handleQty(item, qty);
                                    }}
                                />
                            </div>
                        </div>
                    ))
                }
            </AdaptGrid>
        </>
    );
};

export default CartList;