import type { NextComponentType, NextPageContext } from "next";
import styles from "./Account.scss";
import AccountMethods from "../views/AccountMethods/controller/AccountMethods";
import { useClearance, useUser } from "~/src/core/authentication/hooks/useUser";
import AccountModify from "../views/AccountModify/AccountModify";
import UiSettingsLayout from "@webstack/layouts/UiSettingsLayout/UiSettingsLayout";
import Subscriptions from "../views/Subscriptions/controller/Subscriptions";
import AccountDocuments from "../views/AccountDocuments/controller/AccountDocuments";
import { useEffect, useState } from "react";
import Loader from "@webstack/components/Loader/Loader";

interface Props { }

const Account: NextComponentType<NextPageContext, {}, Props> = ({ }: Props) => {
  const user = useUser();
  const level = useClearance();
  const vs: any = {
    "edit profile": <AccountModify user={user} open />,
    'billing': <AccountMethods open='opened' />,
    "email notification": "email notification",
    "privacy & security": "privacy & security",
  };
  const [views, setViews]=useState(vs);
  
  useEffect(() => {
    if(level && [7,10].includes(Number(level))){
      const tenantViews = {
        'documents': <AccountDocuments user={user} previewPdf={false}/>,
        'subscriptions': <Subscriptions user={user} />,
      };
      setViews({...views, ...tenantViews})
    }
  }, [level, setViews]);
    return (
      <>
        <style jsx>{styles}</style>
        {level && <UiSettingsLayout
          defaultView='edit profile'
          title='account'
          variant="full-screen"
          views={views}
        /> || ''}
      </>
    );
};
export default Account;
