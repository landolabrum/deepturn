import type { NextComponentType, NextPageContext } from "next";
import styles from "./Account.scss";
import UiMenu from "@webstack/components/UiMenu/UiMenu";
import { useEffect, useState } from "react";
import UiSelect from "@webstack/components/UiSelect/UiSelect";
import useWindow from "@webstack/hooks/useWindow";
import { useHeader } from "@webstack/components/Header/views/Header";
import { countries, states } from "@webstack/models/location";
import AccountForm from "../views/AccountForm/AccountForm";
import AccountMethods from "../views/AccountMethods/AccountMethods";
interface Props {}

const Account: NextComponentType<NextPageContext, {}, Props> = ({}: Props) => {
  const width = useWindow().width;
  const [header, setHeader] = useHeader();
  const [loaded, setLoaded] = useState(false);
  const views = ["edit profile", "email notification", "privacy & security", 'billing'];
  const [view, setView] = useState<string>(views[3]);

  useEffect(() => {
      setLoaded(true);
      setHeader({ title: 'account', breadcrumbs: [{ label: "account" }] });
  }, []);

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
          <div className="account__views">
            <div className="account__views-desktop">
              <UiMenu
                traits={{height: "100%"}}
                options={views}
                variant="dark"
                value={view}
                onSelect={(e) => {
                  setView(e);
                }}
              />
            </div>
            <div className="account__views-mobile">
              <UiSelect
                onSelect={(e) => {
                  setView(e);
                }}
                variant="dark"
                title="Account Settings"
                // openState
                options={views}
              />
            </div>
          </div>
          <div className="account__content">
            {view !== 'billing' && <AccountForm form={view.split(" ")[1]}/> }
            {view === 'billing' && <AccountMethods/> }
          </div>
        </div>
      </>
    );
  return <>loading</>;
};

export default Account;
