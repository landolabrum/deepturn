// Relative Path: ./Instagram.tsx
import React, { useEffect, useState } from 'react';
import styles from './Instagram.scss';
import InstagramAuthenticate from '../views/InstagramAuthenticate/InstagramAuthenticate';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import { useLoader } from '@webstack/components/Loader/Loader';


// Remember to create a sibling SCSS file with the same name as this component

const Instagram: React.FC<any> = ({ current }: { current?: string }) => {
    const [view, setView] = useState<string | undefined>('signin');
    const [credentials, setCredentials] = useState<any | undefined>();
    const user = useUser();
    const [loader, setLoader]=useLoader();
    const views = {
        signin: <InstagramAuthenticate {...user} />,
        // authenticating: <UiLoader height="1000px" text={`signing in: ${credentials?.username}`} />
    };
    const viewProps = { views, currentView: view };

   
   useEffect(() => {
    const usersSocialServices = user?.metadata?.user?.social;
    if(usersSocialServices?.length){
      const igData = usersSocialServices.findLast((a:any,k:any)=>usersSocialServices[k])?.authorization_data;
      if(igData?.username){
        setCredentials(igData);
        setLoader({
            active: true,
            body:`signing in: ${credentials?.username}`,
            backgroundColor:"#20202090"
        })
        // setView("authenticating");
      }
    }
   }, []);
    return (
        <>
            <style jsx>{styles}</style>
            {/* {JSON.stringify(user?.metadata?.user)} */}
            <div className='instagram'>
                <div className='instagram--view'>
                    <UiViewLayout
                        {...viewProps}
                    />
                </div>
            </div>
            <div className='instagram__tandc'>
                Not Responsible
            </div>
        </>
    );
};

export default Instagram;