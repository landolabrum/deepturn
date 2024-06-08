import styles from "./UserCreateMethod.scss"
import { useUser } from "~/src/core/authentication/hooks/useUser";
import CreateMethodStripeForm from "../views/CreateMethodStripeForm/CreateMethodStripeForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import useSetupIntentSecret from "~/src/core/services/MemberService/hooks/useSetupIntentSecret";
import IAuthenticatedUser from "~/src/models/UserContext";
import { useEffect, useState } from "react";
import { useLoader } from "@webstack/components/Loader/Loader";
import UiLoader from "@webstack/components/UiLoader/view/UiLoader";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import environment from "~/src/core/environment";
interface IStripePaymentForm {
  onSuccess?: (e: any) => void;
  user?: IAuthenticatedUser;
  success_url?: string;
}
const publishableStripeKey: string = String(process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY?.trim())

const stripePromise = loadStripe(publishableStripeKey);


const UserCreateMethod = ({ onSuccess, user, success_url }: IStripePaymentForm) => {
  const clientSecret = useSetupIntentSecret(user);
  const appearance = {
    theme: 'night' as 'stripe',
    variables: {
      colorPrimary: '#1e88e5',
      colorBackground: '#262626',
      colorText: '#e0e0e0',
    },
  };
  useEffect(() => {
  }, [clientSecret, user])
  if (!clientSecret) return <>
    <style jsx>{styles}</style>
    <div className='user-create-methods--loader'>
      <UiIcon icon={`${environment.merchant.name}-logo`} />
      <div>Loading User Methods</div>
    </div>
  </>
  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <CreateMethodStripeForm
        user={user}
        success_url={success_url}
        onSuccess={onSuccess}
      />
    </Elements>
  );
};
export default UserCreateMethod;  