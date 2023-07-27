import { getService } from "@webstack/common";
import type { NextComponentType, NextPageContext } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import { MemberSignInRequest } from "~/src/models/membership/MemberSignInRequest";
import SignIn from "../views/SignIn/SignIn";
import styles from "./Authentication.scss";
import UiButton from "@webstack/components/UiButton/UiButton";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import { useHeader } from "@webstack/components/Header/views/Header";
import useUserAgent from "@webstack/hooks/getUserAgentInfo";

interface Props {}
const DEFAULT_RESPONSE = { response: "", message: "" };
interface SigninProps extends MemberSignInRequest {
  code: string;
}
const Authentication: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  const defaultCodeValue = "------";
  const user_agent = useUserAgent();

  const userResponse = useUser();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const memberService = getService<IMemberService>("IMemberService");
  const [signInResponse, setSignInResponse] = useState<any>(DEFAULT_RESPONSE);
  const [credentials, setCredentials] = useState<SigninProps>({
    email: "",
    password: "",
    code: defaultCodeValue,
  });
  const [header, setHeader] = useHeader();
  const authResponse = (error: any) => {
    switch (error) {
      case "fail":
        return "We're sorry, that password doesn't seem to be correct. Please check and try again.";
      case "bad-email":
        return "Sorry, it looks like that email address isn't quite right. Please check and try again.";
      case "no-email":
        return "We're sorry, it looks like you forgot to enter your email address. Please try again.";
      case "no-password":
        return "Oops, it looks like you forgot to enter your password. Please try again.";
      case "no-credentials":
        return "Please enter your email and password to continue.";
      case "non-staff":
        return "Sorry, it looks like you don't have permission to access this feature. Please contact support if you believe this is a mistake.";
      default:
        return "Sorry, an unexpected error occurred. Our team has been notified and we'll work to resolve it as soon as possible.";
    }
  };

  function handleCredentials(e: any) {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }
  async function handleSignIn() {
    setIsSubmitting(true);
    async function checkforTFA() {
      const validTFA = (code: string): boolean => {
        const isAllNumbers = /^\d+$/.test(code);
        const hasLengthSix = code.length === 6;
        return isAllNumbers && hasLengthSix;
      };

      if (credentials.code && validTFA(credentials?.code)) {
        return await memberService.signIn({
          email: credentials.email,
          password: credentials.password,
          // code: credentials.code,
          // user_agent,
        });
      } else {
        return await memberService.signIn({ email: credentials.email, password: credentials.password, user_agent });
      }
    }
    // ADD OTHER VALIDATORS
    if (credentials.email && credentials.password) {
      try {
        await checkforTFA();
      } catch (e: any) {
        const error = JSON.parse(JSON.stringify(e));
        if (error.name === "AuthenticationError") {
          // error.code === 'bad-email' | invalid email
          // error.code === 'fail' | invalid password
          setSignInResponse({ response: error.code, message: authResponse(error.code) });
        }
        if (error.message) {
          // error.message === 'Two Factor Authenication code required'
          // error.message === 'Two Factor Authenication code was incorrect'
          setSignInResponse(error.message);
        }
      }
    } else {
      if (credentials.email === "" && credentials.password !== "")
        setSignInResponse({ code: "no-email", message: authResponse("no-email") });
      if (credentials.password === "" && credentials.email !== "")
        setSignInResponse({ code: "no-password", message: authResponse("no-password") });
      if (credentials.password === "" && credentials.email === "")
        setSignInResponse({ code: "no-credentials", message: authResponse("no-credentials") });
    }
    setIsSubmitting(false);
  }
  useEffect(() => {
    // console.log({signInResponse:signInResponse})
    if (
      !["Two Factor Authenication code required", "Two Factor Authenication code was incorrect"].includes(
        signInResponse
      ) &&
      signInResponse?.message !== ""
    ) {
      setTimeout(() => {
        setSignInResponse(DEFAULT_RESPONSE);
      }, 4000);
    }
  }, [signInResponse]);
  useEffect(() => {
    console.log("[ AUTH USER RESP ]", userResponse);
    if (userResponse && userResponse?.memberType !== "staff") {
      setSignInResponse({ code: "non-staff", message: authResponse("non-staff") });
      setIsSubmitting(false);
    }
    //  setTimeout(() => {
    // setSignInResponse(DEFAULT_RESPONSE);
    // }, 4000);
  }, [userResponse, setCredentials]);
  return (
    <>
      <style jsx>{styles}</style>

      <div className="authentication__authentication">
        <video autoPlay loop muted playsInline className="authentication_video">
          <source src="./assets/beeple.mp4" type="video/mp4" />
        </video>
        <div className="authentication__authentication-header">
          <div className="authentication__authentication-logo">
            <UiIcon icon="deepturn-logo" />
          </div>
        </div>
        <div className="authentication__authentication-content">
          <SignIn response={signInResponse} credentials={credentials} handleCredentials={(e) => handleCredentials(e)} />
          <div className="authentication__authentication-status">
            {signInResponse.message !== "" && (
              <div className="authentication__signin-response">
                {signInResponse.message}
              </div>
            )}
          </div>
          <div className="authentication__submit">
          <UiButton onClick={handleSignIn} busy={isSubmitting}>
            login
          </UiButton>
          </div>
        </div>
        <div className="authentication__authentication-footer">
          Existence is not something to be grasped or understood with precision; it is a flowing, mysterious dance of
          interwoven energies, where the beauty lies in its ineffable ambiguity.
        </div>
      </div>
    </>
  );
};

export default Authentication;
