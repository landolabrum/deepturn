// ProductRequest.tsx
import React, { useEffect, useState } from 'react';
import styles from "./AdminProductSurvey.scss";
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import { dateFormat } from '@webstack/helpers/userExperienceFormats';
import UiButton from '@webstack/components/UiButton/UiButton';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import environment from '~/src/core/environment';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import capitalize from '@webstack/helpers/Capitalize';

interface IAdminProductSurvey {
  productSurvey: {
    id: string;
    merchant_id: string;
    created: string;
    completed?: string;
    data: { [key: string]: string; }
  };
  customer_id: string
}

const AdminProductSurvey: React.FC<IAdminProductSurvey> = ({ productSurvey, customer_id: customerId }) => {
  const [tableData, setTableData] = useState<any>()
  const MemberService = getService<IMemberService>("IMemberService");
  const user = useUser();
  const complete = Boolean(productSurvey?.completed);
  const encryptData = async () => {
    if (!customerId) {
      console.error('ERROR:no customer id,[ AdminProductRequest (encryptData) ]')
      return;
    }
    const request = {
      encryptionData: {
        ...productSurvey,
        completed: new Date().getTime(),
        sales_rep: user?.id || 'none'
      },
      customer_id: customerId,
      metadata_key_name: `survey.${environment.merchant.mid}.configure`,
    }
    try {
      const response = await MemberService.encryptMetadataJWT({
        encryptionData: {
          ...productSurvey,
          completed: new Date().getTime(),
          sales_rep: user?.id || 'none'
        },
        customer_id: customerId,
        metadata_key_name: `survey.${environment.merchant.mid}.configure`,
      });
      if (response) {
        console.log("[ ENCRYPT RESPONSE PRODUCT REQUEST ( SUCCESS ) ]", response)
      }
    } catch (error: any) {
      console.error("[ EncRypT ErroR ]", error);
    }
  }
  const tableTotal = tableData && Object.values(tableData).reduce((acc: any, item: any) => acc + item.value, 0)
  const ProductHeaderInfo = ({name, value}:{name:string, value:string})=>{
    return <>
        <style jsx>{styles}</style>
        <div className='product-request__header-info'>
          <div className='product-request__header-info--name'>{name}</div>
          <div className='product-request__header-info--value'>{value}</div>
        </div>
    </>
  }
  useEffect(() => {
    if (productSurvey?.data) {
        const val = Object.entries(productSurvey.data).map(([infoItem,value]) => ({
          name:keyStringConverter(infoItem),
          value:value
        }));
        setTableData(val)
    }
  }, [productSurvey])
  return (<>
    <style jsx>{styles}</style>
    <div className='product-request'>
      <div className='product-request__header'>
        <h3 className='title'>{capitalize(productSurvey.id)} Request</h3>
        <div className='actions'>
          {tableTotal &&
            <div>Total: {tableTotal}</div>
          }
          {productSurvey?.created && 
          <ProductHeaderInfo 
            name='created' 
            value={`${dateFormat(Number(productSurvey?.created), { isTimestamp: true })}`}/>
          }
          {complete &&
          <ProductHeaderInfo 
          name='completed' 
          value={`${dateFormat(Number(productSurvey?.completed), { isTimestamp: true })}`}/>
        }

          <div>
            <UiButton
              onClick={() => { encryptData() }}
              size='sm'
              variant={complete?'disabled':'lite'}
              disabled={complete}
              >
                {complete?"Completed":'Mark as Complete'}
              </UiButton>
          </div>
        </div>
      </div>
      <AdapTable
        data={tableData}
        variant='mini'
        options={{ hide: 'header' }}
      />
    </div>
  </>
  );
};

export default AdminProductSurvey;