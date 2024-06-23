import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import styles from "./Notification.scss";
import { UiIcon } from "../UiIcon/UiIcon";
import UiMarkdown from "../UiMarkDown/UiMarkDown";
import { IConfirm } from "../modal/contexts/modalContext";
import UiButton from "../UiButton/UiButton";

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
  detail: string;
  error:boolean;
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

const INotificationContext = createContext<[INotification, (Notification: INotification) => any]>([{ active: false }, () => { }]);

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
  const [context, setContext] = useContext<[INotification, (Notification: INotification) => any]>(INotificationContext);
  const [notification, setNotification] = useState<INotification | null>(null);
  const [show, setShow] = useState<boolean>(true);

  const handleClose = () => {
    setShow(false);
    if (context?.persistence) {
      setTimeout(() => {
        setContext({ ...context, active: false });
      }, 20000); // 20 seconds
    } else {
      setTimeout(() => {
        setContext({ active: false });
      }, 2000); // Default 2 seconds
    }
  };

  const handleBodyScroll = useCallback(() => {
    const body = document.getElementById("app-body");
    if (context?.noScroll) {
      if (body?.classList.contains(NO_SCROLL)) {
        body?.classList.remove(NO_SCROLL);
      } else {
        body?.classList.add(NO_SCROLL);
      }
    }
  }, [context]);

  const list = notification?.list;
  const apiErrors:INotificationApiError | undefined = notification?.apiError;
  const handleNotification = () => {
    if (context?.dismissable === undefined) context.dismissable = true;
    if (context?.persistence) {
      setTimeout(() => {
        handleClose();
      }, context.persistence);
    }
    setNotification(context);
  };
const handleClick = (e:any)=>{
  context.onClick && context.onClick(e)
}
  useEffect(() => {
    handleNotification();
    handleBodyScroll();
  }, [handleNotification]);

  if (notification?.active) {
    return (
      <>
        <style jsx>{styles}</style>
        {/* <div className='dev'>
                  {JSON.stringify(apiErrors)}
                </div> */}
        <div
          id="app-notification"
          style={notification?.zIndex ? { zIndex: `${notification?.zIndex}` } : {}}
          onClick={context?.onClick}
          className={`notification ${!show ? ' notification-hide' : ""}`}
        >
          <div className='notification__content'>
            {notification.dismissable &&
              <div className='notification__close'><UiIcon icon='fa-xmark' onClick={handleClose} /></div>
            }
            {notification?.confirm?.title || notification?.children}
            {notification?.confirm?.statements &&  notification.confirm.statements.length &&
              <div className={`notification__confirm ${notification.confirm.statements.length > 2 ?" notification__confirm-col":""}`}>
                {notification.confirm.statements.map((statement: any, key: number) => {
                  return (
                    <div key={key} className='notification__confirm-btn'>
                      <UiButton onClick={statement?.onClick} variant={statement.text === 'yes' ? 'primary' : statement?.variant}>
                        {statement.text || statement.label} 
                      </UiButton>
                    </div>
                  );
                })}
              </div>
            }
            
            { apiErrors && <div className='notification__api-errors'>
                <div className='error-message'>
                  {apiErrors?.message}
                </div>
                <div className='error-detail'>
                  {apiErrors?.detail && Object.entries(apiErrors.detail).map(([d,i])=><div key={d}>{i}</div>)}
                </div>
              </div>
            }
            {
              list && <div className='notification__list'>
                {Object.entries(list).map(([field, value]: any, index: number) => {
                  return <a key={index} className={`notification__list-item`} href={value.href} onClick={value.onClick}>
                    <div  className='notification__list-item__label' >
                      <UiMarkdown text={value.label || value?.name} />{JSON.stringify(value?.onClick)}
                    </div>
                    <div>
                      <UiMarkdown text={value.message} />
                    </div>
                  </a>
                })}
              </div>

            }
          </div>
        </div>
      </>
    );
  }
  return <></>;
};

export default Notification;
