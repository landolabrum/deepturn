import React, { useEffect, useState } from "react";
import styles from "./SignUp.scss";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import { getService } from "@webstack/common";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import useUserAgent from "~/src/core/authentication/hooks/useUserAgent";
import UiForm from "@webstack/components/UiForm/controller/UiForm";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { findField } from "@webstack/components/UiForm/functions/formFieldFunctions";
import { useNotification } from "@webstack/components/Notification/Notification";
import environment from "~/src/core/environment";


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


  // const URL = useReferrer();
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    changeField(name, 'value', value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const errors = handleErrors();
    if (!errors) {
      const request = {
        name: `${findField(fields, 'first_name')?.value} ${findField(fields, 'last_name')?.value}`,
        email: findField(fields, 'email')?.value,
        phone: findField(fields, 'phone')?.value,
        address: findField(fields, 'address')?.value,
        metadata: {
          user:{
              email: findField(fields, 'email')?.value,
              devices: [{user_agent, created:`${Date.now()}`}],
              password: findField(fields, "password")?.value
            },
            merchant:environment.merchant
        }
      }
      let context;
      try {
        const response = await MemberService.signUp(request);
        if (response?.email !== undefined ) {
          context = response;
          onSuccess && onSuccess(response);
        }
        else if (response?.status === 'existing' && onSuccess) {
          context = {...response, email: findField(fields,'email')?.value};
          onSuccess(context);
        }else {
          console.error('[ SIGN UP RESPONSE UNHANDLED ]', response);
          // Display a general user-friendly error message
        }
      } catch (e: any) {
        if (e?.detail?.fields) {
          console.log("[ e.detail.fields ]",e.detail.fields)
          e.detail.fields.forEach((field: any) => {
            changeField(field.name, 'error', field.message);
          });
        } else {
          console.error('[ SIGN UP RESPONSE ERRORS ]', e);
        }
      }
      // finally{
        // console.log('[ handleSubmit (signUp) ]',context)
      // }
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