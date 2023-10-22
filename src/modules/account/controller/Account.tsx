import type { NextComponentType, NextPageContext } from "next";
import styles from "./Account.scss";
import { useEffect, useState } from "react";
import { countries, states } from "@webstack/models/location";
import AccountMethods from "../views/AccountMethods/controller/AccountMethods";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import ProfileForm from "../views/ProfileForm/ProfileForm";
import UiSettingsLayout from "@webstack/layouts/UiSettingsLayout/UiSettingsLayout";

interface Props { }

const Account: NextComponentType<NextPageContext, {}, Props> = ({ }: Props) => {
  const [loaded, setLoaded] = useState(false);
  const user = useUser();

  const views: any = {
    "edit profile": <ProfileForm user={user} open />,
    "email notification": "email notification",
    "privacy & security": "privacy & security",
    'billing': <AccountMethods open />
  };
  const [view, setView] = useState<string>(Object.keys(views)[3]);
  const handleView = (view: string) => {
    setView(view);
  }
  useEffect(() => {
    setLoaded(true);
  }, [setLoaded]);

  const userCountry = (country: string): string => {
    const contArr = Object.entries(countries).find(([iso, name]) => iso === country.toLowerCase());
    if (contArr) return contArr[1];
    return "select";
  };
  const userState = (state: string): string => {
    const contArr = Object.entries(states).find(([iso, name]) => iso === state.toLowerCase());
    if (contArr) return contArr[1];
    return "select";
  };

  if (loaded)
    return (
      <>
        <style jsx>{styles}</style>
        <UiSettingsLayout
          defaultView='billing'
          name='account'
          variant="full-screen"
          views={views}
          setViewCallback={console.log}
        />
      </>
    );
  return <>loading</>;
};

export default Account;
