import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import styles from "./Notification.scss";
import { UiIcon } from "../UiIcon/controller/UiIcon";
import UiMarkdown from "../UiMarkDown/UiMarkDown";
import { IConfirm } from "../Containers/modal/contexts/modalContext";
import UiButton from "../UiForm/views/UiButton/UiButton";

const NO_SCROLL = "no-scroll";

interface INotificationListItem {
  label?: string;
  name?: string;
  message?: any;
  onClick?: (e: any) => void;
  href?: string;
}
interface INotificationApiError {
  message: string;
  status: number;
  detail: any; // array, object, or string
  error: boolean;
}

export type INotification = {
  list?: INotificationListItem[];
  apiError?: INotificationApiError;
  confirm?: IConfirm;
  active: boolean;
  persistence?: number;
  dismissable?: boolean;
  transparent?: boolean;
  onClick?: (e: any) => void;
  zIndex?: number | string;
  noScroll?: boolean;
  children?: any;
};

const INotificationContext = createContext<[INotification, (Notification: INotification) => any]>([{ active: false }, () => {}]);

export const useNotification = () => useContext(INotificationContext);

type INotificationProvider = {
  children: React.ReactNode;
};

export const NotificationProvider: React.FC<INotificationProvider> = ({ children }) => {
  const notificationState = useState<INotification>({ active: false });

  return (
    <INotificationContext.Provider value={notificationState}>
      <Notification />
      {children}
    </INotificationContext.Provider>
  );
};

const Notification: React.FC = () => {
  const [context, setContext] = useContext(INotificationContext);
  const [notification, setNotification] = useState<INotification | null>(null);
  const [show, setShow] = useState<boolean>(true);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      setContext({ ...context, active: false });
    }, context?.persistence || 2000);
  };

  const handleBodyScroll = useCallback(() => {
    const body = document.getElementById("app-body");
    if (context?.noScroll) {
      body?.classList.toggle(NO_SCROLL);
    }
  }, [context]);

  const handleNotification = () => {
    if (context?.dismissable === undefined) context.dismissable = true;
    if (context?.persistence) {
      setTimeout(() => handleClose(), context.persistence);
    }
    setNotification(context);
  };

  const apiErrors = notification?.apiError;
  const list = notification?.list;

  const handleClick = (e: any) => {
    context?.onClick && context.onClick(e);
  };

  useEffect(() => {
    handleNotification();
    handleBodyScroll();
  }, [handleNotification]);

  const renderApiErrorDetail = () => {
    if (!apiErrors?.detail) return null;

    const { detail } = apiErrors;

    if (Array.isArray(detail?.fields)) {
      return (
        <div className="notification__field-errors">
          {detail.fields.map((f: any, idx: number) => (
            <div key={idx}>
              {f.name}: {f.error}
            </div>
          ))}
        </div>
      );
    }

    if (typeof detail === "string") {
      return <div className="notification__field-errors">{detail}</div>;
    }

    if (typeof detail === "object") {
      return (
        <div className="notification__field-errors">
          {Object.entries(detail).map(([key, value], idx) => (
            <div key={idx}>
              {key}: {JSON.stringify(value)}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  if (!notification?.active) return null;

  return (
    <>
      <style jsx>{styles}</style>
      <div
        id="app-notification"
        style={notification?.zIndex ? { zIndex: `${notification.zIndex}` } : {}}
        onClick={handleClick}
        className={`notification ${!show ? "notification-hide" : ""}`}
      >
        <div className="notification__content">
          {notification.dismissable && (
            <div className="notification__close">
              <UiIcon icon="fa-xmark" onClick={handleClose} />
            </div>
          )}

          {notification?.confirm?.title || notification?.children}

          {Array.isArray(notification?.confirm?.statements) &&
            notification.confirm.statements.length > 0 && (
              <div
                className={`notification__confirm ${
                  notification.confirm.statements.length > 2 ? "notification__confirm-col" : ""
                }`}
              >
                {notification.confirm.statements.map((statement: any, key: number) => (
                  <div key={key} className="notification__confirm-btn">
                    <UiButton
                      onClick={statement?.onClick}
                      variant={statement.text === "yes" ? "primary" : statement?.variant}
                    >
                      {statement.text || statement.label}
                    </UiButton>
                  </div>
                ))}
              </div>
            )}

          {apiErrors && (
            <div className="notification__api-errors">
              <div className="error-message">{apiErrors.message}</div>
              <div className="error-detail">{renderApiErrorDetail()}</div>
            </div>
          )}

          {list && (
            <div className="notification__list">
              {Object.entries(list).map(([_, value], index) => (
                <a
                  key={index}
                  className="notification__list-item"
                  href={value.href}
                  onClick={value.onClick}
                >
                  <div className="notification__list-item__label">
                    <UiMarkdown text={String(value.label ?? value.name ?? "")} />
                  </div>
                  <div>
                    <UiMarkdown text={String(value.message ?? "")} />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notification;
