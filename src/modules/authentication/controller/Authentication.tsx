import { useEffect, useState } from "react";
import SignInView from "../views/SignIn/views/SignInView/SignInView";
import styles from "./Authentication.scss";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import SignUp from "../views/SignUp/SignUp";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { useRouter } from "next/router";
import UiButton from "@webstack/components/UiButton/UiButton";
import Link from "next/link";
import environment from "~/src/environment";
import { useModal } from "@webstack/components/modal/contexts/modalContext";
import { useNotification } from "@webstack/components/Notification/Notification";



const Authentication: React.FC<any> = (props: any) => {
  const [newCustomerEmail, setNewCustomerEmail] = useState<string | undefined>();
  const [view, setView] = useState<string>(props?.view || "sign-in");
  const [hover, setHover] = useState<boolean>(false);
  const router = useRouter();
  const query = router.query;
  const { openModal, closeModal } = useModal();

  const handleView = () => {
    switch (view) {
      case "sign-in":
        setView("sign-up")
        break;
      case "sign-up":
        setView("sign-in")
        break;
      case "customer-created":
        setView("sign-in")
        break;
      case "existing":
        setView("sign-in")
        break;
      default:
        setView("sign-up")
    }
  }
  const handleSignup = (response:any)=>{
    if(response?.status == 'existing'){
      setNotification({active: true, list:[{'label':`email: ${response.email}, exists. Sign in to continue`,
      
    }]})
    }
    setView('sign-in');
    setNewCustomerEmail(response.email)
  }
  const handleSignIn = (response:any)=>{
    if(response?.id){
      openModal({ confirm: {
        title: `Welcome, ${response?.name}`,
        statements: [
          { label: 'go to account', onClick: ()=>router.push('/profile') },
          { label: 'close', onClick: closeModal }
        ]
      }})
    }
    console.log('[ handleSignIn ]: ', response)
  }
const [notif,setNotification]=useNotification();
  useEffect(() => {
    //  if(router.pathname == '/'){setNotification({
    //    active: true,
    //    dismissable: false,
    //    confirm:{
    //     title:"We use cookies to give you the best experience and to ensure the safety of our users. The only non-essential cookies we use are for any personal referrals you make. We do not track you across other sites. You can see our Cookie Policy here, and our Privacy Notice here.",
    //     statements:[
    //       {text:'Customize selection'},
    //       {text:'accept all'},
    //     ]
    //   }

    //  })}else{setNotification({active: false})}
    if (query && query.verify){
      setView('verify');
      console.log('[router]',router)
    }

    if (newCustomerEmail != undefined) setView("sign-in");
  }, [handleSignup, handleSignIn, setView])

  return (
    <>
      <style jsx>{styles}</style>
      <div className={`authentication ${view == 'sign-in' ? ' authentication__sign-in' : ''}`}>
        <div className='authentication__view-header'>
          <div className="authentication__logo">
            <UiIcon icon={`${environment.merchant.name}-logo`} />
          </div>
          <div className='authentication__view-name'>
            {keyStringConverter(view)}
          </div>
        </div>
        {view.includes("@") && <div className='authentication__email-verify'>
          An email has been sent to
          <Link onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={hover?{color:'var(--primary'}:undefined} href={`mailto://${view}`}>{' '+view+', '}</Link> click the link in the email to continue.
        </div>}
        {view == 'sign-in' && <SignInView email={newCustomerEmail} onSuccess={handleSignIn}/>}
        {view == 'sign-up' && <SignUp onSuccess={handleSignup} />}
        <div className="authentication__view-action">
          <div className="authentication__view-label">
            {view == 'sign-in' && "no account?"}
            {view == 'sign-up' && "already have an account?"}
          </div>

          <UiButton
            onClick={handleView}
            variant="link"
          >
            {view == 'sign-in' && "Sign Up"}
            {view == 'sign-up' && "Login"}
          </UiButton>
        </div>
      </div>
    </>
  );
};

export default Authentication;