import { useEffect, useState } from "react";
import styles from "./SignUp.scss";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import { getService } from "@webstack/common";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import useUserAgent from "~/src/core/authentication/hooks/useUserAgent";
import UiForm from "@webstack/components/UiForm/UiForm";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { IFormField } from "@webstack/components/UiForm/models/IFormModel";
import environment from "~/src/environment";
import { useRouter } from "next/router";

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
  setView: (e: any) => void;
}
const form = [
  { name: "first_name", label: "first name", placeholder: 'first name', required: true },
  { name: "last_name", label: "last name", placeholder: 'last name', required: true },
  { name: "email", type: 'email', label: "email", placeholder: 'your@email.com', required: true, 
  // error: 'email exists' 
},
  { name: "password", label: "password", type: 'password', placeholder: 'password', required: true },
  { name: "confirm_password", label: "confirm password", type: 'password', placeholder: 'confirm password', required: true }
];
const SignUp = ({ setView }: ISignUp) => {
  const [loading, setLoading] = useState<any>(false);
  const user = useUser();
  const memberService = getService<IMemberService>("IMemberService");
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
      switch (fn) {
        case 'first_name':
          if (vl < 3) hasError = changeField(fn, 'error', minMsg);
          else if (vl > 20) hasError = changeField(fn, 'error', maxMsg);
          break;
        case 'last_name':
          if (vl < 3) hasError = changeField(fn, 'error', minMsg);
          else if (vl > 20) hasError = changeField(fn, 'error', maxMsg);
          break;
        case 'email':
          if (!fv.includes('@')) hasError = changeField(fn, 'error', `${fnd}, missing "@"`);
          else if (!fv.includes('.')) hasError = changeField(fn, 'error', `${fnd}, missing "."`);
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
  const { asPath } = useRouter();
  const origin =
      typeof window !== 'undefined' && window.location.origin
          ? window.location.origin
          : '';

  const URL = `${origin}${asPath}`;
  const handleChange = (e: any) => {
    const {name, value}=e.target;
    changeField(name, 'value', value);
  };
  const handleSubmit = async () => {
    setLoading(true);
    const errors = handleErrors();
    if (!errors) {
      let request = fields.reduce((acc: any, obj: any) => {
        acc[obj.name] = obj.value;
        return acc;
      }, {});
      request.name = `${request.first_name} ${request.last_name}`
      request.user_agent = user_agent;
      request.referrer_url = URL;
      // console.log('[ REQ ]', request)
      try {
        const resp = await memberService.signUp(request);
        if (resp.status == 'created' && resp.email != undefined && setView) setView(resp.email);setLoading(false);
      } catch (_e: any) {
        const e = JSON.parse(JSON.stringify(_e));
        if (e.name === "AuthenticationError") {
          alert(JSON.stringify(e))
          // console.log("[ ERROR 1 ]", e);
        }
        if (e.error) {
          if (e.detail?.fields) {
            const errorFields = e.detail?.fields;
            const newFields = fields.map((field: IFormField) => {
              const isError = errorFields.find((f: IFormField) => {return field.name == f.name});
              if(isError)field.error = isError.message;
              return field
            })
            setFields(newFields)
          }
        }
      }
    }
  };

  return (
    <>
      <style jsx>{styles}</style>
      {!user && <UiForm fields={fields} onSubmit={handleSubmit} loading={loading} onChange={handleChange} btnText='sign up' />}
      {/* {user} */}
      <div className="authentication__authentication-status">
        {loading?.message}
      </div>

    </>
  )
}

export default SignUp;