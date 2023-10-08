import type { NextComponentType, NextPageContext } from "next";
import styles from "./Account.scss";
import UiMenu from "@webstack/components/UiMenu/UiMenu";
import { useEffect, useState } from "react";
import UiSelect from "@webstack/components/UiSelect/UiSelect";
import { useHeader } from "@webstack/components/Header/views/Header";
import { countries, states } from "@webstack/models/location";
import { capitalizeAll } from "@webstack/helpers/Capitalize";
import { default as Div } from "@webstack/components/UiDiv/UiDiv";
import AccountMethods from "../views/AccountMethods/controller/AccountMethods";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import ProfileForm from "../views/ProfileForm/ProfileForm";
import UiSettingsLayout from "@webstack/layouts/UiSettingsLayout/UiSettingsLayout";

interface Props { }

const Account: NextComponentType<NextPageContext, {}, Props> = ({ }: Props) => {
  const [_, setHeader] = useHeader();
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
    setHeader({ title: view, breadcrumbs: [{ label: "account" }, { label: view }] });
  }
  useEffect(() => {
    setLoaded(true);
    setHeader({ title: 'account', breadcrumbs: [{ label: "account" }] });
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
        {/* <div className="account">
            <Div maxWidth={900}>
              <UiMenu
                options={Object.keys(views)}
                // variant="dark"
                value={view}
                onSelect={handleView}
              />
            </Div>

            <Div minWidth={900} >
              <UiSelect
                onSelect={handleView}
                variant="dark"
                title={capitalizeAll(view)}
                // openState
                options={Object.keys(views)}
              />
            </Div>
          <div className='account__view'>
            <div className='account__view__title'>
              {view}
            </div>
            {views[view]}
          </div>
        </div> */}
      </>
    );
  return <>loading</>;
};

export default Account;
