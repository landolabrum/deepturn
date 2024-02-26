import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import GuestCheckoutForm from "../views/GuestCheckoutForm";
interface IStripePaymentForm {
    clientSecret: string;
    success_url?: string;
    onSuccess:(e:any)=>void;
}
const stripeKey:string = String(process.env.NEXT_PUBLIC_STRIPE_API_KEY?.trim())

const stripePromise = loadStripe(stripeKey);


const GuestCheckout = ({ clientSecret, onSuccess, success_url }:IStripePaymentForm) => {


    const appearance = {
        theme: 'night' as 'stripe',
        variables: {
          colorPrimary: '#1e88e5',
          colorBackground: '#262626',
          colorText: '#e0e0e0',
        },
      };
    if(clientSecret)return (
      <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
        <GuestCheckoutForm 
          clientSecret={clientSecret}
          onSuccess={onSuccess}
          success_url="/success"
        />

      </Elements>
    );
    return <>... load</>
  };
export default GuestCheckout;