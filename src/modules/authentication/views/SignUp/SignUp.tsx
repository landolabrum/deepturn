import { useEffect, useState } from "react";
import styles from "./SignUp.scss";

import Input from "@webstack/components/UiInput/UiInput";
import type { NextComponentType } from "next";
import UiButton from "@webstack/components/UiButton/UiButton";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import { getService } from "@webstack/common";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import useUserAgent from "~/src/core/authentication/hooks/useUserAgent";
import keyStringConverter from "@webstack/helpers/keyStringConverter";

const DEFAULT_RESPONSE = { response: "", message: "" };
const authResponseMessages: any = {
  fail: "We're sorry, that password doesn't seem to be correct. Please check and try again.",
  "bad-email": "Sorry, it looks like that email address isn't quite right. Please check and try again.",
  "no-email": "We're sorry, it looks like you forgot to enter your email address. Please try again.",
  "no-password": "Oops, it looks like you forgot to enter your password. Please try again.",
  "non-same-passwords": "Oops, it looks like your passwords do not match.",
  "no-credentials": "Please enter your email and password to continue.",
  "non-staff": "Sorry, it looks like you don't have permission to access this feature. Please contact support if you believe this is a mistake.",
  default: "Sorry, an unexpected error occurred. Our team has been notified and we'll work to resolve it as soon as possible.",
};

export interface ISignUp {
  setView: (e:any)=>void;
}

const SignUp = ({setView}:ISignUp) => {
  const [signInResponse, setSignInResponse] = useState<any>(DEFAULT_RESPONSE);
  const userResponse = useUser();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const memberService = getService<IMemberService>("IMemberService");
  const user_agent = useUserAgent();
  const fields = ["first_name","last_name","email", "password","confirm_password"];
  const [formData, setFormData] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirm: "",
  });

  function handleCredentials(e: any) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const authResponse = (error: any) => authResponseMessages[error] || authResponseMessages.default;

  async function handleSignIn() {
    setIsSubmitting(true);
    const hasAllFields = fields.every((key) => {return formData.hasOwnProperty(key) && formData[key] !== ""});
    if (hasAllFields) {
      if(formData.password != formData.confirm_password){
        setIsSubmitting(false);
        setSignInResponse({ code: "non-same-passwords", message: authResponse("non-same-passwords")});
        return;
      };

      try {
        const resp = await memberService.signUp({
          email: formData.email,
          password: formData.password,
          name: `${formData.first_name} ${formData.last_name}`,
          user_agent,
        });
        if(resp.status == 'created' && resp.email != undefined)setView(resp.email)
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
      setSignInResponse({ code: "no-credentials", message: authResponse(fields.filter((key) => !formData.hasOwnProperty(key))) });
    }
    setIsSubmitting(false);
  }

  useEffect(() => {
    if (userResponse && userResponse.memberType !== "staff") {
      setSignInResponse({ code: "non-staff", message: authResponse("non-staff") });
      setIsSubmitting(false);
    }
  }, [userResponse, setFormData]);

  return (
    <>
    <style jsx>{styles}</style>
      <form className="sign-up">
        {fields.map((field) => (
          <Input
            key={field}
            type={field.includes("password")?"password":"text"}
            autoComplete={field === "email" ? "username" : "current-password"}
            name={field}
            variant={["bad-email", "password required", "no credentials provided"].includes(signInResponse) ? "invalid dark" : "dark"}
            placeholder={keyStringConverter(field)}
            label={keyStringConverter(field)}
            value={formData[field]}
            onChange={handleCredentials}
          />
        ))}
      </form>
      <div className="authentication__authentication-status">
        {signInResponse.message}
      </div>
      <div className="sign-up__login">
      <UiButton traits={{ width: "100%" }} variant="dark" onClick={handleSignIn} busy={isSubmitting}>
      {/* <UiButton traits={{ width: "100%" }} variant="dark" onClick={()=>setSignInResponse({message:"heleo"})} busy={isSubmitting}> */}
        login
      </UiButton>
      </div>
    </>
  )
}

export default SignUp;