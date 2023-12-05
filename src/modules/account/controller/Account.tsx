import type { NextComponentType, NextPageContext } from "next";
import styles from "./Account.scss";
import AccountMethods from "../views/AccountMethods/controller/AccountMethods";
import { useClearance, useUser } from "~/src/core/authentication/hooks/useUser";
import ProfileForm from "../views/ProfileForm/ProfileForm";
import UiSettingsLayout from "@webstack/layouts/UiSettingsLayout/UiSettingsLayout";
import Subscriptions from "../views/Subscriptions/controller/Subscriptions";
import Documents from "../views/Documents/controller/Documents";
import { useEffect, useState } from "react";

interface Props { }

const Account: NextComponentType<NextPageContext, {}, Props> = ({ }: Props) => {
  const user = useUser();
  const level = useClearance();
  const vs: any = {
    "edit profile": <ProfileForm user={user} open />,
    'billing': <AccountMethods open='opened' />,
    "email notification": "email notification",
    "privacy & security": "privacy & security",
  };
  const [views, setViews]=useState(vs);
  
  useEffect(() => {
    if(level && [7,10].includes(Number(level))){
      const tenantViews = {
        'documents': <Documents user={user} />,
        'subscriptions': <Subscriptions user={user} />,
      };
      setViews({...views, ...tenantViews})
    }
  }, [level, setViews]);
    return (
      <>
        <style jsx>{styles}</style>
        <UiSettingsLayout
          defaultView='edit profile'
          name='account'
          variant="full-screen"
          views={views}
        />
      </>
    );
};
export default Account;
