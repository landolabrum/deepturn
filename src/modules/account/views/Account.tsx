import type { NextComponentType, NextPageContext } from "next";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import styles from "./Account.scss";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import UiMenu from "@webstack/components/UiMenu/UiMenu";
import { useEffect, useState } from "react";
interface Props {}

const Account: NextComponentType<NextPageContext, {}, Props> = ({}: Props) => {
  const [loaded, setLoaded]=useState(false);
  const user = useUser();
  useEffect(()=>{
    if(user)setLoaded(true);
  },[])
  function Iterator(listOfStuff: any, isChild = false){
   if(listOfStuff )return Object.entries(listOfStuff).map(([key, value]:any) => {
      return (<>
      <style jsx>{styles}</style>
        <div className={`account__line-item ${isChild?" is-child":""}`} key={key}>
          <strong>{keyStringConverter(key)}</strong> {typeof value === "string"?value:Iterator(value, true)}
        </div>
        </>
      );
    })

  }
  if(loaded)return (
    <>
      <style jsx>{styles}</style>
      <h1>Account</h1>
      <div className="account">
        <div className="account__actions">
        <UiMenu variant="dark" options={["settings","email notification","privacy & security",""]} onSelect={console.log}/>
        </div>
        <AdaptGrid xs={1} variant="card-border" margin={"0 20px"}>
          <div className="account__content">
            {user &&
              Iterator(user)
              }
          </div>
        </AdaptGrid>

        </div>
    </>
  );
  return <>loading</>
};

export default Account;
