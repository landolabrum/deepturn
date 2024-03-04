import styles from "./Collect.scss";
import { useState } from "react";
import UserContext from "~/src/models/UserContext";
import CheckoutButton from "../../CheckoutButton/CheckoutButton";
import { ISessionCartItem } from "~/src/core/services/MemberService/IMemberService";
import UserMethods from "~/src/modules/user/views/UserMethods/controller/UserMethods";
import { IMethod } from "~/src/modules/user/model/IMethod";
interface ICollect {
  user?: any;
  cart_items: ISessionCartItem[];
}



const Collect = ({ user, cart_items }: ICollect) => {
  const [method, setMethod] = useState<IMethod | undefined>()

  const onCreateProspectMethodSuccess = (e?: any) => {
    console.log("[ FINALLY ]", e)
  };
  if(user && user.id)return (<>
    <style jsx>{styles}</style>
    <div className='collect'>
      <div className='collect__checkout-button'>
       {/* <div className="dev"> {JSON.stringify(cart_items)}</div> */}
        {method && user && cart_items && (
          <CheckoutButton
            customer_id={user.id}
            cart_items={cart_items}
            method_id={method.id}
            collect
          />
        )}
      </div>
      {user && <UserMethods
        open={false}
        user={user}
        selected={method}
        onSuccess={onCreateProspectMethodSuccess}
        onSelect={setMethod}
      />
      }
    </div>
  </>
  );
  return <>Collect | NO USER ID</>

};
export default Collect;