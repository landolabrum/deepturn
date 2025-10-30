// ContactForm.tsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './ContactForm.scss';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import { fieldType, findField } from '@webstack/components/UiForm/functions/formFieldFunctions';
// import useWindow from '@webstack/hooks/window/useWindow'; // ❌ no longer needed
import validateField from '@webstack/components/UiForm/functions/validateField';
import useSessionStorage from '@webstack/hooks/storage/useSessionStorage';
import environment from '~/src/core/environment';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';

interface IContactFormProps {
  submit?: { text?: string };
  onSubmit: (contactData: any) => void;
  user?: any;
  fieldErrors?: any;
  onChange?: (e: any) => void;
  title?: string | React.ReactElement | boolean;
  fields?: IFormField[];
  sessionKey?: string;
  btn?: React.ReactElement; // optional launcher button
}

const ContactForm: React.FC<IContactFormProps> = (props) => {
  const { btn, ...rest } = props;

  // ✅ Hooks must be called unconditionally and in the same order:
  const { openModal } = useModal();
  const formRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState<number>(0);
  const { sessionData, setSessionItem } = useSessionStorage();

  // Derived (non-hook) values
  const merchantName =
    (environment?.merchant?.name && keyStringConverter(environment.merchant.name, { textTransform: 'capitalize' })) ||
    'Nirvana Energy';

  const {
    onSubmit,
    user,
    onChange,
    submit,
    title = undefined,
    fieldErrors,
    fields: propFields,
    sessionKey = 'contactFormFields',
  } = rest;

  // Observe parent width (instead of window)
  useEffect(() => {
    if (!formRef.current) return;
    const parent = formRef.current.parentElement;
    if (!parent) return;

    // Initialize with current size
    const rect = parent.getBoundingClientRect();
    setParentWidth(rect.width);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) setParentWidth(entry.contentRect.width);
      }
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  const getWidth = (): string => (parentWidth >= 900 ? '50%' : '100%');
  const width = getWidth();

  const defaultContactFields: IFormField[] = [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'e.g. Herbie Hancock', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'e.g. your@email.com', required: true, width },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: 'e.g. 1 (000) 000-0000', required: false, width },
    { name: 'address', label: 'address', type: 'address', required: true },
    {
      name: 'agree',
      type: 'checkbox',
      label: 'Agree',
      required: true,
      msg: `By submitting this form you consent to receive SMS/text messages from ${merchantName}, at the number you provided. Messages may be sent by autodialer. Consent is not a condition of purchase. Message frequency varies (up to 2 msgs/mo). Message & data rates may apply.`,
      width: '100%',
    },
  ];

  const sessionFields = sessionData?.[sessionKey]?.fields as IFormField[] | undefined;
  const initialFields = sessionFields || propFields || defaultContactFields;

  const [fields, setFields] = useState<IFormField[]>(initialFields);
  const [disabled, setDisabled] = useState<boolean>(true);

  // Keep field list in sync when propFields arrives/changes
  useEffect(() => {
    if (propFields?.length) {
      setFields(propFields);
      handleDisabled(propFields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propFields]);

  const handleDisabled = (updatedFields: IFormField[]) => {
    const isFormComplete = updatedFields.every((f) => !f.required || (f.value && !f.error));
    setDisabled(!isFormComplete);
  };

  const errorColor = 'var(--orange-50)';

  const validater = (field: any): IFormField => {
    let text = findField(fields, field.name)?.name || '* ';
    if (field.required && typeof text === 'string' && !text.trim().startsWith('*')) text = `* ${text}`;

    const error =
      field.required && !field.value ? validateField('required', field.value) : validateField(field.name, field.value);

    const color = error ? errorColor : undefined;
    return { ...field, label: { text: error ? `${text} *${error}*` : text, color }, error };
  };

// 1) Handle checkboxes correctly
const handleChange = (e: any) => {
  const { name, type } = e.target;
  const value = type === 'checkbox' ? !!e.target.checked : e.target.value;

  setFields(prev => {
    const updated = prev.map((f: IFormField) =>
      f.name === name ? validater({ ...f, value }) : f
    );

    handleDisabled(updated);
    setSessionItem(sessionKey, { fields: updated });
    return updated;
  });

  onChange?.(e);
};


// 3) Be defensive with submit
const handleFormSubmit = (e?: any) => {
  e?.preventDefault?.();
  if (disabled) return;

  const formData = fields.reduce((acc: any, field: IFormField) => {
    if (['line1', 'line2', 'city', 'state', 'postal_code'].includes(field.name)) {
      acc.address = { ...acc.address, [field.name]: field.value };
    } else {
      acc[field.name] = field.value;
    }
    return acc;
  }, {});

  onSubmit?.(formData);
};


  // Normalize from `user`
  useEffect(() => {
    if (!user) return;

    // Build from defaults to avoid depending on `fields` here (prevents missing-deps warning)
    const base = propFields?.length ? propFields : defaultContactFields;

    const nextFromUserArray = Array.isArray(user)
      ? base.map((f) => {
          const uf = user.find((u: any) => u.name === f.name);
          const addr = user.find((u: any) => u.name === 'address')?.v;
          if (['line1', 'line2', 'city', 'state', 'postal_code'].includes(f.name) && typeof addr === 'object') {
            return { ...f, value: addr?.[f.name] ?? '' };
          }
          return uf ? { ...f, value: uf.v } : f;
        })
      : base;

    const nextFromUserObject =
      !Array.isArray(user) && user
        ? base.map((f) => {
            if (['name', 'email', 'phone', 'address'].includes(f.name) && user[f.name] != null) {
              return { ...f, value: user[f.name] };
            }
            return f;
          })
        : nextFromUserArray;

    setFields(nextFromUserObject);
    setSessionItem(sessionKey, { fields: nextFromUserObject });
    handleDisabled(nextFromUserObject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Apply fieldErrors without depending on `fields`
  useEffect(() => {
    if (!fieldErrors) return;
    setFields((prev) =>
      prev.map((f: IFormField) => {
        const err = findField(fieldErrors, f.name);
        return err ? { ...f, error: err.error } : f;
      }),
    );
  }, [fieldErrors]);

  // React to parent width changes
  useEffect(() => {
    const newWidth = getWidth();
    setFields((prev) =>
      prev.map((f) => ({
        ...f,
        width: f.name !== 'name' ? newWidth : f.width,
      })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentWidth]);

  // --- Render branch AFTER hooks are set up ---
  if (btn) {
    const modalTitle = typeof props.title !== "boolean" && props.title ? props.title : "contact us";
    const handleOpen = () =>
      openModal({
        title: modalTitle,
        children: (
          // Render the same component *without* the launcher to avoid recursion loop
          <ContactForm {...rest}  />
        ),
      });

    const launchBtn = React.cloneElement(btn, {
      onClick: (e: any) => {
        btn.props?.onClick?.(e);
        handleOpen();
      },
    });

    return (
      <>
        <style jsx>{styles}</style>
        <div ref={formRef} className="contact-form">
          {launchBtn}
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx>{styles}</style>
      <div ref={formRef} className="contact-form">
        {title && <div className="contact-form__title">{title}</div>}
        {fieldErrors && (
          <ul>
            {Object.entries(fieldErrors).map(([index, field]: any) => (
              <li key={index}>
                <strong>{field?.name}: </strong>
                {field?.error}
              </li>
            ))}
          </ul>
        )}
<UiForm
  fields={fields}
  disabled={disabled}
  onChange={handleChange}
  onSubmit={handleFormSubmit}   // <-- was console.log
  submitText={submit?.text}
/>
      </div>
    </>
  );
};

export default ContactForm;
