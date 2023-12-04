import { useUser } from "~/src/core/authentication/hooks/useUser";
import AccountCreateMethod from "../AccountCreateMethod/AccountCreateMethod";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
interface IStripePaymentForm {
    clientSecret: string;
    onSuccess:(e:any)=>void;
}
const stripePromise = loadStripe('pk_live_yourPublishableKey');

const StripePaymentForm = ({ clientSecret, onSuccess }:IStripePaymentForm) => {
    const user = useUser();
    const appearance = {
        theme: 'night' as 'stripe',
        variables: {
          colorPrimary: '#1e88e5',
          colorBackground: '#262626',
          colorText: '#e0e0e0',
        },
      };
    return (
      <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
        <AccountCreateMethod
          user={user}
          onSuccess={onSuccess}
        />
      </Elements>
    );
  };
export default StripePaymentForm;  