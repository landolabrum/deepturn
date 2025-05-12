// Relative Path: ./Transaction.tsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './Transaction.scss';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import CookieHelper from '@webstack/helpers/CookieHelper';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { dateFormat, numberToUsd } from '@webstack/helpers/userExperienceFormats';
import IAuthenticatedUser from "~/src/models/ICustomer";
import { useUser } from '~/src/core/authentication/hooks/useUser';
import { useGuest } from '~/src/core/authentication/hooks/useGuest';
import CreatePDF from '@webstack/components/CreatePDF/controller/CreatePDF';

// Remember to create a sibling SCSS file with the same name as this component
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();

const Transaction: React.FC = () => {
  const user = useUser();
const pdfRef:any = useRef();
  const MemberService = getService<IMemberService>('IMemberService');
  const [selectedUser, setUser] = useState<IAuthenticatedUser | { email: string } | undefined>();
  const [transaction, setTransaction] = useState<any>();
  const guest = useGuest();

  const loadTransaction = () => {
    if (transaction) return;
    setTransaction({
      "total": 4267,
      "data": {
        "id": "pi_3Q6RUlIodeKZRLDV0xQs6B8o",
        "object": "payment_intent",
        "amount": 4267,
        "amount_capturable": 0,
        "amount_details": {
          "tip": {}
        },
        "amount_received": 4267,
        "application": null,
        "application_fee_amount": null,
        "automatic_payment_methods": null,
        "canceled_at": null,
        "cancellation_reason": null,
        "capture_method": "automatic",
        "client_secret": "pi_3Q6RUlIodeKZRLDV0xQs6B8o_secret_fgWOUF6KxodHNMskELB7Qda1O",
        "confirmation_method": "manual",
        "created": 1728109779,
        "currency": "usd",
        "customer": "cus_QyOExvcMNKsyAi",
        "description": null,
        "invoice": null,
        "last_payment_error": null,
        "latest_charge": "ch_3Q6RUlIodeKZRLDV0tFGoP4Z",
        "livemode": false,
        "metadata": {},
        "next_action": null,
        "on_behalf_of": null,
        "payment_method": "pm_1Q6RUEIodeKZRLDVsXAcz42z",
        "payment_method_configuration_details": null,
        "payment_method_options": {
          "card": {
            "installments": null,
            "mandate_options": null,
            "network": null,
            "request_three_d_secure": "automatic"
          }
        },
        "payment_method_types": [
          "card"
        ],
        "processing": null,
        "receipt_email": null,
        "review": null,
        "setup_future_usage": null,
        "shipping": null,
        "source": null,
        "statement_descriptor": null,
        "statement_descriptor_suffix": null,
        "status": "succeeded",
        "transfer_data": null,
        "transfer_group": null
      },
      "cart_items": [
        {
          "id": "prod_OjLRt77tfxiSJ2",
          "object": "product",
          "active": true,
          "attributes": [],
          "created": 1696040249,
          "default_price": "price_1NvskHIodeKZRLDVcmvDIz43",
          "description": "Subscription 1 Description 1.",
          "features": [],
          "images": [
            "https://files.stripe.com/links/MDB8YWNjdF8xRzM4SVhJb2RlS1pSTERWfGZsX3Rlc3RfS01ORlBVUzVIeW1CZ004MU1ZeWxnd20400PhULWtTH"
          ],
          "livemode": false,
          "marketing_features": [],
          "metadata": {
            "category": "subscription",
            "mid": "mb1",
            "type": "service"
          },
          "name": "Subscription 1",
          "package_dimensions": null,
          "shippable": null,
          "statement_descriptor": null,
          "tax_code": "txcd_99999999",
          "type": "service",
          "unit_label": null,
          "updated": 1723690560,
          "url": null,
          "price": {
            "id": "price_1PnBebIodeKZRLDVWrNEdBkx",
            "object": "price",
            "active": true,
            "billing_scheme": "per_unit",
            "created": 1723520653,
            "currency": "usd",
            "custom_unit_amount": null,
            "livemode": false,
            "lookup_key": null,
            "metadata": {},
            "nickname": "price description example",
            "product": "prod_OjLRt77tfxiSJ2",
            "recurring": {
              "aggregate_usage": null,
              "interval": "month",
              "interval_count": 1,
              "meter": null,
              "trial_period_days": null,
              "usage_type": "licensed"
            },
            "tax_behavior": "exclusive",
            "tiers_mode": null,
            "transform_quantity": null,
            "type": "recurring",
            "unit_amount": 4267,
            "unit_amount_decimal": "4267",
            "qty": 1
          }
        }
      ]
    })
    // const hasTransaction = CookieHelper.getCookie('transaction-token');
    // const decryptToken = async (token: string) => {
    //   if (token) {
    //     try {
    //       const response = await MemberService.decryptJWT({
    //         token: token,
    //         secret: String(ENCRYPTION_KEY),
    //         algorithm: 'HS256'
    //       });
    //       if (response?.decoded) {
    //         // console.log('[ JWT DECODE (SUCCESS) ]', response.decoded);
    //         setTransaction(response.decoded);
    //       }
    //     } catch (error: any) {
    //       setTransaction({ error: error?.detail?.detail });
    //       console.error('[ JWT DECODE (ERROR) ]', error?.detail?.detail);
    //     }
    //   }
    // };
    // if (hasTransaction) {
    //   CookieHelper.deleteCookie('cart');
    //   decryptToken(hasTransaction);
    // }
  }
  const handleUser = () => {
    if (selectedUser) return;
    if (user || guest) setUser(user || guest);
  };
  useEffect(() => {
    handleUser();
  }, [handleUser, user]);
  useEffect(() => {
    loadTransaction();
  }, [setTransaction, pdfRef?.current]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='transaction'>
        {transaction?.total !== undefined && <div className='transaction__header'>
          <div className='transaction__title'>
            <div className='transaction__title--status'>Purchase Success</div>
          </div>
          {pdfRef?.current && <CreatePDF pdfRef={pdfRef} downloadable name={transaction.data.id}/>}
        </div>}
        <div className='transaction__content' ref={pdfRef}>
        {transaction?.data?.id && 
        <div className='transaction__content--header'>
        <div className='transaction__content--header-title'>
          <div className='transaction--pi'>
            <div>PURCHASE ID</div>
            <div>{transaction.data.id}</div>
          </div>
          </div>
          </div>}
          {transaction?.data?.created && <div className='transaction--date'><div>Purchased</div><div>{dateFormat(transaction.data.created, { isTimestamp: true })}</div></div>}
          {selectedUser && <div className='transaction--email'><div>Email</div><div>{selectedUser?.email}</div></div>} 
          {transaction?.cart_items && <>
            <div className='transaction--list'>
              {Array(transaction?.cart_items).map(
                ([field, value]: any) => {
                  return <div className='transaction__item' key={field.name}>
                    <div className='transaction__item-identity'>
                      <div className='identity-name'>{field.name}</div>
                      <div className='identity-id'>{field.id}</div>
                    </div>
                    <div className='transaction__item-description'>
                      {field.description}
                    </div>
                    <div className='transaction__item-amount'>
                      {numberToUsd(field.price?.unit_amount)}
                    </div>
                  </div>
                })}
            <div className='transaction--total'><div>total</div> <div>{numberToUsd(transaction.total)}</div></div>
            </div>
          </>
          }
          {transaction?.error?.includes("Your card was declined.") && <div className='card transaction__error declined'>
            <div className='transaction__title'>
              Your card was declined
            </div>
            <UiButton href="/cart">return to cart</UiButton>
          </div>}
        </div>
      </div>
      {/* {JSON.stringify(transaction)} */}
    </>
  );
};

export default Transaction;