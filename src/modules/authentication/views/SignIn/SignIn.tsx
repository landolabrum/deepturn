import { useEffect, useState } from "react";
import Input from "@webstack/components/UiInput/UiInput";
import type { NextComponentType } from "next";
import TwoFactorAuth from "./components/TwoFactorAuth/TwoFactorAuth";
import UiButton from "@webstack/components/UiButton/UiButton";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import { getService } from "@webstack/common";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import useUserAgent from "~/src/core/authentication/hooks/useUserAgent";
import styles from "./SignIn.scss";

const DEFAULT_RESPONSE = { response: "", message: "" };
const defaultCodeValue = "------";
const authResponseMessages: any = {
  fail: "We're sorry, that password doesn't seem to be correct. Please check and try again.",
  "bad-email": "Sorry, it looks like that email address isn't quite right. Please check and try again.",
  "no-email": "We're sorry, it looks like you forgot to enter your email address. Please try again.",
  "no-password": "Oops, it looks like you forgot to enter your password. Please try again.",
  "no-credentials": "Please enter your email and password to continue.",
  "non-staff": "Sorry, it looks like you don't have permission to access this feature. Please contact support if you believe this is a mistake.",
  default: "Sorry, an unexpected error occurred. Our team has been notified and we'll work to resolve it as soon as possible.",
};

export interface SignInProps {
  credentials: {
    email: string;
    password: string;
    code: string;
  };
  response: any;
  handleCredentials: (e: any) => void;
}

const SignIn = ({email}:{email:string | undefined}) => {
  const [signInResponse, setSignInResponse] = useState<any>(DEFAULT_RESPONSE);
  const userResponse = useUser();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const memberService = getService<IMemberService>("IMemberService");
  const user_agent = useUserAgent();
  const [credentials, setCredentials] = useState<any>({
    email: "",
    password: "",
    code: defaultCodeValue,
  });

  function handleCredentials(e: any) {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  const authResponse = (error: any) => authResponseMessages[error] || authResponseMessages.default;

  async function handleSignIn() {
    setIsSubmitting(true);
    if (credentials.email && credentials.password) {
      const validTFA = /^\d{6}$/.test(credentials.code);
      try {
        await memberService.signIn({
          email: credentials.email,
          password: credentials.password,
          ...(validTFA && { code: credentials.code }),
          user_agent,
        });
      } catch (e: any) {
        const error = JSON.parse(JSON.stringify(e));
        if (error.name === "AuthenticationError") {
          setSignInResponse({ response: error.code, message: authResponse(error.code) });
        }
        if (error.message) {
          setSignInResponse(error.message);
        }
      }
    } else {
      const responseCode =
        credentials.email === "" && credentials.password !== "" ? "no-email" :
          credentials.password === "" && credentials.email !== "" ? "no-password" :
            "no-credentials";
      setSignInResponse({ code: responseCode, message: authResponse(responseCode) });
    }
    setIsSubmitting(false);
  }

  useEffect(() => {
    if(email)setCredentials({...credentials, email: email});
    if (userResponse && userResponse.memberType !== "staff") {
      setSignInResponse({ code: "non-staff", message: authResponse("non-staff") });
      setIsSubmitting(false);
    }
  }, [userResponse, setCredentials, email]);

  return (
    <>
    <style jsx>{styles}</style>
      <form className="sign-in">

        {["email", "password"].map((field) => (
          <Input
            key={field}
            type={field}
            autoComplete={field === "email" ? "username" : "current-password"}
            name={field}
            variant={["bad-email", "password required", "no credentials provided"].includes(signInResponse) ? "invalid dark" : "dark"}
            placeholder={field}
            label={field}
            value={credentials[field]}
            onChange={handleCredentials}
          />
        ))}
        {signInResponse === "Two Factor Authenication code required" &&
          <TwoFactorAuth code={credentials.code} setCode={(e) => { handleCredentials({ target: { value: e, name: "code" } }) }} />
        }
      </form>
      <div className="authentication__authentication-status">
        {signInResponse.message !== "" && (
          <div className="authentication__signin-response">
            {signInResponse.message}
          </div>
        )}
      </div>
      <div className="sign-in__login">
      <UiButton traits={{ width: "100%" }} variant="dark" onClick={handleSignIn} busy={isSubmitting}>
        login
      </UiButton>
      </div>
    </>
  )
}

export default SignIn;