import { useEffect, useState } from "react";
import LoginView from "../views/Login/views/LoginView/LoginView";
import styles from "./Authentication.scss";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import SignUp from "../views/SignUp/SignUp";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { useRouter } from "next/router";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import Link from "next/link";
import environment from "~/src/core/environment";
import { useModal } from "@webstack/components/Containers/modal/contexts/modalContext";
import { useNotification } from "@webstack/components/Notification/Notification";
import { useClearance } from "~/src/core/authentication/hooks/useUser";

type AuthTextProps = {
  view?: 'sign-in' | 'sign-up';
  title?: string;
  description?: string;
  buttonText?: string;
  alternateText?: string;
  toggleText?: string;
};

type AuthenticationProps = {
  view?: string;
  content?: {
    'sign-in'?: AuthTextProps;
    'sign-up'?: AuthTextProps;
  };
};

const Authentication: React.FC<AuthenticationProps> = (props) => {
  const [newCustomerEmail, setNewCustomerEmail] = useState<string | undefined>();
  const [view, setView] = useState<string>(props?.view || "sign-in");
  const [hover, setHover] = useState<boolean>(false);
  const router = useRouter();
  const query = router.query;
  const { openModal, closeModal } = useModal();
  const [notif, setNotification] = useNotification();

  const handleView = () => {
    setView((prev) =>
      prev === "sign-in" || prev === "existing" || prev === "customer-created"
        ? "sign-up"
        : "sign-in"
    );
  };

  const handleSignup = (response: any) => {
    const status = response?.status;
    if (!status) {
      alert("dev, handle this! 212");
      return;
    }

    let label = "404, an error occured signing up.";
    if (status === "created") label = `email: ${response?.email}, successfully created.`;
    if (status === "existing") label = `email: ${response?.email}, exists.`;

    setNotification({
      active: true,
      list: [{ label, message: "Please wait a few minutes before logging in" }],
    });
    setView("sign-in");
    setNewCustomerEmail(response.email);
  };

  const handleSignIn = (user: any) => {
    if (user?.id) {
      const WelcomeModalContent = ({ user, onClose }: any) => {
        const adminClearance = useClearance() > 9;

        const onProfileClick = (isAdmin: boolean) => {
          router.push(isAdmin && adminClearance ? "/admin" : "/user-account");
          closeModal();
        };

        return (
          <>
            <style jsx>{styles}</style>
            <div className="authentication__welcome-modal">
              <h3>Welcome, {user.name}</h3>
              {adminClearance && <UiButton onClick={onProfileClick}>admin</UiButton>}
              <UiButton onClick={onProfileClick}>account</UiButton>
              <UiButton onClick={onClose}>Close</UiButton>
            </div>
          </>
        );
      };

      openModal({
        title: "User Details",
        children: <WelcomeModalContent user={user} onClose={closeModal} />,
      });
    }
  };

  useEffect(() => {
    if (query && query.verify && view !== "verify") setView("verify");
    if (newCustomerEmail !== undefined) setView("sign-in");
  }, [handleSignup, handleSignIn]);

  const defaultText = {
    "sign-in": {
      title: keyStringConverter("sign-in"),
      alternateText: "no account?",
      toggleText: "Sign Up",
    },
    "sign-up": {
      title: keyStringConverter("sign-up"),
      alternateText: "already have an account?",
      toggleText: "Login",
    },
  };

  const content = {
    ...defaultText[view as keyof typeof defaultText],
    ...props.content?.[view as keyof typeof props.content],
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className={`authentication ${view === "sign-in" ? "authentication__sign-in" : ""}`}>
        <div className="authentication__view-header">
          <div className="authentication__logo">
            <UiIcon icon={`${environment.merchant.name}-logo`} />
          </div>
          <div className="authentication__view-name">{content.title}</div>
        </div>

        {view.includes("@") && (
          <div className="authentication__email-verify">
            An email has been sent to
            <Link
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              style={hover ? { color: "var(--primary)" } : undefined}
              href={`mailto://${view}`}
            >
              {" " + view + ", "}
            </Link>
            click the link in the email to continue.
          </div>
        )}

        {view === "sign-in" && <LoginView email={newCustomerEmail} onSuccess={handleSignIn} />}
        {view === "sign-up" && <SignUp onSuccess={handleSignup} />}

        <div className="authentication__view-action">
          <div className="authentication__view-label">
            <div className="authentication__view-label--text">{content.alternateText}</div>
          </div>

          <UiButton onClick={handleView} variant="link">
            {content.toggleText}
          </UiButton>
        </div>
      </div>
    </>
  );
};

export default Authentication;
