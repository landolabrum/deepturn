// Relative Path: ./Documents.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Documents.scss';
import UserContext from '~/src/models/UserContext';
import { getService } from '@webstack/common';
import IShoppingService from '~/src/core/services/ShoppingService/IShoppingService';
import environment from '~/src/environment';
import UiButton from '@webstack/components/UiButton/UiButton';
import capitalize from '@webstack/helpers/Capitalize';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import { useLoader } from '@webstack/components/Loader/Loader';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import useScroll from '@webstack/hooks/useScroll';
import UiInput from '@webstack/components/UiInput/UiInput';




// Remember to create a sibling SCSS file with the same name as this component
interface IDocuments {
  user?: UserContext;
}
const Documents = ({ user }: IDocuments) => {
  const views: any = {
    1: 'lorem',
    2: 'ipsum',
    3: 'ipsum',
  }

  const [currentScrollYPosition, scrollToPosition] = useScroll();
  const docRef = useRef<any | null>(null);
  const [docs, setDocs] = useState([]);
  const shoppingService = getService<IShoppingService>('IShoppingService');
  const [loader, setLoader] = useLoader();
  const [fullName, setFullName]=useState<string>('');
  const handleFullName = (e: any)=>{
    // e.preventDefault();
    const {value}=e.target;
    setFullName(value);
  };
  const isComplete =()=>{
    const fNLen = fullName.length;
    console.log('[ isComplete ]', fNLen, user?.name, fullName)
    if(!user || user?.name == undefined)return false;
    else if(fNLen < 3)return true;
    else if(fNLen >= 3 && String(user.name).toLowerCase().includes(fullName.toLowerCase())){
      return true;
    }else{
      return false;
    }
  };
  const fetch = async () => {
    setLoader({ active: true, body: 'getting your documents' })
    try {
      const entireProducts = await shoppingService.getProducts();
      const newDocs = entireProducts?.data.filter((prod: any) =>
        // IS MERCHANT
        prod?.metadata?.mid == environment.merchant.mid &&
        // IS A DOCUMENT
        prod?.metadata?.type == 'document' &&
        // Document is for Customer type
        prod?.metadata?.customer_type == user?.metadata.type
      );
      setDocs(newDocs);
    } catch (e: any) {
      console.log('[ DOCS ERROR ]', e);
    }
    setLoader({ active: false })
  }
  useEffect(() => {
  Boolean( !Object(docs).length) && fetch();
  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      {/* type: {user?.metadata.type} */}
      <div className='documents' ref={docRef}>
        <div className='documents__header'>
        <div className='documents__header--title'>
          {user?.name}&apos;s Documents
        </div>

        </div>
        <div className='documents__list'>
          {docs.length && docs.map((doc: any, i: number) => {
            return <div key={i} className='documents--document'>
              <UiCollapse label={doc?.name} open={true}>
                < >
                  <ol className='documents--document__terms'>
                    {doc?.metadata && Object.entries(doc?.metadata).filter(([key, bullShit]) => key.substr(0, 2) === 't-').map(([key, value]: any) => {
                      const termTitle: string = `${capitalize(key?.split('_')[1])}`;
                      return <li key={key} className='documents--document__terms--term'>
                        <div className='documents--document__terms--term__title'>{
                          capitalize(keyStringConverter(termTitle))
                        }</div>
                        <div className='documents--document__terms--term__body'>
                          {value && value || ''}
                        </div>
                      </li>
                    })
                    }
                  </ol>
                  <div className='documents__actions'>
                    <UiInput 
                      variant={`signature${isComplete()?'':' invalid'}`}
                      name='name'
                      value={fullName}
                      label='sign your full name & agree, to continue.' 
                      placeholder={user?.name}
                      onChange={handleFullName}
                    />
                    <UiButton 
                      variant={String(user?.name).toLowerCase() == fullName.toLowerCase()?'primary':'disabled'}
                      >agree</UiButton>
                  </div>
                </>
              </UiCollapse>

            </div>
          }) || ''}
        </div>
      </div>
    </>
  );
};

export default Documents;