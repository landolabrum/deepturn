import type { NextComponentType, NextPageContext } from "next";
import { useEffect, useState } from "react";
import styles from "./User.scss";
import UserMethods from "../views/UserMethods/controller/UserMethods";
import { useClearance, useUser } from "~/src/core/authentication/hooks/useUser";
import UserModify from "../views/UserModify/UserModify";
import UiSettingsLayout from "@webstack/layouts/UiSettingsLayout/controller/UiSettingsLayout";
import UserSubscriptions from "../views/UserSubscriptions/controller/UserSubscriptions";
import UserDocs from "../views/UserDocs/controller/UserDocs";
import UserProfile from "../views/UserProfile/UserProfile";

interface Props {}

const User: NextComponentType<NextPageContext, {}, Props> = ({}: Props) => {
  const user = useUser();
  const level = useClearance();
  const [current, setCurrent] = useState('profile');
  const [views, setViews] = useState({
    profile: <UserProfile user={user} open />,
    billing: <UserMethods open="opened" />,
    "email notification": "email notification",
    "privacy & security": "privacy & security",
  });

  useEffect(() => {
    if (level && level > 9) {
      setViews((prevViews) => ({
        ...prevViews,
        documents: <UserDocs user={user} previewPdf={false} />,
        subscriptions: <UserSubscriptions user={user} />,
      }));
    }
  }, [level, user]);

  return (
    <>
      <style jsx>{styles}</style>
      {level && (
        <UiSettingsLayout
          viewName="profile"
          title={current}
          showMenu={current === 'profile'}
          setViewCallback={(v) => setCurrent(v)}
          views={views}
        />
      )}
    </>
  );
};

export default User;
