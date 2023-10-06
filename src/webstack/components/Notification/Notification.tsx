import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import styles from "./Notification.scss";
import { UiIcon } from "../UiIcon/UiIcon";
const NO_SCROLL = "no-scroll";

interface INotificationListItem {
  label?: string;
  name?: string;
  message?: string;
  onClick?: (e: any) => void;
  href?: string;
}

export type INotification = {
  list?: INotificationListItem[];
  active: boolean;
  persistance?: number;
  dismissable?: boolean;
  transparent?: boolean;
  onClick?: any;
  zIndex?: number | string;
  noScroll?: boolean;
  children?: any;
};

const INotificationContext = createContext<
  [INotification, (Notification: INotification) => any]
>([{ active: false }, () => { }]);

export const useNotification = () => useContext(INotificationContext);
type INotificationProvider = {
  children: React.ReactNode;
};
export const NotificationProvider: React.FC<INotificationProvider> = ({
  children,
}) => {
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
    setTimeout(() => {
      setContext({ active: false })
    }, 2000);
  }

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
  useEffect(() => {
    // handle Dismissable
    if (context?.dismissable == undefined) context.dismissable = true;
    if (context?.persistance) {
      setTimeout(() => {
        setShow(false);
      }, context.persistance);
    }
    setNotification(context);
    handleBodyScroll();
  }, [context, handleBodyScroll]);

  if (notification?.active) {
    return (
      <>
        <style jsx>{styles}</style>
        <div
          id="app-notification"
          style={
            notification?.zIndex ? { zIndex: `${notification?.zIndex}` } : {}
          }
          onClick={context?.onClick}
          className={`notification ${!show ? ' notification-hide' : ""}`}
        >
          <div className='notification__content'>
            {notification.dismissable &&
              <div className='notification__close'><UiIcon icon='fa-xmark' onClick={handleClose} /></div>
            }
            {notification?.children}
            <div className='notification__list'>{
              list &&
              Object.entries(list).map(([field, value]: any) => {
                return <span key={field}>
                  <a className={`notification__list-item`} href={value.href} onClick={value.onClick}>
                  <div className='notification__list-item__label' >
                    {value.label || value?.name}
                  </div>
                  <div>
                    {value.message}
                  </div>
                </a>
                </span>
              })
            }
            </div>
          </div>
        </div>
      </>
    );
  }
  return <></>;
};

export default Notification;
