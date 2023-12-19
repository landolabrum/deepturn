// Title.tsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import environment from '~/src/environment';
import capitalize, { capitalizeAll } from '@webstack/helpers/Capitalize';

const Title: React.FC = () => {
  const [title, setTitle] = useState<string>(String(environment.merchant.name));
  
  const router = useRouter();
  useEffect(() => {
    const merchantName = capitalizeAll(String(environment.merchant.name).replaceAll('-',' '));
    const path = capitalize(router.pathname.replace('/',''));
    setTitle(`${merchantName}${path?.length? ' | ' + path: ''}`);
  }, [router.pathname]);
  
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
};

export default Title;
