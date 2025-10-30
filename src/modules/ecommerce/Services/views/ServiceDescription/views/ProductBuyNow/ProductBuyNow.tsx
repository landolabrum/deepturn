import React, { useEffect, useMemo, useState } from 'react';
import styles from './ProductBuyNow.scss';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import UiPill from '@webstack/components/UiForm/components/UiPill/UiPill';
import { numberToUsd } from '@webstack/helpers/userExperienceFormats';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import useCart from '~/src/modules/ecommerce/cart/hooks/useCart';
import { ITraits } from '@webstack/components/UiForm/components/FormControl/FormControl';
import { IProduct } from '~/src/models/Shopping/IProduct';
import ContactForm from '@shared/components/Contact/forms/ContactForm/ContactForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import environment from '~/src/core/environment';
import ContactUs from '@shared/components/Contact/forms/ContactUs/ContactUs';

export interface IProductBuyNow {
  product?: IProduct;
  traits?: ITraits;
  btnText?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  goToCart?: boolean;
  variant?: string;
}

const ProductBuyNow: React.FC<IProductBuyNow> = ({
  product,
  variant,
  traits,
  size,
  btnText,
  goToCart = false,
}) => {
  // Hooks MUST be first, always run, never behind a conditional
  const { addCartItem, cart } = useCart();
  const { openModal, closeModal, replaceModal } = useModal();

  // Price label
  const [label, setLabel] = useState<string>('add');

  useEffect(() => {
    if (!product) {
      setLabel('add');
      return;
    }

    if (!btnText && !product?.metadata?.hide_price) {
      setLabel(
        product.price?.unit_amount
          ? `${numberToUsd(product.price?.unit_amount)}${
              product.price?.recurring?.interval ? ' / ' + product.price?.recurring?.interval : ''
            }`
          : '-'
      );
    } else {
      setLabel(!product?.active ? 'unavailable' : btnText || String(product.price?.unit_amount_decimal ?? ''));
    }
  }, [product, btnText]);

  // Derived state from cart/product (safe even if product is undefined)
  const isDisabled = !product?.active || !product?.price?.id;
  const cookieProduct: any = product ? cart?.find((item: any) => item?.price?.id === product.price?.id) : null;
  const qty = cookieProduct?.price?.qty || 0;

  // Contact form fields
  const merchantName = environment.merchant.name;
  const fields: IFormField[] = useMemo(
    () => [
      { name: 'name', label: 'Name', type: 'text', placeholder: 'e.g. Herbie Hancock', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'e.g. your@email.com', required: true },
      { name: 'phone', label: 'Phone', type: 'tel', placeholder: 'e.g. 1 (000) 000-0000' },
      { name: 'address', label: 'address', type: 'address', required: true },
      {
        name: 'agree',
        type: 'checkbox',
        label: 'Agree',
        required: true,
        msg: `By submitting this form you consent to receive SMS/text messages from ${merchantName}, at the number you provided. Messages may be sent by autodialer. Consent is not a condition of purchase. Message frequency varies (up to 2 msgs/mo). Message & data rates may apply.`,
        width: '100%',
      },
      { name: 'services', label: 'services needed', type: 'text', required: true },
    ],
    [merchantName]
  );

  // Modal builders
  const buildSuccessModal = () => ({
    title: 'Request sent',
    children: (
      <div style={{ padding: 16 }}>
        Thanks! We’ve received your request and will be in touch shortly.
      </div>
    ),
    confirm: {
      statements: [{ label: 'Close', onClick: () => closeModal() }],
    },
  });

  const handleSubmit = (form: any) => {
    // TODO: backend integration
    // console.log({ form });
    replaceModal(buildSuccessModal());
  };

  const buildContactFormModal = () => ({
    title: 'Contact us',
    children: (
      <ContactForm
        fields={fields}
        onSubmit={handleSubmit}
        submit={{ text: 'Send' }}
        title={false}
      />
    ),
    confirm: {
      statements: [{ label: 'Close', onClick: () => closeModal() }],
    },
  });

  const handleCart = (newQty?: number) => {
    if (!product) return; // safety
    addCartItem({ ...product, price: { ...product.price, qty: Number(newQty) } });

    if (goToCart && newQty) {
      openModal({
        title: `${product.name}, added to cart`,
        confirm: {
          statements: [
            { label: 'go to cart', href: '/cart' },
            { label: 'back', onClick: () => closeModal() },
          ],
        },
      });
    }
  };

  const openZeroPriceFlow = () => {
    openModal({
      title: 'Contact us',
      children: <ContactUs />,
      confirm: {
        statements: [
          {
            label: 'submit request',
            variant: 'primary',
            // keep modal open and swap to contact form
            closeOnClick: false,
            replace: buildContactFormModal(),
          },
          { label: 'Close', onClick: () => closeModal() },
        ],
      },
    });
  };

  // Render (no early returns before hooks)
  return (
    <>
      <style jsx>{styles}</style>

      {!product ? (
        <>No Product</>
      ) : product.price?.unit_amount === 0 ? (
        <UiButton
          onClick={openZeroPriceFlow}
          traits={{ beforeIcon: 'fa-handshake', ...traits }}
          disabled={!product?.active}
          size={size}
          variant={variant || 'primary'}
        >
          Get Quote
        </UiButton>
      ) : qty === 0 ? (
        <UiButton
          onClick={() => handleCart(1 + Number(qty))}
          traits={{ beforeIcon: 'fas-cart-shopping-fast', ...traits }}
          disabled={isDisabled}
          size={size}
          variant={variant || 'primary'}
          busy={!Boolean(product.price?.unit_amount) || undefined}
        >
          {label}
        </UiButton>
      ) : (
        <UiPill
          traits={traits}
          variant="center dark"
          amount={qty}
          setAmount={(newQty) => handleCart(newQty)}
        />
      )}
    </>
  );
};

export default ProductBuyNow;
