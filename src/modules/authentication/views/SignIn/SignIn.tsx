import { useEffect, useState } from "react";
import UiInput from "@webstack/components/UiInput/UiInput";
import type { NextComponentType } from "next";
import TwoFactorAuth from "./components/TwoFactorAuth/TwoFactorAuth";
import UiButton from "@webstack/components/UiButton/UiButton";
import { useClearance, useUser } from "~/src/core/authentication/hooks/useUser";
import { getService } from "@webstack/common";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import useUserAgent from "~/src/core/authentication/hooks/useUserAgent";
import styles from "./SignIn.scss";
import { useNotification } from "@webstack/components/Notification/Notification";
import { useLoader } from "@webstack/components/Loader/Loader";
import { useModal } from "@webstack/components/modal/contexts/modalContext";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import environment from "~/src/environment";
import { useRouter } from "next/router";

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
  const defaultCredentials = {
    email: "",
    password: "",
    code: defaultCodeValue,
  }
  const [notif, setNotif]=useNotification();
  const [signInResponse, setSignInResponse] = useState<any>(DEFAULT_RESPONSE);
  const { closeModal, openModal } = useModal();
  const userResponse = useUser();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const memberService = getService<IMemberService>("IMemberService");
  const user_agent = useUserAgent();
  const [credentials, setCredentials] = useState<any>(defaultCredentials);

  function handleCredentials(e: any) {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }
  const Success = (response: any) =>{
    const router = useRouter();
    const level = useClearance();
   const handleRoute = (route: string) =>{
    closeModal();
    router.push(route);
   }
    return <>
          <style jsx>{styles}</style>
          <div className='sign-in__status'>
            <div className='sign-in__status--success'>
              <div className='sign-in__status--success--header'>
                <UiIcon icon={`${environment.merchant.name}-logo`}/>
                {`Welcome, ${response.data?.name}`}
              </div>
              <UiButton  variant='primary' onClick={()=>handleRoute('/account')}>Account</UiButton>
              {level > 9 && <UiButton   onClick={()=>handleRoute('/admin')}>Admin</UiButton>}
            </div>
          </div>
        </>
  }

  async function handleSignIn() {
    setIsSubmitting(true);
    if (credentials.email && credentials.password) {
      const validTFA = /^\d{6}$/.test(credentials.code);
      try{
        const signInResponse = await memberService.signIn({
          email: credentials.email,
          password: credentials.password.replace(/\s+/g, ''),
          ...(validTFA && { code: credentials.code }),
          user_agent,
        });
        if(signInResponse){
          const response = {status:'success', data:signInResponse}
          openModal(<Success {...response} />);
        }
        // console.log(`[  signInResponse]:`, signInResponse);
      }catch(e:any){
        // onSubmit({status:'error', data:signInResponse, error:e})
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
      <div className="sign-in__authentication-status">
        {signInResponse?.message !== "" && (
          <div className="sign-in__signin-response">
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