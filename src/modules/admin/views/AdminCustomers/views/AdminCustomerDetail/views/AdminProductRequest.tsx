// ProductRequest.tsx
import React from 'react';
import styles from "./AdminProductRequest.scss";
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import { dateFormat } from '@webstack/helpers/userExperienceFormats';
import UiButton from '@webstack/components/UiButton/UiButton';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import environment from '~/src/environment';

interface ProductRequestProps {
  productRequest: any;
  customer_id:string
}

const AdminProductRequest: React.FC<ProductRequestProps> = ({ productRequest, customer_id: customerId }) => {
  const memberService = getService<IMemberService>("IMemberService");
  const encryptData = async () =>{
    if(!customerId){
      console.error('ERROR:no customer id,[ AdminProductRequest (encryptData) ]')
      return;
    }
    try {
      const response = await memberService.encryptMetadataJWT({
        encryptionData:productRequest,
        customer_id:customerId,
        metadata_key_name:`${environment.merchant.mid}.prod_req.done.configure`,
      });
    if(response){
      console.log("[ ENCRYPT RESPONSE PRODUCT REQUEST ( SUCCESS ) ]", response)
    }
    } catch (error:any) {
      console.error("[ EncRypT ErroR ]", error);
    }
  }
  return (<>
  <style jsx>{styles}</style>
    <div className='product-request'>
      <div className='product-request__header'>
        <div className='title'>Product Request</div>
        <div className='actions'>
          <div>Total: {productRequest.total}</div>
          <div>{dateFormat(Number(productRequest?.timestamp), { isTimestamp: true })}</div>
          <div>
            <UiButton onClick={()=>{encryptData()}} size='sm' variant='lite'>Mark as Complete</UiButton>
          </div>
        </div>
      </div>
      <AdapTable
        data={productRequest?.items}
        variant='mini'
        options={{ hide: 'header' }}
      />
      {JSON.stringify(productRequest.items)}
    </div>
    </>
  );
};

export default AdminProductRequest;