import { useEffect, useState } from "react";
import UiInput from "@webstack/components/UiInput/UiInput";
import type { NextComponentType } from "next";
import TwoFactorAuth from "./components/TwoFactorAuth/TwoFactorAuth";
import UiButton from "@webstack/components/UiButton/UiButton";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import { getService } from "@webstack/common";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import useUserAgent from "~/src/core/authentication/hooks/useUserAgent";
import styles from "./SignIn.scss";
import { useNotification } from "@webstack/components/Notification/Notification";
import { useLoader } from "@webstack/components/Loader/Loader";
import { useModal } from "@webstack/components/modal/contexts/modalContext";

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
const SignIn = ({ email }: { email: string | undefined }) => {
  const [loader, setLoader]=useLoader();
  const defaultCredentials = {
    email: "",
    password: "",
    code: defaultCodeValue,
  }
  const [notif, setNotif]=useNotification();
  const [signInResponse, setSignInResponse] = useState<any>(DEFAULT_RESPONSE);
  const { closeModal } = useModal();
  const userResponse = useUser();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const memberService = getService<IMemberService>("IMemberService");
  const user_agent = useUserAgent();
  const [credentials, setCredentials] = useState<any>(defaultCredentials);

  function handleCredentials(e: any) {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  const authResponse = (error: any) => authResponseMessages[error] || authResponseMessages.default;

  async function handleSignIn() {
    setIsSubmitting(true);
    if (credentials.email && credentials.password) {
      const validTFA = /^\d{6}$/.test(credentials.code);
      try{
        const signInResponse = await memberService.signIn({
          email: credentials.email,
          password: credentials.password,
          ...(validTFA && { code: credentials.code }),
          user_agent,
        });
        if(signInResponse)closeModal();
        // console.log(`[  signInResponse]:`, signInResponse);
      }catch(e:any){
        if(e.detail!=undefined){
          e.detail?.fields && setNotif({
            active: true,
            list: e.detail.fields,
            persistance: 3000
          })
          setSignInResponse(e.detail)
        }else{
          setSignInResponse('*server down')
        }
      }
    }
    setIsSubmitting(false);
  }

  useEffect(() => {
    if (email) setCredentials({ ...credentials, email: email });
    setIsSubmitting(false);
  }, [userResponse, setCredentials, Boolean(credentials == defaultCredentials), email]);

  return (
    <>
      <style jsx>{styles}</style>
      <form className="sign-in" style={{ color: 'black' }}>
        {["email", "password"].map((field) => {
          const hasError = signInResponse?.fields !== undefined && signInResponse?.fields.find((f:any)=>f.name==field)
          return(
            <UiInput
            key={field}
            type={field}
            autoComplete={field === "email" ? "username" : "current-password"}
            name={field}
            variant={hasError && 'invalid'}
            placeholder={field}
            error={hasError && hasError.message}
            label={field}
            value={credentials[field]}
            onChange={handleCredentials}
            />
            )
          })}
        {signInResponse === "Two Factor Authenication code required" &&
          <TwoFactorAuth code={credentials.code} setCode={(e) => { handleCredentials({ target: { value: e, name: "code" } }) }} />
        }
      </form>
      <div className="authentication__authentication-status">
        {signInResponse?.message !== "" && (
          <div className="authentication__signin-response">
            {/* {signInResponse.message} */}
            {signInResponse?.detail &&
              <ul className='sign-in__signin-response-details'>
                {Object.values(signInResponse?.detail).map((d: any, key) => {
                  return <li key={key} className='sign-in__signin-response-detail'>{d}</li>
                })}
              </ul>
            }
          </div>
        )}

      </div>
      <div className="sign-in__login">
        <UiButton variant='glow' onClick={handleSignIn} busy={isSubmitting}>
          login
        </UiButton>
      </div>
    </>
  )
}

export default SignIn;