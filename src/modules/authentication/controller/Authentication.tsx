import type { NextComponentType, NextPageContext } from "next";
import { useEffect, useRef, useState } from "react";
import SignIn from "../views/SignIn/SignIn";
import styles from "./Authentication.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import SignUp from "../views/SignUp/SignUp";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { useRouter } from "next/router";
import VerifyEmail from "../views/VerifyEmail/VerifyEmail";
import { useNotification } from "@webstack/components/Notification/Notification";
import UiButton from "@webstack/components/UiButton/UiButton";


interface Props { }

const Authentication: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const backgroundRef = useRef<null | any>(null);
  const [newCustomerEmail, setNewCustomerEmail] = useState<string | undefined>();
  const [view, setView] = useState<string>("sign-in");
  const router = useRouter();
  const handleView = () => {
    switch (view) {
      case "sign-in":
        setView("sign-up")
        // code block
        break;
      case "sign-up":
        setView("sign-in")
        break;
      case "verify":
        setView("verify")
        break;
      case "customer-created":
        setView("sign-in")
        break;
      default:
        setView("sign-up")
    }
  }
  
  // const playSpeed = 1;
  // useEffect(() => {
  //   const video = backgroundRef.current;
  //   let forward = true; // Boolean variable to control playback direction
  //   let lastTime = Date.now();
  
  //   if (video) {
  //     const interval = setInterval(() => {
  //       const currentTime = Date.now();
  //       const deltaTime = (currentTime - lastTime) / 1000.0; // convert to seconds
  //       lastTime = currentTime;
  
  //       if (forward) {
  //         video.currentTime += deltaTime * playSpeed;
  //         if (video.currentTime >= video.duration) {
  //           forward = false;
  //         }
  //       } else {
  //         video.currentTime -= deltaTime * playSpeed;
  //         if (video.currentTime <= 0) {
  //           forward = true;
  //         }
  //       }
  //     }, 24); // Run about 30 times per second
  
  //     return () => {
  //       clearInterval(interval); // Clean up interval when the component unmounts
  //     };
  //   }
  // }, []);
  
  
  const [notification, setNotification]=useNotification();
  console.log("nots",notification)
  useEffect(() => {
    setNotification({
      active:true,
      dismissable: false,
      children:<>
      <p>We use cookies to give you the best experience and to ensure the safety of our users. The only non-essential cookies we use are for any personal referrals you make. We do not track you across other sites. You can see our Cookie Policy here, and our Privacy Notice here.</p>
      <div style={{width: '100%', display: 'flex', justifyContent:'flex-end', gap:'5px'}}>
        <UiButton traits={{width:"max-content"}}>Customize selection</UiButton>
        <UiButton traits={{width:"max-content"}} variant="primary">accept all</UiButton>
      </div>
      </>
    })
    // if(backgroundRef.current)backgroundRef.current.playbackRate=".3"
    if(router.pathname.includes('verify'))setView('verify');
    if (view.includes("@")) {
      setNewCustomerEmail(view);
    }
    if (newCustomerEmail != undefined) setView("sign-in");
  }, [setView, newCustomerEmail])

  return (
    <>
      <style jsx>{styles}</style>
      <div className="authentication">
        <video autoPlay loop muted playsInline className="authentication_video" ref={backgroundRef}>
          <source src="./assets/backgrounds/nature-clean.mp4" type="video/mp4" />
        </video>
        <div className='authentication__canvas'></div>
        <div className="authentication-body">
          <div className="authentication-header">
            <div className="authentication-logo">
              <UiIcon icon="deepturn-logo" />
            </div>
          </div>
          <div className="authentication-content">
            {/* newCustomerEmail: {newCustomerEmail} */}
            <div className="authentication__view">
              <div className='authentication__view-header'>
                <div className="authentication__logo-mobile">
                  <UiIcon icon="deepturn-logo" />
                </div>
                <div className='authentication__view-name'>
                  {keyStringConverter(view)}
                </div>
              </div>
              {view == 'sign-in' && <SignIn email={newCustomerEmail} />}
              {view == 'sign-up' && <SignUp setView={setView} />}
              {view == 'verify' && <VerifyEmail token={router.query.token} onSuccess={console.log}/>}
              <div className="authentication__view-action">
                <label>{view == 'sign-in' ? "no account?" : "already have an account?"}</label>
                <a onClick={handleView}>
                  {view == 'sign-in' ? "create account" : "log in"}
                </a>
              </div>
            </div>

          </div>
          <div className="authentication-footer">
            {/* Existence is not something to be grasped or understood with precision; it is a flowing, mysterious dance of
          interwoven energies, where the beauty lies in its ineffable ambiguity. */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Authentication;
