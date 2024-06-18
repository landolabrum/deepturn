import { getService } from "@webstack/common";
import { useEffect, useState } from "react";
import IAdminService from "~/src/core/services/AdminService/IAdminService";

const useAdminCustomer =  (customer_id?: string) => {
  const adminService = getService<IAdminService>('IAdminService');
  const [customer, setCustomer] = useState<any>();
  const getCustomer = async () => {
    if (!customer_id) return;
    let context: any = {
      contact: []
    };
    const handleField = (formName: string, field: any) => {
      const readOnlyFieldNames = [''];
      const { key, value } = field;
      if (!context[formName]) {
        context[formName] = [{ name: key, value: value, label: key }];
      } else {
        context[formName].push({ name: key, value: value, label: key });
      }
    };
    const initForms = (response: any, parent?: string) => {
      Object.entries(response).map(([key, value]: any) => {
        const keyToUse = parent || 'contact';
        // console.log({ keyToUse })
        if (
          // HANDLE FIRST LEVEL
          ['string', 'number', undefined, 'boolean'].includes(typeof value) || !value
        ) handleField(keyToUse, { key, value });
        else if (value?.constructor == Object) {
          console.log({ obj: true, value })
          initForms(value, key)
        }
      });
    };
    if (customer_id && !customer) {
      try {
        const response = await adminService.getCustomer(customer_id);
        if (response) {
          initForms(response)
          setCustomer(context);
        } else {
          console.error("Couldn't get customer");
        }
      } catch (error) {
        console.error('[ ADMIN CUSTOMER DETAILS ]', error);
      }
    }
  }
  useEffect(() => {
    getCustomer();
  }, [customer_id, customer]);
  return customer;
};

export default useAdminCustomer;