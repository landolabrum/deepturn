// Relative Path: ./ProductBuildCheckList.tsx
import React, { useEffect } from 'react';
import styles from './ProductBuildCheckList.scss';
import UiButton from '@webstack/components/UiForm/components/UiButton/UiButton';
import keyStringConverter from '@webstack/helpers/keyStringConverter';

// Remember to create a sibling SCSS file with the same name as this component
interface IProductBuildList {
  list: any;
  onRemove?: (e: any) => void;
}
const ProductBuildCheckList: React.FC<IProductBuildList> = ({ list, onRemove }: IProductBuildList) => {

  useEffect(() => { }, [list]);
  if (!list || !list.length) return <small> - </small>;

  return (
    <>
      <style jsx>{styles}</style>
      <div className="product-build-checklist">
        <h2>Selection</h2>
        <div className="product-build-checklist__items">
          {list.map((item: any, index: number) => (
            <span key={index} className="product-build-checklist__item">
              <UiButton
                size='sm'
                onClick={() => onRemove && onRemove(item)}
              >
                {
                  (Object.keys(item)?.[0]?.includes("-")
                    ? keyStringConverter(Object.keys(item)?.[0])
                    : Object.keys(item)?.[0]) as React.ReactNode
                }: {
                  (typeof Object.values(item)?.[0] === 'string' && String(Object.values(item)?.[0])?.includes("-")
                    ? keyStringConverter(Object.keys(item)?.[0])
                    : Object.values(item)?.[0]) as React.ReactNode
                }
              </UiButton>
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductBuildCheckList;