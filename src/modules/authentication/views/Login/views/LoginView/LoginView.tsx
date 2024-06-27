import { useEffect, useState } from "react";
import UiInput from "@webstack/components/UiForm/components/UiInput/UiInput";
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
import UiForm from "@webstack/components/UiForm/controller/UiForm";
import { findField, updateField } from "@webstack/components/UiForm/functions/formFieldFunctions";

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
  const defaultCredentials = [
    { name: 'email', label:'email', placeholder: 'email', value: email || '' },
    { name: 'password', label:'password', type:'password', placeholder: "*****" },
  ]
  const userResponse = useUser();
  const MemberService = getService<IMemberService>("IMemberService");
  const user_agent = useUserAgent();

  const [fields, setFields] = useState<IFormField[] |[]>(defaultCredentials);
  const onChange = (e: any) => {
    const { name, value } = e.target
    setFields(fields.map(field=>{if(field.name == name )  field.value = value ;return field}))

  }

const onSubmit =(e:any) =>{
  const request = {
    email: findField(e, 'email')?.value,
    metadata:{
      user:{
        password: findField(e, 'password')?.value,
      },
      merchant: environment.merchant
    }
  };
  MemberService.signIn(request).then((response)=>{
    // console.log(response)
    onSuccess?.(response)
  })

}
  useEffect(() => {

  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      <UiForm 
        fields={fields}
        onChange={onChange}
        onSubmit={onSubmit}
        submitText='login'
      />
    </>
  )
}

export default LoginView;