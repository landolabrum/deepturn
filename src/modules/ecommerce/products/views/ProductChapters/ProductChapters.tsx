// Relative Path: ./ProductChapters.tsx
import React, { useEffect, useState } from 'react';
import styles from './ProductChapters.scss';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import capitalize from '@webstack/helpers/Capitalize';
import { getService } from '@webstack/common';
import IShoppingService, { IProduct } from '~/src/core/services/ShoppingService/IShoppingService';
import environment from '~/src/environment';
import { useRouter } from 'next/router';

// Remember to create a sibling SCSS file with the same name as this component

const ProductChapters = ({products}: {products?: any}) => {
    const categories = ['offgrid-box', 'garage-box', 'custom-box']
    const [products_, setProducts] = useState<any>();
    const shoppingService = getService<IShoppingService>('IShoppingService');
    const router = useRouter();
    const load = async () => {
        if (products && products?.length && !products_){ 
            setProducts(products);
            return;
        }
        try {
            const fetched = await shoppingService.getProducts();
            if (fetched?.data) {
                const validProducts = fetched.data.filter((prod: IProduct) => prod?.metadata?.mid == environment.merchant.mid);
                const prods = validProducts.map((prod: IProduct) => prod);
                setProducts(prods);
            }
        } catch (e: any) {
            alert(JSON.stringify(e))
        }
    }
    
    useEffect(() => {
        load()
    }, [setProducts]);
    return (
        <>
            <style jsx>{styles}</style>
            <ul className='product-chapters' >
                {Object(products_).length && products_.map((product: IProduct, index: number) => {
                    return <li key={index} onClick={()=>product?.price&&router.push({pathname:'/product', query:{id: product.id, pri: product.price.id}})} className='product-chapters__chapter'>
                        {/* {JSON.stringify(product)} */}
                        <div className='chapter__content'>
                            <div className='chapter__icon'>
                                {product?.images && <img width="100%" src={typeof product.images == 'string'?product?.images: product?.images[0]} />}
                            </div>
                            <div className='chapter__body'>
                                <div className='chapter__title'>
                                    {product?.name}
                                </div>
                                <div className='chapter__extras'>
                                    {`extras ${index + 1}`}
                                </div>
                            </div>
                        </div>
                    </li>
                })}
            </ul>
        </>
    );
};

export default ProductChapters;