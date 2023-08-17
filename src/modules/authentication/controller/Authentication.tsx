import type { NextComponentType, NextPageContext } from "next";
import { useEffect, useState } from "react";
import SignIn from "../views/SignIn/SignIn";
import styles from "./Authentication.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import SignUp from "../views/SignUp/SignUp";


interface Props { }

const Authentication: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const [newCustomerEmail, setNewCustomerEmail] = useState<string | undefined>();
  const [view, setView] = useState<string>("sign-in");

  const handleView = () => {
    switch (view) {
      case "sign-in":
        setView("sign-up")
        // code block
        break;
      case "sign-up":
        setView("sign-in")
        break;
      case "customer-created":
        setView("sign-in")
        break;
      default:
        setView("sign-up")
    }
  }
  useEffect(()=>{
    if(view.includes("@")){
      setNewCustomerEmail(view);
    }
    if(newCustomerEmail != undefined)setView("sign-in");
  },[setView, newCustomerEmail])

  return (
    <>
      <style jsx>{styles}</style>
      <div className="authentication__authentication">
        <video autoPlay loop muted playsInline className="authentication_video">
          <source src="./assets/beeple.mp4" type="video/mp4" />
        </video>
        <div className="authentication__authentication-body">
          <div className="authentication__authentication-header">
            <div className="authentication__authentication-logo">
              <UiIcon icon="deepturn-logo" />
            </div>
          </div>
          <div className="authentication__authentication-content">
          e{newCustomerEmail}
            <div className="authentication__authentication-view">
              {view == 'sign-in' && <SignIn email={newCustomerEmail}/>}
              {view == 'sign-up' && <SignUp setView={setView}/>}
              <div className="authentication__view-action">
                <label>{view == 'sign-in' ? "no account?" : "already have an account?"}</label>
                <a onClick={handleView}>
                  {view == 'sign-in' ? "create account" : "log in"}
                </a>
              </div>
            </div>

          </div>
          <div className="authentication__authentication-footer">
            {/* Existence is not something to be grasped or understood with precision; it is a flowing, mysterious dance of
          interwoven energies, where the beauty lies in its ineffable ambiguity. */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Authentication;
