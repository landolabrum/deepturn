// Title.tsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import environment from '~/src/environment';
import capitalize, { capitalizeAll } from '@webstack/helpers/Capitalize';
import useDarkMode from "@webstack/hooks/useDarkMode";

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
      {useDarkMode() ? (
        // servers/Deepturn/public/merchant/nirv1/favicon-lite.ico
        <link rel="shortcut icon" href={`/merchant/${environment.merchant.mid}/favicon-lite.ico`} />
      ) : <link rel="shortcut icon" href={`/merchant/${environment.merchant.mid}/favicon-dark.ico`} />}
    </Head>
  );
};

export default Title;
