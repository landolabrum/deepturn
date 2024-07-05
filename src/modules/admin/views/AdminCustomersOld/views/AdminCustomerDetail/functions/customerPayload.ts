import { ICustomer } from "~/src/models/ICustomer";

export const customerPayload = (forms: any): ICustomer => {
  if (!forms.contact) {
    console.error("No Contact in Admin Customer Form");
    return {};
  }

  const contact = forms.contact.reduce((acc: any, field: any) => {
    acc[field.name] = field.value;
    return acc;
  }, {});

  const invoiceSettings = forms.invoice_settings.reduce((acc: any, field: any) => {
    acc[field.name] = field.value;
    return acc;
  }, {});

  const merchant = forms.merchant.reduce((acc: any, field: any) => {
    acc[field.name] = field.value;
    return acc;
  }, {});

  const user = forms.user.reduce((acc: any, field: any) => {
    acc[field.name] = field.value;
    return acc;
  }, {});

  const devices = Object.keys(forms)
    .filter((key) => key.startsWith('device-'))
    .map((deviceKey) =>
      forms[deviceKey].reduce((acc: any, field: any) => {
        acc[field.name] = field.value;
        return acc;
      }, {})
    );

  const methods = forms.methods.reduce((acc: any, field: any) => {
    acc[field.name] = field.value;
    return acc;
  }, {});

  return {
    ...contact,
    invoice_settings: invoiceSettings,
    metadata: {
      merchant,
      user: {
        ...user,
        devices,
        social: user.social || [], // Assuming social is an empty array if not present
      },
    },
    methods,
  };
};
