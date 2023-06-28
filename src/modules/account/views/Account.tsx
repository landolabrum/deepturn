import type { NextComponentType, NextPageContext } from "next";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import styles from "./Account.scss";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import UiMenu from "@webstack/components/UiMenu/UiMenu";
import { useEffect, useState } from "react";
import UiSelect from "@webstack/components/UiSelect/UiSelect";
import useWindow from "@webstack/hooks/useWindow";
import { useHeader } from "@webstack/components/Header/views/Header";
import Input from "@webstack/components/UiInput/UiInput";
import { countries, phoneFormat } from "@webstack/helpers/userExperienceFormats";
interface Props {}

const Account: NextComponentType<NextPageContext, {}, Props> = ({}: Props) => {
  const width = useWindow().width;
  const [header, setHeader] = useHeader();
  const [loaded, setLoaded] = useState(false);
  const views = ["personal details", "email notification", "privacy & security"];
  const [view, setView] = useState<string>(views[0]);
  const userResponse = useUser();
  const [user, setUser] = useState<any>(null);

  const handleUser = (e: any) => {
    let name = e?.target?.name;
    let value = e?.target?.value;
    if (!value || !name) return;
    // HANDLE ADDRESS
    if (["city", "country", "line1", "line2", "postal_code", "state"].includes(name)) {
      let addr = user.address;
      if(name === "country"){
        const contArr = Object.entries(countries).find(([iso,nam])=> nam === value);
        if(contArr)value=contArr[0].toUpperCase();
      }
      addr[name] = value;
      setUser({ ...user, addr });
      // HANDLE NAME
    } else if (["lname", "fname"].includes(name)) {
      let fullName = user?.name.split(" ");
      if (name === "fname") fullName = `${value} ${fullName[1]}`;
      if (name === "lname") fullName = `${fullName[0]} ${value}`;
      setUser({ ...user, name: fullName });
    } else {
      setUser({ ...user, [name]: value });
    }
  };
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (userResponse) {
      setLoaded(true);
      setHeader({ title: userResponse.name, breadcrumbs: [{ label: "account" }] });
      setUser(userResponse);
    }
  }, []);
  function Iterator(listOfStuff: any, isChild = false) {
    if (listOfStuff)
      return Object.entries(listOfStuff).map(([key, value]: any) => {
        return (
          <>
            <style jsx>{styles}</style>
            <div className={`account__line-item ${isChild ? " is-child" : ""}`} key={key}>
              <strong>{keyStringConverter(key)}</strong>{" "}
              {["string", "number"].includes(typeof value) ? value : Iterator(value, true)}
            </div>
          </>
        );
      });
  }
  const userCountry = (country: string):string =>{
    const contArr = Object.entries(countries).find(([iso,name])=> iso === country.toLowerCase());
    if(contArr)return contArr[1];
    return "select"
  }
  if (loaded)
    return (
      <>
        <style jsx>{styles}</style>
        <div className="account">
          <div className="account__views">
            <div className="account__views-desktop">
              <UiMenu
                options={views}
                variant="dark"
                value={views[0]}
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
                openState
                options={views}
              />
            </div>
          </div>
          <div className="account__content">
            view: {view}


            {view === views[0] && (
              <>
                <AdaptGrid xs={1} sm={2} gap={10}>
                  <Input
                    name="fname"
                    label="first name"
                    value={user?.name !== undefined ? user.name.split(" ")[0] : "First Name"}
                    onChange={handleUser}
                  />
                  <Input
                    name="lname"
                    label="last name"
                    value={user?.name !== undefined ? user.name.split(" ")[1] : "Last Name"}
                    onChange={handleUser}
                  />
                  <Input
                    name="email"
                    label="email"
                    type="email"
                    value={user?.email !== undefined ? user.email : "Email"}
                    onChange={handleUser}
                  />
                  <Input
                    name="phone"
                    label="phone"
                    type="tel"
                    value={user?.phone !== undefined ? phoneFormat(user.phone, "US") : "Phone"}
                    onChange={handleUser}
                  />
                </AdaptGrid>
                <AdaptGrid xs={1} sm={2} gap={10}>
                  <Input
                    name="city"
                    label="city"
                    value={user?.address?.city !== undefined ? user?.address?.city : "city"}
                    onChange={handleUser}
                  />
                  <Input
                    name="line1"
                    label="line1"
                    value={user?.address?.line1 !== undefined ? user?.address?.line1 : "line1"}
                    onChange={handleUser}
                  />
                  <Input
                    name="line2"
                    label="line2"
                    value={user?.address?.line2 !== undefined ? user?.address?.line2 : "line2"}
                    onChange={handleUser}
                  />
                  <Input
                    name="state"
                    label="state"
                    value={user?.address?.state !== undefined ? user?.address?.state : "state"}
                    onChange={handleUser}
                  />
                  <Input
                    name="postal_code"
                    label="zip code"
                    value={user?.address?.postal_code !== undefined ? user?.address?.postal_code : "zip"}
                    onChange={handleUser}
                  />
                  <UiSelect
                    search={true}
                    setSearch={setSearch}
                    traits={{ height: "500px" }}
                    options={Object.values(countries).map((v) => {
                      return v;
                    })}
                    label="country"
                    title={userCountry(user?.address?.country)}
                    onSelect={(v)=>handleUser({target:{name:"country",value:v}})}
                    />
                </AdaptGrid>
              </>
            )}
            {user && Iterator(user)}
          </div>
        </div>
      </>
    );
  return <>loading</>;
};

export default Account;
