import React, { useEffect, useState } from "react";
import styles from "./SignUp.scss";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import { getService } from "@webstack/common";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import useUserAgent from "~/src/core/authentication/hooks/useUserAgent";
import UiForm from "@webstack/components/UiForm/controller/UiForm";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import useReferrer from "@webstack/hooks/useReferrer";
import { findField } from "@webstack/components/UiForm/functions/formFieldFunctions";
import { useNotification } from "@webstack/components/Notification/Notification";


export interface ISignUp {
  // setView?: (e: any) => void;
  onSuccess?: (e: any) => void;
  hasPassword?: boolean;
  btnText?: string;
  login?: boolean
  title?: string | React.ReactElement;
}
const form = [
  { name: "first_name", label: "first name", placeholder: 'first name', required: true, width: '50%' },
  { name: "last_name", label: "last name", placeholder: 'last name', required: true, width: '50%' },
  { name: "email", type: 'email', label: "email", placeholder: 'your@email.com', required: true }
];
const pwFields = [
  { name: "password", label: "password", type: 'password', placeholder: 'password', required: true },
  { name: "confirm_password", label: "confirm password", type: 'password', placeholder: 'confirm password', required: true }
]
const SignUp = ({ hasPassword = true, btnText, onSuccess, title }: ISignUp): React.JSX.Element => {
  const [notification, setNotification] = useNotification();
  const [loading, setLoading] = useState<any>(false);
  const user = useUser();
  const MemberService = getService<IMemberService>("IMemberService");
  const user_agent = useUserAgent();
  const [fields, setFields] = useState<any>(form);

  const changeField = (fieldName: string, key: string, value: string) => {
    const changedFields = fields.map((field: any) => {
      if (field?.name == fieldName) {
        delete field.error;
        field[key] = value;
      }
      return field;
    });
    setFields(changedFields);
    return true;
  }

  const handleErrors = () => {
    let hasError = false;
    fields.forEach((field: any) => {
      const fn = field?.name;
      const fnd = keyStringConverter(fn);
      const fv = field?.value;
      const vl = fv?.length;
      const minMsg = `${fnd}, is not long enough`;
      const maxMsg = `${fnd}, is not long enough`;
      if (!fv) hasError = changeField(fn, 'error', `${fnd}, can't be empty`);
      else switch (fn) {
        case 'first_name':
          if (vl < 3) hasError = changeField(fn, 'error', minMsg);
          else if (vl > 20) hasError = changeField(fn, 'error', maxMsg);
          break;
        case 'last_name':
          if (vl < 3) hasError = changeField(fn, 'error', minMsg);
          else if (vl > 20) hasError = changeField(fn, 'error', maxMsg);
          break;
        case 'email':
          if (fv && !fv.includes('@')) hasError = changeField(fn, 'error', `${fnd}, missing "@"`);
          else if (fv && !fv.includes('.')) hasError = changeField(fn, 'error', `${fnd}, missing "."`);
          break;
        case 'password':
          const cpw_val = fields.find((f: any) => f.name == 'confirm_password')?.value;
          if (vl < 3) hasError = changeField(fn, 'error', minMsg);
          else if (vl > 20) hasError = changeField(fn, 'error', maxMsg);
          if (fv != cpw_val) {
            hasError = changeField(fn, 'error', `Passwords don't match`);
            hasError = changeField('confirm_password', 'error', `Passwords don't match`);
          }
          break;

        default:
          break;
      }
    });
    return hasError;
  }


  const URL = useReferrer();
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    changeField(name, 'value', value);
  };
  type InotificationContext = {data: string, email: string, status: "existing"}
const handleNotifictaion = (notificationContext: InotificationContext) =>{
  if(notificationContext.status === 'existing'){
    setNotification({
      active: true,
      persistance: 3000,
      list:[{name:"email exists, sign in to continue"}]});
  }
  // const active = notification?.active;
  console.log('[ NOTIFICIATION ]', {notification, notificationContent: notificationContext})
}
  const handleSubmit = async () => {
    setLoading(true);
    const errors = handleErrors();
    if (!errors) {
      let request = fields.reduce((acc: any, obj: any) => {
        acc[obj.name] = obj.value;
        return acc;
      }, {});
      request.name = `${request.first_name} ${request.last_name}`;
      request.user_agent = user_agent;
      request.origin = URL;

      try {
        const response = await MemberService.signUp(request);
        
        if (response?.status === 'created') {
          onSuccess && onSuccess(response);
        }
        else if (response?.status === 'existing' && onSuccess) {
          const existingContext = {...response, email: findField(fields,'email')?.value};
          onSuccess(existingContext);
          handleNotifictaion(existingContext);
        }else {
          console.error('[ SIGN UP RESPONSE UNHANDLED ]', response);
          // Display a general user-friendly error message
        }
      } catch (e: any) {
        if (e?.detail?.fields) {
          e.detail.fields.forEach((field: any) => {
            changeField(field.name, 'error', field.message);
          });
        } else {
          console.error('[ SIGN UP RESPONSE ERRORS ]', e);
          // Display a general user-friendly error message
        }
      }
    } else {
      console.error('[ SIGN UP ERRORS LOCAL ]', errors);
    }
    setLoading(false);
  };


  useEffect(() => {
    if (hasPassword) {
      setFields([...fields, ...pwFields]);
    }
  }, []);
  return (
    <>
      <style jsx>{styles}</style>

      {!user && <UiForm title={title} fields={fields} onSubmit={handleSubmit} loading={loading} onChange={handleChange} submitText={btnText || 'sign up'} />}
      <div className="authentication__authentication-status">
        {loading?.message}
      </div>
    </>
  )
}

export default SignUp;