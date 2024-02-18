import { useUser } from "~/src/core/authentication/hooks/useUser";
import UserCreateMethod from "../UserCreateMethod/UserCreateMethod";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
interface IStripePaymentForm {
    clientSecret: string;
    onSuccess:(e:any)=>void;
}
const stripeKey:string = String(process.env.NEXT_PUBLIC_STRIPE_API_KEY?.trim())

const stripePromise = loadStripe(stripeKey);


const UserStripePaymentForm = ({ clientSecret, onSuccess }:IStripePaymentForm) => {
    const user = useUser();
    const appearance = {
        theme: 'night' as 'stripe',
        variables: {
          colorPrimary: '#1e88e5',
          colorBackground: '#262626',
          colorText: '#e0e0e0',
        },
      };
    if(user?.id && clientSecret)return (
      <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
        <UserCreateMethod
          user={user}
          onSuccess={onSuccess}
        />
      </Elements>
    );
    return <>... load</>
  };
export default UserStripePaymentForm;  