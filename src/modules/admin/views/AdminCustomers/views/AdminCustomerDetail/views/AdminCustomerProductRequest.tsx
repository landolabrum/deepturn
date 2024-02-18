// ProductRequest.tsx
import React from 'react';
import styles from "./AdminCustomerProductRequest.scss";
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import { dateFormat } from '@webstack/helpers/userExperienceFormats';
import UiButton from '@webstack/components/UiButton/UiButton';

interface ProductRequestProps {
  productRequest: any;
}

const ProductRequest: React.FC<ProductRequestProps> = ({ productRequest }) => {
  return (<>
  <style jsx>{styles}</style>
    <div className='product-request'>
      <div className='product-request__header'>
        <div className='title'>Product Request</div>
        <div className='actions'>
          <div>Total: {productRequest.total}</div>
          <div>{dateFormat(Number(productRequest?.timestamp), { isTimestamp: true })}</div>
          <div>
            <UiButton size='sm' variant='lite'>Mark as Complete</UiButton>
          </div>
        </div>
      </div>
      <AdapTable
        data={productRequest?.items}
        variant='mini'
        options={{ hide: 'header' }}
      />
    </div>
    </>
  );
};

export default ProductRequest;