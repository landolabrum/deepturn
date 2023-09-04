import type { NextComponentType, NextPageContext } from "next";
import styles from "./Account.scss";
import UiMenu from "@webstack/components/UiMenu/UiMenu";
import { useEffect, useState } from "react";
import UiSelect from "@webstack/components/UiSelect/UiSelect";
import { useHeader } from "@webstack/components/Header/views/Header";
import { countries, states } from "@webstack/models/location";
import AccountForm from "../views/AccountForm/AccountForm";
import { capitalizeAll } from "@webstack/helpers/Capitalize";
import {default as Div} from "@webstack/components/UiDiv/UiDiv";
import AccountMethods from "../views/AccountMethods/controller/AccountMethods";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import ProfileForm from "../views/ProfileForm/ProfileForm";
import { capitalize } from "lodash";

interface Props {}

const Account: NextComponentType<NextPageContext, {}, Props> = ({}: Props) => {
  const [header, setHeader] = useHeader();
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<string>('edit profile');
  const user = useUser();

  const views:any = {
    "edit profile":<ProfileForm user={user}/> ,
    "email notification":"email notification",
    "privacy & security":"privacy & security",
    'billing':<AccountMethods/>
  };
  
  // const [view, setView] = useState<string>('edit profile');
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
        <div className="account">
          <div className="account__content">
            <Div variant='dark card'>
              <UiMenu
                label={'foop'}
                traits={{backgroundColor:'transparent', border:'none', outline:'none', borderRadius:'unset'}}
                options={Object.keys(views)}
                variant="dark"
                value={view}
                onSelect={(e) => {
                  setView(e);
                }}
              />
            </Div>
            <div className="account__menu-mobile">
              <UiSelect
                onSelect={(e) => {
                  setView(e);
                }}
                variant="dark"
                title={capitalizeAll(view)}
                // openState
                options={Object.keys(views)}
              />
            </div>
          </div>
          <Div variant="dark card">
            <h3>{capitalize(view)}</h3>
            {views[view]}
          </Div>
        </div>
      </>
    );
  return <>loading</>;
};

export default Account;
