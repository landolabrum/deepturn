import type { NextComponentType, NextPageContext } from "next";
import styles from "./User.scss";
import UserMethods from "../views/UserMethods/controller/UserMethods";
import { useClearance, useUser } from "~/src/core/authentication/hooks/useUser";
import UserModify from "../views/UserModify/UserModify";
import UiSettingsLayout from "@webstack/layouts/UiSettingsLayout/UiSettingsLayout";
import UserSubscriptions from "../views/UserSubscriptions/controller/UserSubscriptions";
import UserDocs from "../views/UserDocs/controller/UserDocs";
import { useEffect, useState } from "react";
import UserProfile from "../views/UserProfile/UserProfile";

interface Props { }

const User: NextComponentType<NextPageContext, {}, Props> = ({ }: Props) => {
  const user = useUser();
  const level = useClearance();
  const [current, setCurrent]=useState('profile');
  const vs: any = {
    "profile": <UserProfile user={user} open />,
    "edit profile": <UserModify user={user} open />,
    'billing': <UserMethods open='opened' />,
    "email notification": "email notification",
    "privacy & security": "privacy & security",
  };
  const [views, setViews]=useState(vs);
  
  useEffect(() => {
    if(level && [7,10].includes(Number(level))){
      const tenantViews = {
        'documents': <UserDocs user={user} previewPdf={false}/>,
        'subscriptions': <UserSubscriptions user={user} />,
      };
      setViews({...views, ...tenantViews})
    }
  }, [level, setViews]);
    return (
      <>
        <style jsx>{styles}</style>
        {level && <UiSettingsLayout
          defaultView='profile'
          title='account'
          showMenu={current === 'profile'}
          setViewCallback={(v)=> setCurrent(v)}
          views={views}
        /> || ''}
      </>
    );
};
export default User;
