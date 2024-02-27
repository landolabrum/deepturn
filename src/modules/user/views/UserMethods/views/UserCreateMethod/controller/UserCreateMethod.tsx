import { useUser } from "~/src/core/authentication/hooks/useUser";
import CreateMethodStripeForm from "../views/CreateMethodStripeForm/CreateMethodStripeForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import useSetupIntentSecret from "~/src/core/services/CustomerService/hooks/useSetupIntentSecret";
import UserContext from "~/src/models/UserContext";
import { useEffect, useState } from "react";
interface IStripePaymentForm {
  onSuccess: (e: any) => void;
  user?: UserContext;
  success_url?: string;
}
const stripeKey: string = String(process.env.NEXT_PUBLIC_STRIPE_API_KEY?.trim())

const stripePromise = loadStripe(stripeKey);


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
  useEffect(()=>{},[clientSecret, user])
  if (clientSecret) return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <CreateMethodStripeForm
        user={user}
        success_url={success_url}
        onSuccess={onSuccess}
      />
    </Elements>
  );
  return <>... load</>
};
export default UserCreateMethod;  