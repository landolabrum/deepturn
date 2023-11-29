// Relative Path: ./Documents.tsx
import React, { useEffect, useState } from 'react';
import styles from './Documents.scss';
import UiTabsLayout from '@webstack/layouts/UiTabsLayout/UiTabsLayout';
import UserContext from '~/src/models/UserContext';
import { useClearance } from '~/src/core/authentication/hooks/useUser';
import { getService } from '@webstack/common';
import IShoppingService from '~/src/core/services/ShoppingService/IShoppingService';
import environment from '~/src/environment';
import UiButton from '@webstack/components/UiButton/UiButton';
import UiMarkdown from '@webstack/components/UiMarkDown/UiMarkDown';
import capitalize from '@webstack/helpers/Capitalize';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import { useLoader } from '@webstack/components/Loader/Loader';


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
  const [docs, setDocs] = useState([]);
  const shoppingService = getService<IShoppingService>('IShoppingService');
  const [loader, setLoader]=useLoader();
  const fetch = async () => {
    setLoader({active: true, body:'getting your documents'})
    try {
      const response = await shoppingService.getProducts();
      const newDocs = response?.data.filter((i: any) => i?.metadata?.mid == environment.merchant.mid && i?.metadata?.type == 'document');
      setDocs(newDocs);
    } catch (e: any) {
      console.log('[ DOCS ERROR ]', e);
    }
    setLoader({active: false})
  }
  useEffect(() => {
    fetch();
  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      {user && Object.entries(user).map(([k,v])=>{
        return <div style={{maxWidth:'500px'}}>{JSON.stringify(v)}</div>
      })}
      <div className='documents'>
        <div className='documents__list'>
          {docs.length && docs.map((doc: any, i: number) => {
            return <div key={i}>
              <UiCollapse label={doc?.name}
              >
               <div className='documents__list--documents'>
               <ol>
                  {doc?.metadata && Object.entries(doc?.metadata).filter(([key, bullShit]) => key.includes('term')).map(([key, value]) => {
                    const termTitle: string = `${capitalize(key?.split('_')[1])}`;
                    return <li key={key}>
                      <h4>{termTitle}</h4>
                      {<UiMarkdown text={String(value)} />}
                    </li>
                  })
                  }
                </ol>
                <UiButton variant='dark'>submit</UiButton>
               </div>
              </UiCollapse>

            </div>
          }) || ''}
        </div>
      </div>

    </>
  );
};

export default Documents;