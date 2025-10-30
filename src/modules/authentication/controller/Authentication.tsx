import { useEffect, useState } from "react";
import LoginView from "../views/Login/views/LoginView/LoginView";
import styles from "./Authentication.scss";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import SignUp from "../views/SignUp/SignUp";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { useRouter } from "next/router";
import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import Link from "next/link";
import { useModal } from "@webstack/components/Containers/modal/contexts/modalContext";
import { useNotification } from "@webstack/components/Notification/Notification";
import { useClearance } from "~/src/core/authentication/hooks/useUser";
import environment from "~/src/core/environment";

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
    [key: string]: AuthTextProps;
  };
};

const Authentication: React.FC<AuthenticationProps> = ({ view = "sign-in", content }) => {
  const [newCustomerEmail, setNewCustomerEmail] = useState<string | undefined>();
  const [hover, setHover] = useState<boolean>(false);
  const [viewState, setView] = useState<string>(view); // Ensure this is initialized properly
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const [notif, setNotification] = useNotification();

  const handleViewToggle = () => {
    setView((prev: string) => (prev === "sign-in" ? "sign-up" : "sign-in"));
  };

  const handleSignup = (response: any) => {
    const status = response?.status;
    let label = "404, an error occurred signing up.";
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
        // const adminClearance = useClearance() > 9;
        const clearance = useClearance();
        const admin1 = clearance > 9;
        const onProfileClick = (isAdmin: boolean) => {
          router.push(isAdmin && admin1 ? "/admin" : "/profile");
          closeModal();
        };

        return (
          <><style jsx>{styles}</style>
            <div className="authentication__welcome-modal">
              <h3>Welcome, {user.name}</h3>
              {clearance >= 12 && <UiButton href="/god">god</UiButton>}
                            {admin1 && <UiButton onClick={onProfileClick}>admin</UiButton>}

              <UiButton onClick={onProfileClick}>account</UiButton>
              <UiButton onClick={onClose}>Close</UiButton>
            </div>
          </>
        );
      };

      openModal({
        title: "User Details",
        variant: "popup",
        children: <WelcomeModalContent user={user} onClose={closeModal} />,
      });
    }
  };

  useEffect(() => {
    const { query } = router;
    if (query?.verify && viewState !== "verify") setView("verify");
    if (newCustomerEmail) setView("sign-in");
  }, [newCustomerEmail, router.query]);

  const defaultText: { [key: string]: AuthTextProps } = {
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

  const contentProps = {
    ...defaultText[viewState],
    ...content?.[viewState],
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className={`authentication ${viewState === "sign-in" ? "authentication__sign-in" : ""}`}>
        <div className="authentication__view-header">
          {/* <div className="authentication__logo">
          </div> */}
          <div className="authentication__view-name">{contentProps.title}</div>
        </div>

        {viewState.includes("@") && (
          <div className="authentication__email-verify">
            An email has been sent to
            <Link
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              style={hover ? { color: "var(--primary)" } : undefined}
              href={`mailto://${viewState}`}
            >
              {" " + viewState + ", "}
            </Link>
            click the link in the email to continue.
          </div>
        )}

        {viewState === "sign-in" && <LoginView email={newCustomerEmail} onSuccess={handleSignIn} />}
        {viewState === "sign-up" && <SignUp onSuccess={handleSignup} />}

        <div className="authentication__view-action">
          <div className="authentication__view-label">
            <div className="authentication__view-label--text">{contentProps.alternateText}</div>
          </div>

          <UiButton onClick={handleViewToggle} variant="link">
            {contentProps.toggleText}
          </UiButton>
        </div>
      </div>
    </>
  );
};

export default Authentication;
