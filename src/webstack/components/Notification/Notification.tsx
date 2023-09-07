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

interface INotificationListItem{
  label?: string;
  onClick?: (e:any)=>void;
}

export type INotification = {
  list?: INotificationListItem[];
  active: boolean;
  dismissable?: boolean;
  transparent?: boolean;
  onClick?: any;
  zIndex?: number | string;
  noScroll?: boolean;
  children?: any;
};

const INotificationContext = createContext<
  [INotification, (Notification: INotification) => any]
>([{ active: false }, () => {}]);

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
  const [notificationState, setNotificationState] = useState<INotification | null>(null);
  const [show, setShow]=useState<boolean>(true);
  const handleClose = () =>{
    setShow(false);
    setTimeout(() => {
      setContext({active: false})
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
  useEffect(() => {
    if(context?.dismissable == undefined)context.dismissable = true;
    setNotificationState(context);
    handleBodyScroll();
  }, [context, handleBodyScroll]);

  if (notificationState?.active) {
    return (
      <>
        <style jsx>{styles}</style>
        <div
          id="app-notification"
          style={
            notificationState?.zIndex ? { zIndex: `${notificationState?.zIndex}` } : {}
          }
          onClick={context?.onClick}
          className={`notification ${!show?' notification-hide':""}`}
        >
          <div className='notification__content'>
            {notificationState.dismissable && 
              <div className='notification__close'><UiIcon icon='fa-xmark' onClick={handleClose}/></div>
            }
            {notificationState?.children}
          <div className='notification__list'>{
          notificationState.list &&
            Object.entries([{label:'label'}]).map(([field, value])=>{
              return <div key={field} className={`notification__list-item`}>{value.label}</div>
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
