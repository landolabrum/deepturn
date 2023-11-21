import type { NextComponentType, NextPageContext } from "next";
import styles from "./Account.scss";
import AccountMethods from "../views/AccountMethods/controller/AccountMethods";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import ProfileForm from "../views/ProfileForm/ProfileForm";
import UiSettingsLayout from "@webstack/layouts/UiSettingsLayout/UiSettingsLayout";
import Subscriptions from "../views/Subscriptions/controller/Subscriptions";

interface Props { }

const Account: NextComponentType<NextPageContext, {}, Props> = ({ }: Props) => {
  const user = useUser();
  const views: any = {
    'subscriptions': <Subscriptions user={user} />,
    "edit profile": <ProfileForm user={user} open />,
    "email notification": "email notification",
    "privacy & security": "privacy & security",
    'billing info': <AccountMethods open />,
  };
    return (
      <>
        <style jsx>{styles}</style>
        <UiSettingsLayout
          defaultView={views[0]}
          name='account'
          variant="full-screen"
          views={views}
          setViewCallback={console.log}
        />
      </>
    );
};
export default Account;
