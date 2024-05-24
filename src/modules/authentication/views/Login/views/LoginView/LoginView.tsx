import { useEffect, useState } from "react";
import UiInput from "@webstack/components/UiInput/UiInput";
import TwoFactorAuth from "../TwoFactorAuth/TwoFactorAuth";
import UiButton from "@webstack/components/UiButton/UiButton";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import { getService } from "@webstack/common";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import useUserAgent from "~/src/core/authentication/hooks/useUserAgent";
import styles from "./LoginView.scss";
import { useNotification } from "@webstack/components/Notification/Notification";
import { useModal } from "@webstack/components/modal/contexts/modalContext";
import { ILogin } from "../../controller/Login";
import environment from "~/src/core/environment";
import { IFormField } from "@webstack/components/UiForm/models/IFormModel";

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

const LoginView: React.FC<ILogin> = ({ email, onSuccess }: ILogin) => {
  const defaultCredentials = {
    email: "",
    password: "",
    code: defaultCodeValue,
  }
  const [notification, setNotification] = useNotification();

  const [signInResponse, setSignInResponse] = useState<any>(DEFAULT_RESPONSE);
  const userResponse = useUser();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const MemberService = getService<IMemberService>("IMemberService");
  const user_agent = useUserAgent();
  const [credentials, setCredentials] = useState<any>(defaultCredentials);

  function handleCredentials(e: any) {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }


  async function handleSignIn(e: any) {
    e.preventDefault();
    setIsSubmitting(true);
    if (credentials.email && credentials.password) {
      const validTFA = /^\d{6}$/.test(credentials.code);
      try {
        const resp = await MemberService.signIn({
          email: credentials.email,
          metadata: {
            user: {
              password: credentials.password.replace(/\s+/g, ''),
              ...(validTFA && { code: credentials.code }),
              user_agent,
              merchant: environment.merchant
            }
          }
        });
         const  closeMod = async () =>{
          return;
        }
        if (onSuccess) {
          closeMod().then(()=>onSuccess(resp))
        }
        else setSignInResponse('error');
      } catch (e: any) {
        if (e.detail != undefined) {
          console.error('[ SIGN IN VIEW onError ]', e);

          e.detail?.fields && setNotification({
            active: true,
            list: e.detail.fields
            // persistence: 3000
          });
          setSignInResponse(e.detail)
        } else {
          setSignInResponse('*server down')
        }
      }
    }
    setIsSubmitting(false);
  }
  const tryError: any = (field: IFormField) => {
    const context = Array(signInResponse?.fields)?.length && Array(signInResponse?.fields).find((f: any) => Boolean(f?.name) && f.name == field);
// console.log('[ CONTEX ]', context)
    return context;
  }

  useEffect(() => {
    if (email) setCredentials({ ...credentials, email: email });
    setIsSubmitting(false);
  }, [userResponse, setCredentials, setSignInResponse, Boolean(credentials == defaultCredentials)]);
  return (
    <>
      <style jsx>{styles}</style>
      <form className="sign-in" style={{ color: 'black' }}>
        {["email", "password"].map((field) => {
          const hasError = tryError(field);
          return (
            <UiInput
              key={field}
              type={field}
              autoComplete={field === "email" ? "on" : "off"}
              // autoComplete={field === "email" ? "username" : "current-password"}
              name={field}
              variant={hasError && 'invalid'}
              placeholder={field}
              error={hasError && hasError?.message}
              label={field}
              value={credentials[field]}
              onChange={handleCredentials}
            />
          )
        })}
        {signInResponse === "Two Factor Authenication code required" &&
          <TwoFactorAuth code={credentials.code} setCode={(e) => { handleCredentials({ target: { value: e, name: "code" } }) }} />
        }
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
          <UiButton type='submit' variant='glow' onClick={handleSignIn} busy={isSubmitting}>
            login
          </UiButton>
        </div>
      </form>
    </>
  )
}

export default LoginView;