import React, { useEffect, useState } from "react";
import styles from "./SignUp.scss";
import { useUser } from "~/src/core/authentication/hooks/useUser";
import { getService } from "@webstack/common";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import useDevice from "~/src/core/authentication/hooks/useDevice";
import UiForm from "@webstack/components/UiForm/controller/UiForm";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { useNotification } from "@webstack/components/Notification/Notification";
import environment from "~/src/core/environment";
import { FormField, useFormFields } from "@webstack/components/UiForm/hooks/useForm";
import { trackEvent } from "@webstack/components/UiForm/functions/trackEvent";

export interface ISignUp {
  onSuccess?: (e: any) => void;
  hasPassword?: boolean;
  btnText?: string;
  login?: boolean;
  title?: string | React.ReactElement;
  fieldConfig?: FormField[];
}

const defaultFields: FormField[] = [
  { name: "first_name", label: "first name", placeholder: "first name", required: true, width: "50%" },
  { name: "last_name", label: "last name", placeholder: "last name", required: true, width: "50%" },
  { name: "email", type: "email", label: "email", placeholder: "your@email.com", required: true }
];

const pwFields: FormField[] = [
  { name: "password", label: "password", type: "password", placeholder: "password", required: true },
  { name: "confirm_password", label: "confirm password", type: "password", placeholder: "confirm password", required: true }
];

const SignUp = ({ hasPassword = true, btnText, onSuccess, title, fieldConfig }: ISignUp): React.JSX.Element => {
  const [notification, setNotification] = useNotification();
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const MemberService = getService<IMemberService>("IMemberService");
  const device = useDevice();

  const { fields, setFields, changeField, findField } = useFormFields(fieldConfig || defaultFields);

  useEffect(() => {
    if (hasPassword && !fields.find((f) => f.name === "password")) {
      setFields([...fields, ...pwFields]);
    }
  }, [hasPassword]);

  const handleErrors = () => {
    let hasError = false;

    fields.forEach((field) => {
      const fn = field.name;
      const fnd = keyStringConverter(fn);
      const fv = field.value;
      const vl = fv?.length || 0;

      changeField(fn, "error", undefined);

      if (!fv) {
        changeField(fn, "error", `${fnd}, can't be empty`);
        hasError = true;
      } else {
        switch (fn) {
          case "first_name":
          case "last_name":
            if (vl < 3) {
              changeField(fn, "error", `${fnd}, is too short`);
              hasError = true;
            } else if (vl > 20) {
              changeField(fn, "error", `${fnd}, is too long`);
              hasError = true;
            }
            break;
          case "email":
            if (!fv.includes("@") || !fv.includes(".")) {
              changeField(fn, "error", `${fnd}, is not a valid email`);
              hasError = true;
            }
            break;
          case "password":
            const cpw = findField("confirm_password")?.value;
            if (vl < 6 || vl > 40) {
              changeField(fn, "error", `${fnd}, must be 6-40 characters`);
              hasError = true;
            }
            if (fv !== cpw) {
              changeField(fn, "error", `Passwords don't match`);
              changeField("confirm_password", "error", `Passwords don't match`);
              hasError = true;
            }
            break;
        }
      }
    });

    return hasError;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    changeField(name, "value", value);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const errors = handleErrors();

    if (!errors) {
      trackEvent("sign_up_attempt", {
        email: findField("email")?.value,
        merchant: environment.merchant
      });

      const request = {
        name: `${findField("first_name")?.value} ${findField("last_name")?.value}`,
        email: findField("email")?.value,
        phone: findField("phone")?.value,
        address: findField("address")?.value,
        metadata: {
          user: {
            email: findField("email")?.value,
            password: findField("password")?.value,
            devices: [{ ...device, created: `${Date.now()}` }]
          },
          merchant: environment.merchant
        }
      };

      let context;
      try {
        const response = await MemberService.signUp(request);

        if (response?.status === "existing") {
          context = { ...response, email: request.email };
          onSuccess && onSuccess(context);
          return;
        }

        if (response?.email) {
          context = { ...response, email: request.email };
          trackEvent("sign_up_success", { userId: response.id || "unknown" });
          setNotification({
            active: true,
            dismissable: true,
            persistence: 4000,
            children: (
              <>
                <h3>Welcome aboard!</h3>
                <p>Your account was created successfully.</p>
              </>
            )
          });
          onSuccess && onSuccess(context);
        } else {
          throw new Error("Unhandled sign-up response");
        }
      } catch (e: any) {
        const fields = e?.detail?.fields;
        const message = e?.detail?.message || e?.message;
        const isExisting = fields?.some((f: any) => f.error?.toLowerCase().includes("exists"));

        if (isExisting) {
          fields?.forEach((f: any) => changeField(f.name, "error", undefined));
          context = { status: "existing", email: request.email };
          onSuccess && onSuccess(context);
          return;
        }

        if (Array.isArray(fields)) {
          fields.forEach((field: any) => {
            changeField(field.name, "error", field.error);
          });

          setNotification({
            active: true,
            dismissable: true,
            apiError: {
              message: "Please check the highlighted fields.",
              status: e.status || 400,
              detail: { fields },
              error: true
            }
          });
        } else {
          changeField("email", "error", message || "Unexpected error");
          setNotification({
            active: true,
            dismissable: true,
            apiError: {
              message: message || "Unexpected error occurred.",
              status: e.status || 500,
              detail: e?.detail || e?.message,
              error: true
            }
          });
        }
      } finally {
        console.log("[handleSubmit Result]", context);
        setLoading(false);
      }
    } else {
      setNotification({
        active: true,
        dismissable: true,
        persistence: 3000,
        children: (
          <>
            <h3>Fix Form Errors</h3>
            <p>Please check the red-highlighted fields and try again.</p>
          </>
        )
      });
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{styles}</style>
      {!user && (
        <UiForm
          title={title}
          fields={fields}
          onSubmit={handleSubmit}
          loading={loading}
          onChange={handleChange}
          submitText={btnText || "sign up"}
        />
      )}
      <div className="authentication__authentication-status">{loading && "Processing..."}</div>
    </>
  );
};

export default SignUp;
