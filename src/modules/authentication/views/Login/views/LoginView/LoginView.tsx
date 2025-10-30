import { useEffect, useState } from "react";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import { getService } from "@webstack/common";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import useUserAgent from "~/src/core/authentication/hooks/useUserAgent";
import styles from "./LoginView.scss";
import { ILogin } from "../../controller/Login";
import environment from "~/src/core/environment";
import { IFormField } from "@webstack/components/UiForm/models/IFormModel";
import UiForm from "@webstack/components/UiForm/controller/UiForm";
import { findField, updateField } from "@webstack/components/UiForm/functions/formFieldFunctions";
import { useNotification } from "@webstack/components/Notification/Notification";


const LoginView: React.FC<ILogin> = ({ email, onSuccess }: ILogin) => {
  const defaultCredentials = [
    { name: 'email', label:'email', placeholder: 'your email', value: email || '' },
    { name: 'password', label:'password', type:'password', placeholder: "* * * * * * *" },
  ]
  const userResponse = useUser();
  const MemberService = getService<IMemberService>("IMemberService");
  const user_agent = useUserAgent();
  const [, setNotification] = useNotification();

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
      const errorFields = response?.detail?.fields;
      if(errorFields){
       const newFields = fields.map((field:any)=>{
        const errorField = findField(errorFields, field.name)
        if(errorField){
        return {...field,...errorField}
        }
        return field
       }
       // const message = findField(response?.detail?.fields, 'email')?.message
      ) // updateField(fields, 'email', {exception, message})
      // console.log({newFields})
      setFields(newFields );
      // Surface a user-facing notification
      const label = "Login failed";
      const msg = (findField(errorFields, 'password')?.error
                  || findField(errorFields, 'email')?.error
                  || "Invalid email or password");
      setNotification({
        active: true,
        dismissable: true,
        list: [{ label, message: msg }]
      });
    }else{
        // console.log({response})
        onSuccess?.(response)
      }
      
    })
    .catch((err:any)=>{
      // Network or unexpected failure — show via apiError shape if possible
      const apiErr = err?.status ? err : { message: 'Login error', status: 500, detail: err, error: true };
      setNotification({ active: true, dismissable: true, apiError: apiErr });
    })
      // fields.forEach((field:any)=>{
      //   console.log({field, exception})
      // })

}

  return (
    <>
      <style jsx>{styles}</style>
      <UiForm fields={fields} onChange={onChange} onSubmit={onSubmit} submitText="login" />
    </>
  );
}

export default LoginView;
