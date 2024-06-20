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
    const handleField = (formName: string, field: {name: any, value: any}) => {
      const readOnlyFieldNames = [''];
      const { name: name, value } = field;
      if (!context[formName]) {
        context[formName] = [{ name: name, value: value, label: name }];
      } else {
        context[formName].push({ name: name, value: value, label: name });
      }
    };
    const initForms = (response: any, parent?: string) => {
      const testFirstLevel = (value:any)=>{
        return ['string', 'number', undefined, 'boolean'].includes(typeof value) || !value
      }
      Object.entries(response).map(([key, value]: any) => {
        let keyToUse = parent || 'contact';
        if (testFirstLevel(value))handleField(keyToUse, { name: key, value });
        else if (value?.constructor == Object)initForms(value, key);

        else if (value?.constructor == Array) {
          value.map((listKey,listVal)=>{
            const val:any = value[listVal];
            if(context[keyToUse])keyToUse=`${key.substring(0, Number(key.length) - 1)}-${listVal}`;
            Object.entries(val).map(
              ([dictKey,dictValue])=>{
                if(dictValue && dictValue.constructor === Object){
                  Object.entries(dictValue).map(([k,v])=>{
                    if(testFirstLevel(v)){
                      // console.log({keyToUse, dictKey, dictValue, k,v})
                      handleField(keyToUse, { name:k, value:v });
                    }
                  })
                }else handleField(keyToUse, {name:dictKey, value:dictValue});
              }
            )
          })
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