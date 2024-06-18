import styles from "./Collect.scss";
import { useState } from "react";
import CheckoutButton from "../../CheckoutButton/CheckoutButton";
import { ISessionCartItem } from "~/src/core/services/MemberService/IMemberService";
import UserMethods from "~/src/modules/profile/views/UserMethods/controller/UserMethods";
import { IMethod } from "~/src/modules/profile/model/IMethod";
import UiLoader from "@webstack/components/UiLoader/view/UiLoader";
import { useModal } from "@webstack/components/modal/contexts/modalContext";
interface ICollect {
  user?: any;
  cart_items: ISessionCartItem[];
}



const Collect = ({ user, cart_items }: ICollect) => {
  const [method, setMethod] = useState<IMethod | undefined>()
// const {openModal, isModalOpen,closeModal}=useModal();
  const onCreateGuestMethodSuccess = (e?: any) => {
    console.log("[ FINALLY ]", e)
  };
  if(user && user.id)return (<>
    <style jsx>{styles}</style>
    <div className='collect'>
      <div className='collect__checkout-button'>
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
        onSuccess={onCreateGuestMethodSuccess}
        onSelect={setMethod}
      />
      }
    </div>
  </>
  );
  return <><UiLoader/></>

};
export default Collect;