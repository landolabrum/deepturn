import { useEffect } from "react";
import Input from "@webstack/components/UiInput/UiInput";
import type { NextComponentType, NextPageContext } from "next";
import styles from "./SignIn.scss";
import TwoFactorAuth from "./components/TwoFactorAuth/TwoFactorAuth";

export type ResponseProp = "no credentials provided" | "email required" | "password required" | "You do not have admin access" | "bad-email" | "fail" | "Two Factor Authenication code required" | "Two Factor Authenication code was incorrect" | "";
export interface SignInProps {
  credentials: {
    email: string;
    password: string;
    code: string;
  }
  response: ResponseProp;
  handleCredentials: (e: any) => void;
}

const SignIn: NextComponentType<NextPageContext, {}, SignInProps> = (
  { handleCredentials, credentials, response }: SignInProps,
) => {
  useEffect(() => { }, [credentials])
  return (
    <>
      <style jsx>{styles}</style>
      <form className="sign-in">
        <Input type="email" autoComplete="username" name="email" variant={`${["bad-email", 'email required', "no credentials provided"].includes(response) && "invalid"}`} placeholder="email" label="email" value={credentials?.email} onChange={handleCredentials} />
        <Input autoComplete="current-password" name="password" type="password" variant={`${["bad-email", 'password required', "no credentials provided"].includes(response) && "invalid"}`} placeholder="password" label="password" value={credentials?.password} onChange={handleCredentials} />
        {/* <div className="sign-in__forgot-password-link" onClick={() => alert("To Bad")} >forgot password</div> */}
        {response === "Two Factor Authenication code required" &&
          <TwoFactorAuth code={credentials.code} setCode={(e) => { handleCredentials({ target: { value: e, name: "code" } }) }} />
        }
      </form>
    </>
  )
}

export default SignIn