import React, { useEffect, useState } from 'react';
import styles from './VerifyEmail.scss';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import Login from '~/src/modules/authentication/views/Login/controller/Login';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import useDevice from '~/src/core/authentication/hooks/useDevice';
import { useGuest } from '~/src/core/authentication/hooks/useGuest';

interface IVerifyEmail {
  token?: string;
  onSuccess: (e: any) => void;
}

interface IVerifyEmailState {
  status?: string;
  detail?: { detail: string } | string;
  fields?: IFormField[];
  message?: string;
  customer?: any;
}

const VerifyEmail: React.FC<IVerifyEmail> = ({ token, onSuccess }) => {
  const [state, setState] = useState<IVerifyEmailState>({ status: 'verifying_email' });
  const MemberService = getService<IMemberService>('IMemberService');
  const { openModal } = useModal();
  const guest = useGuest();
  const device = useDevice();

  const handleVerify = async () => {
    if (!token) {
      setState({ status: 'no_token_present' });
      return;
    }
    try {
      const verifiedResponse = await MemberService.verifyEmail(String(token));
      // Map server field errors into UiForm fields if present
      const responseFields =
        verifiedResponse?.detail?.fields &&
        Object.values(verifiedResponse?.detail?.fields).map((field: any): IFormField => {
          field.label = field.name;
          field.value = field.message;
          field.error = true;
          delete field.message;
          field.readonly = true;
          return field;
        });

      setState({
        ...verifiedResponse,
        fields: verifiedResponse?.fields || responseFields,
      });
    } catch (e: any) {
      setState({
        status: 'verify_error',
        detail: typeof e?.message === 'string' ? e.message : 'Verification failed.',
      });
    }
  };

  // 🔧 Run verification once (or when token changes) — prevents “spinner overwrite”
  useEffect(() => {
    handleVerify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadingText = (): string => {
    const isString = (e: any) => typeof e === 'string';
    if (isString(state.status)) return keyStringConverter(String(state.status));
    if (isString(state.detail)) return keyStringConverter(String(state.detail));
    if ((state.detail as any)?.detail && isString((state.detail as any).detail))
      return keyStringConverter((state.detail as any).detail);
    return 'Verifying Email';
  };

  const onChange = (e: any) => {
    const { name, value } = e.target;
    const stateFields = state?.fields || [];
    const iter = (n: string) => stateFields.find((f) => f.name === n);
    const pwValue = iter('password')?.value;
    const confirmValue = iter('confirm_password')?.value;

    const updatedFields = stateFields.map((field) => {
      if (field.name !== name) return field;
      const updated = { ...field, value };
      const isP = name === 'password';
      const isC = name === 'confirm_password';
      if ((isC && pwValue !== value && pwValue !== '') || (isP && confirmValue !== value && confirmValue !== '')) {
        updated.error = 'Not Same as Password';
      } else if (updated.error) {
        delete (updated as any).error;
      }
      return updated;
    });
    setState((s) => ({ ...s, fields: updatedFields }));
  };

  const onSubmit = async () => {
    const newPassword = state?.fields?.find((f) => f.name === 'password')?.value;
    if (!newPassword) return;

    const request = { ...(state.customer || {}) };
    request.metadata = request.metadata || {};
    request.metadata.user = request.metadata.user || {};
    request.metadata.user.password = newPassword;
    request.metadata.user.devices = [device];

    try {
      const updateMember = await MemberService.modifyCustomer(request);
      if (updateMember) {
        // ✅ Show success clearly
        setState((s) => ({
          ...s,
          status: 'verification_success',
          detail: 'Password set. You can now log in.',
          customer: { ...(s.customer || {}), email: updateMember.email },
          fields: undefined, // hide the form
        }));
        onSuccess(updateMember.email);
      }
    } catch (e) {
      setState((s) => ({
        ...s,
        status: 'verify_error',
        detail: 'Could not set password. Please try again.',
      }));
    }
  };

  const handleLoginModal = () => {
    if (!state.customer?.email) return;
    openModal({
      children: <Login email={state.customer.email} onSuccess={(e) => JSON.stringify(e)} />,
    });
  };

  // Show the form only when server indicates the flow is incomplete.
  const isForm = Boolean(state.status && ['418', 418, 'incomplete'].includes(state.status) && state?.fields);

  const isLoading = state?.status === 'verifying_email';

  return (
    <>
      <style jsx>{styles}</style>
      <div className="verify-email">
        <div
          className={`verify-email__content${
            state.status === 'verification_success' ? ' verify-email__content--success' : ''
          }`}
        >
          <div className="verify-email__content--loader">
            <UiLoader position="relative" text={loadingText()} dots={isLoading} />
          </div>

          {isForm && (
            <UiForm
              title={typeof state?.detail === 'string' ? (state.detail as string) : undefined}
              onChange={onChange}
              fields={state.fields}
              onSubmit={typeof state?.detail === 'string' ? onSubmit : undefined}
            />
          )}

          {state.status === 'verification_success' && state.customer?.email && (
            <div className="verify-email__content__sign-in">
              <UiButton onClick={handleLoginModal}>Login</UiButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
