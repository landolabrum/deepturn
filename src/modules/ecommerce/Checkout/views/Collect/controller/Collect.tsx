import styles from "./Collect.scss";
import { useState } from "react";
import UserContext from "~/src/models/UserContext";
import CheckoutButton from "../../CheckoutButton/CheckoutButton";
import { ISessionCartItem } from "~/src/core/services/MemberService/IMemberService";
import UserMethods from "~/src/modules/user/views/UserMethods/controller/UserMethods";
import { IMethod } from "~/src/modules/user/model/IMethod";
interface ICollect {
  user?: UserContext;
  cart_items: ISessionCartItem[];
}



const Collect = ({ user, cart_items }: ICollect) => {
  const [method, setMethod] = useState<IMethod | undefined>()

  const onCreateProspectMethodSuccess = (e?: any) => {
    console.log("[ FINALLY ]", e)
  };
  return (<>
    <style jsx>{styles}</style>
    <div className='collect'>
      <div className='collect__checkout-button'>
       <div className="dev"> {JSON.stringify(cart_items)}</div>
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

};
export default Collect;