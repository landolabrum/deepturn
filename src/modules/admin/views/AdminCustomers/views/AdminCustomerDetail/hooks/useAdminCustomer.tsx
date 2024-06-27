 import { getService } from "@webstack/common";
import { useNotification } from "@webstack/components/Notification/Notification";
import { findField } from "@webstack/components/UiForm/functions/formFieldFunctions";
import { IFormField } from "@webstack/components/UiForm/models/IFormModel";
import { useEffect, useState } from "react";
import IAdminService from "~/src/core/services/AdminService/IAdminService";

const useAdminCustomer = (customer_id?: string) => {
  const adminService = getService<IAdminService>('IAdminService');
  const [customer, setState] = useState<any>();
  const [initialCustomer, setInitialCustomer] = useState<any>();
  const [data, setData] = useState<object | undefined>();
  const [notification, setNotification] = useNotification();

  const getCustomer = async () => {
    if (!customer_id) return;
    let context: any = {
      contact: []
    };
    const handleField = (formName: string, field: { name: any, value: any }) => {
      const { name, value } = field;
      if (!context[formName]) {
        context[formName] = [{ name, value, label: name }];
      } else {
        context[formName].push({ name, value, label: name });
      }
    };

    const initForms = (response: any, parent?: string) => {
      const testFirstLevel = (value: any) => ['string', 'number', undefined, 'boolean'].includes(typeof value) || !value;

      Object.entries(response).forEach(([key, value]: any) => {
        let keyToUse = parent || 'contact';
        if (testFirstLevel(value)) {
          handleField(keyToUse, { name: key, value });
        } else if (value?.constructor === Object) {
          if (key != "data") initForms(value, key);
          else setData({ ...data, [keyToUse]: value });
        } else if (value?.constructor === Array) {
          value.forEach((val: any, listVal: number) => {
            // DEVICES[]
            if (context[keyToUse]) keyToUse = `${key.substring(0, Number(key.length) - 1)}-${listVal}`;
            Object.entries(val).forEach(([dictKey, dictValue]: any) => {
              if (dictValue && dictValue.constructor === Object) {
                Object.entries(dictValue).forEach(([k, v]) => {
                  if (testFirstLevel(v)) handleField(keyToUse, { name: k, value: v });
                });
              } else {
                handleField(keyToUse, { name: dictKey, value: dictValue });
              }
            });
          });
        }
      });
    };

    if (customer_id && !customer) {
      try {
        const response = await adminService.getCustomer(customer_id);
        if (!response?.error) {
          initForms(response);
          setState(context);
          setInitialCustomer(context);  // Set the initial customer data
        } else {
          setNotification({ active: true, dismissable: true, apiError: response });
          console.error("Couldn't get customer");
        }
      } catch (error) {
        setState(false);
        console.error('[ ADMIN CUSTOMER DETAILS ]', error);
      }
    }
  };

  const setCustomer = ({ form, e }: { form: string, e: any }) => {
    const { name, value } = e.target;
    const currentForm: IFormField[] = customer[form];
    const fieldToChange = findField(currentForm, name);
    if (fieldToChange) {
      fieldToChange.value = value;
      const updatedForm = currentForm.map((field: IFormField) =>
        field.name === name ? { ...field, value } : field
      );
      setState((prevState: any) => ({
        ...prevState,
        [form]: updatedForm
      }));
    }
  };

  useEffect(() => {
    getCustomer();
  }, [customer_id, customer]);

  return { customer, setCustomer, data, initialCustomer };
};

export default useAdminCustomer;