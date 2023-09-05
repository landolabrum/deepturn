import type { NextComponentType, NextPageContext } from "next";
import { useEffect, useRef, useState } from "react";
import SignIn from "../views/SignIn/SignIn";
import styles from "./Authentication.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import SignUp from "../views/SignUp/SignUp";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { useRouter } from "next/router";
import VerifyEmail from "../views/VerifyEmail/VerifyEmail";


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
  
  
  useEffect(() => {
    const video = backgroundRef.current;
    console.log(backgroundRef?.current.parentNode)
    // console.log(backgroundRef?.current.nextSibling)
    if (video) {
      video.playbackRate = 0.1;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      video.nextSibling.appendChild(canvas); // append canvas to body or a specific container
      // document.body.appendChild(canvas); // append canvas to body or a specific container
  
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  
      const drawFrame = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw at the same position
          requestAnimationFrame(drawFrame);
        ctx.globalAlpha = 0.5; // Adjust opacity to blend frames

      };
      
      video.addEventListener('play', () => {
    
          drawFrame();
      });
    }
  }, []);
  
  
  useEffect(() => {
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
        console.log("[ isVerified ]",isVerified)
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
