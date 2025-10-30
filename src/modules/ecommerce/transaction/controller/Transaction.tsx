import React, { useEffect, useRef, useState } from 'react';
import styles from './Transaction.scss';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import CookieHelper from '@webstack/helpers/CookieHelper';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { dateFormat, numberToUsd } from '@webstack/helpers/userExperienceFormats';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import { useGuest } from '~/src/core/authentication/hooks/useGuest';
import CreatePDF from '@webstack/components/CreatePDF/controller/CreatePDF';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION?.trim();

const Transaction: React.FC = () => {
  const user = useUser();
  const guest = useGuest();
  const pdfRef: any = useRef();
  const MemberService = getService<IMemberService>('IMemberService');
  const [selectedUser, setUser] = useState<any>();
  const [transaction, setTransaction] = useState<any>();

  const loadTransaction = () => {
    if (transaction) return;
    const token = localStorage.getItem('transaction-token');

    const decryptToken = async (token: string) => {
      if (!token) return;

      try {
        const response = await MemberService.decryptJWT({
          token,
          secret: String(ENCRYPTION_KEY),
          algorithm: 'HS256',
        });

        if (response?.decoded) {
          setTransaction(response.decoded);

          // Only delete cart if transaction has no known error
          if (!response.decoded?.error) {
            CookieHelper.deleteCookie('cart');
          }
        }
      } catch (error: any) {
        const detail = error?.detail?.detail || 'Unable to decode transaction token.';
        setTransaction({ error: detail });
        console.error('[JWT Decode Error]', detail);
      }
    };

    if (token) {
      decryptToken(token);
    }
  };

  const handleUser = () => {
    if (selectedUser || !transaction?.user) return;

    const tUser = transaction.user;
    const metadataUser = tUser?.metadata?.user ?? {};

    const fullUser = {
      email: tUser?.email || metadataUser?.email,
      name: tUser?.name || metadataUser?.name,
      type: metadataUser?.type,
      clearance: metadataUser?.clearance,
      devices: metadataUser?.devices,
      social: metadataUser?.social,
      server_url: metadataUser?.server_url,
      merchant: tUser?.metadata?.merchant,
    };

    setUser(fullUser);
  };

  useEffect(() => {
    loadTransaction();
  }, []);

  useEffect(() => {
    if (transaction && !selectedUser) handleUser();
  }, [transaction]);

  const showError = transaction?.error;

  return (
    <>
      <style jsx>{styles}</style>
      <div className="transaction">
        {transaction?.total !== undefined && (
          <div className="transaction__header">
            <div className="transaction__title">
              <div className="transaction__title--status">Purchase Success</div>
            </div>
            {pdfRef?.current && (
              <CreatePDF pdfRef={pdfRef} downloadable name={transaction.data?.id} />
            )}
          </div>
        )}

        <div className="transaction__content" ref={pdfRef}>
          {transaction?.data?.id && (
            <div className="transaction__content--header">
              <div className="transaction__content--header-title">
                <div className="transaction--pi">
                  <div>PURCHASE ID</div>
                  <div>{transaction.data.id}</div>
                </div>
              </div>
            </div>
          )}

          {transaction?.data?.created && (
            <div className="transaction--date">
              <div>Purchased</div>
              <div>{dateFormat(transaction.data.created, { isTimestamp: true })}</div>
            </div>
          )}

          {selectedUser?.email && (
            <div className="transaction--email">
              <div>Email</div>
              <div>{selectedUser.email}</div>
            </div>
          )}
          {selectedUser?.name && (
            <div className="transaction--name">
              <div>Name</div>
              <div>{selectedUser.name}</div>
            </div>
          )}
          {selectedUser?.type && (
            <div className="transaction--type">
              <div>User Type</div>
              <div>{selectedUser.type}</div>
            </div>
          )}
          {selectedUser?.clearance !== undefined && (
            <div className="transaction--clearance">
              <div>Clearance</div>
              <div>{selectedUser.clearance}</div>
            </div>
          )}

          {transaction?.cart_items?.length > 0 && (
            <div className="transaction--list">
              {transaction.cart_items.map((item: any, index: number) => (
                <div className="transaction__item" key={index}>
                  <div className="transaction__item-identity">
                    <div className="identity-name">{item.name}</div>
                    <div className="identity-id">{item.id}</div>
                  </div>
                  <div className="transaction__item-description">{item.description}</div>
                  <div className="transaction__item-amount">
                    {numberToUsd(item?.price?.unit_amount)}
                  </div>
                </div>
              ))}
              <div className="transaction--total">
                <div>Total</div>
                <div>{numberToUsd(transaction.total)}</div>
              </div>
            </div>
          )}

          {showError && (
            <div className="card transaction__error declined">
              <div className="transaction__title">
                {showError.includes("card was declined")
                  ? "Your card was declined"
                  : showError}
              </div>
              <UiButton href="/cart">Return to Cart</UiButton>
            </div>
          )}

          {!transaction && <pre className="debug">No transaction loaded</pre>}
        </div>
      </div>
    </>
  );
};

export default Transaction;
