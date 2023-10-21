import { useEffect, useState } from "react";
import styles from "./SignUp.scss";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import { getService } from "@webstack/common";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import useUserAgent from "~/src/core/authentication/hooks/useUserAgent";
import UiForm from "@webstack/components/UiForm/UiForm";
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
  setView: (e: any) => void;
}
const form = [
  { name: "first_name", label: "first name", value: 'fname' },
  { name: "last_name", label: "last name", value: 'lname' },
  { name: "email", label: "email", value: 'test@test.co' },
  { name: "password", label: "password", type: 'password', value: 'password' },
  { name: "confirm_password", label: "confirm password", type: 'password', value: 'password' }
];
const SignUp = ({ setView }: ISignUp) => {
  const [loading, setLoading] = useState<any>(false);
  const user = useUser();
  const memberService = getService<IMemberService>("IMemberService");
  const user_agent = useUserAgent();

  const [fields, setFields] = useState<any>(form);

  const changeField = (fieldName: string, key: string, value: string) => {
    const changedFields = fields.map((field: any) => {
      if (field?.name == fieldName) field[key] = value;
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

  const handleChange = (e: any) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    changeField(name, 'value', value);
  };
  const handleSubmit = async () => {
    if (!handleErrors()) {
      let request = fields.reduce((acc: any, obj: any) => {
        acc[obj.name] = obj.value;
        return acc;
      }, {});
      request.name = `${request.first_name} ${request.last_name}`
      request.user_agent = user_agent;
      try {
        const resp = await memberService.signUp(request);
        if (resp.status == 'created' && resp.email != undefined && setView) setView(resp.email);
      } catch (e: any) {
        const error = JSON.parse(JSON.stringify(e));
        if (error.name === "AuthenticationError") {
          console.log("[ ERROR 1 ]", e);
        }
        if (error.message) {
          console.log("[ ERROR 2 ]", e);
        }
      }
    }
  };

  return (
    <>
      <style jsx>{styles}</style>
      {/* {JSON.stringify(fields)} */}
      {!user && <UiForm fields={fields} onSubmit={handleSubmit} loading={loading} onChange={handleChange} btnText='sign up' />}
      {user}
      <div className="authentication__authentication-status">
        {loading?.message}
      </div>

    </>
  )
}

export default SignUp;

























{/* <div className="sign-up__login">
      <UiButton traits={{ width: "100%" }} onClick={handleSignIn} busy={isSubmitting}>
        Create Account
      </UiButton>
      </div> */}





{/* <form className="sign-up">
        {fields.map((field) => (
          <UiInput
            key={field}
            type={field.includes("password")?"password":"text"}
            autoComplete={field === "email" ? "username" : "current-password"}
            name={field}
            variant={["bad-email", "password required", "no credentials provided"].includes(signInResponse) ? "invalid": undefined}
            placeholder={keyStringConverter(field)}
            label={keyStringConverter(field)}
            value={formData[field]}
            onChange={handleCredentials}
          />
        ))}
      </form> */}


// function handleCredentials(e: any) {
//   console.log('[ handleCredentials ]', e)
//   // setFormData({ ...formData, [e.target.name]: e.target.value });
// }

// const authResponse = (error: any) => authResponseMessages[error] || authResponseMessages.default;

// async function handleSignIn() {
//   setIsSubmitting(true);
//   const hasAllFields = fields.every((key) => {return formData.hasOwnProperty(key) && formData[key] !== ""});
//   if (hasAllFields) {
//     if(formData.password != formData.confirm_password){
//       setIsSubmitting(false);
//       setSignInResponse({ code: "non-same-passwords", message: authResponse("non-same-passwords")});
//       return;
//     };

//     try {
//       const resp = await memberService.signUp({
//         email: formData.email,
//         password: formData.password,
//         name: `${formData.first_name} ${formData.last_name}`,
//         user_agent,
//       });
//       if(resp.status == 'created' && resp.email != undefined)setView(resp.email)
//     } catch (e: any) {
//       const error = JSON.parse(JSON.stringify(e));
//       if (error.name === "AuthenticationError") {
//         setSignInResponse({ response: error.code, message: authResponse(error.code) });
//       }
//       if (error.message) {
//         setSignInResponse(error.message);
//       }
//     }
//   } else {
//     setSignInResponse({ code: "no-credentials", message: authResponse(fields.filter((key) => !formData.hasOwnProperty(key))) });
//   }
//   setIsSubmitting(false);
// }

// useEffect(() => {

//   if (userResponse && userResponse.memberType !== "staff") {
//     setSignInResponse({ code: "non-staff", message: authResponse("non-staff") });
//     setIsSubmitting(false);
//   }
// }, [userResponse, setFormData]);