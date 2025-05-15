// Relative Path: ./JoinRegister.tsx
import React, { useCallback, useEffect, useState } from 'react';
import styles from './JoinForms.scss';
import ContactForm from '@shared/components/ContactForm/ContactForm';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import environment from '~/src/core/environment';

import { useUser } from '~/src/core/authentication/hooks/useUser';
import { useLoader } from '@webstack/components/Loader/Loader';
import { findField } from '@webstack/components/UiForm/functions/formFieldFunctions';
import useScrollTo from '@webstack/components/AdapTable/hooks/useScrollTo';
import { useGuest } from '~/src/core/authentication/hooks/useGuest';
import useProductBuildForm from '~/src/modules/ecommerce/Products/components/ProductBuild/functions/useProductBuildForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import useWindow from '@webstack/hooks/window/useWindow';

interface JoinRegisterProps {
  openModal: (config: any) => void;
}

const JoinRegister = ({ openModal }:JoinRegisterProps) => {
  const windowSize = useWindow();

  const getWidth = (): string => windowSize.width >= 900 ? "50%" : "100%";
  const width = getWidth();

    const contactFields: IFormField[] = [
      { name: 'name', label: "name", type: 'text', placeholder: 'Herbie Hancock', required: true },
      { name: 'email', label: 'email', type: 'email', placeholder: 'your@email.com', required: true, width },
      { name: 'phone', value: '1 (435) 200 - 3006', label: 'phone', type: 'tel', placeholder: '1 (000) 000-0000', required: true, width },
      { name: 'agree', type: 'checkbox', msg: 'By submitting this form you consent to receive SMS/text messages from Nirvana Energy at the number you provided. Messages may be sent by autodialer. Consent is not a condition of purchase. Message frequency varies (up to 2 msgs/mo). Message & data rates may apply. ', required: true, width: "100%" },
      // { name: 'line1', label: 'Address Line 1', type: 'text', placeholder: '123 Main St', required: true, width },
      // { name: 'line2', label: 'Address Line 2', type: 'text', placeholder: 'Apt, Suite, etc.', required: false, width },
      // { name: 'city', label: 'City', type: 'text', placeholder: 'Los Angeles', required: true, width },
      // { name: 'state', label: 'State', type: 'text', placeholder: 'CA', required: true, width },
      // { name: 'postal_code', label: 'Postal Code', type: 'text', placeholder: '90001', required: true, width },
    ];
  const guest = useGuest();
  const user = useUser();
  const { fields, setField, onSubmit, request, clearForm, fieldErrors } = useProductBuildForm();
  const [loading, setLoading] = useLoader();
  const { scrollTo, setScrollTo } = useScrollTo({ scrollToTop: true });

  const [view, setView] = useState<string | undefined>();
  const [lastView, setLastView] = useState<string | undefined>();

  const views: Record<string, React.ReactNode> = {
    join: (<>
      <ContactForm
        submit={{ text: `Join ${keyStringConverter(environment.merchant.name)}` }}
        fieldErrors={fieldErrors}
        title="Get In Touch"
        onChange={(e: any) => handleForm(e, 'user')}
        onSubmit={console.log} // Replace with handleSubmit if needed
        user={user}
        fields={contactFields}
        />
        </>
    ),
  };

  const firstView = Object.keys(views)[0];

  useEffect(() => {
    if (!view) {
      setView(firstView);
    }
  }, [view, firstView]);

  useEffect(() => {
    if (view) {
      setLastView(view);
    }
  }, [view]);

  const handleView = (newView?: string) => {
    setScrollTo('product-build');

    if (guest) {
      return openModal({
        dismissable: false,
        confirm: {
          title: `Success! Go check ${guest.email}`,
          statements: [
            {
              label: 'Continue',
              onClick: () => {
                clearForm();
                setView('usage');
              },
            },
          ],
        },
      });
    } else if (request?.length) {
      return openModal({
        dismissable: false,
        confirm: {
          title: 'Continue where you left off?',
          statements: [
            { label: 'Continue', onClick: () => setView('build') },
            { label: 'Restart', onClick: clearForm },
          ],
        },
      });
    }

    const navViews = ['next', 'back'];
    if (newView && !navViews.includes(newView)) {
      setView(newView);
    } else if (newView === 'back') {
      switch (view) {
        case 'build':
          setView(firstView);
          break;
        case 'contact':
          setView('build');
          break;
        default:
          break;
      }
    } else if (newView === 'next') {
      if (view === firstView) {
        setView('build');
      }
    }
  };

  const handleForm = useCallback(
    (e: any, requestPath?: string | string[]) => {
      if (!loading?.active) setLoading({ active: true });

      const { name, value, checked, type } = e.target;
      if (!name) return;

      const fieldData = { name, value, checked, type };

      setField(requestPath ? { ...fieldData, path: requestPath } : fieldData);

      const currentChecked = fields ? findField(fields, name) : undefined;
      if (name === 'usage' && value && !currentChecked) {
        handleView('build');
      }

      setLoading({ active: false });
    },
    [fields, setField, loading]
  );

  const currentView = views[view ?? ''];

  return (
    <>
      <style jsx>{styles}</style>
      <div className="join-register">
        <div className="join-register__content">
        {/* <div className="join-register__content--header">
          {view}
        </div> */}
        <div className="join-register__content--body">
        {currentView}
        </div>
        </div>
      </div>
    </>
  );
};

export default JoinRegister;
