import { getService } from "@webstack/common";
import { useNotification } from "@webstack/components/Notification/Notification";
import { findField } from "@webstack/components/UiForm/functions/formFieldFunctions";
import { IFormField } from "@webstack/components/UiForm/models/IFormModel";
import { useCallback, useEffect, useState } from "react";
import IAdminService from "~/src/core/services/AdminService/IAdminService";
import { useModal } from "@webstack/components/modal/contexts/modalContext";
import { useRouter } from "next/router";
import { dateFormat } from "@webstack/helpers/userExperienceFormats";

const useAdminCustomer = ({ customer_id, level }: { customer_id?: string, level: number }) => {
  const router = useRouter();
  const adminService = getService<IAdminService>('IAdminService');
  const [customer, setCustomerState] = useState<any>();
  const [initialCustomer, setInitialCustomer] = useState<any>();
  const [displayFields, setDisplayFields] = useState<any>({});
  const [notification, setNotification] = useNotification();
  const { openModal } = useModal();

  const getCustomer = useCallback(async () => {
    if (!customer_id || customer || initialCustomer) return;

    try {
      const response = await adminService.getCustomer(customer_id);
      console.log({ response });
      if (response?.error) {
        setNotification({ active: true, dismissable: true, apiError: response });
        console.error("Couldn't get customer");
        return;
      }

      const context: any = { contact: [] };
      initForms(response, context);
      setCustomerState(context);
      setInitialCustomer(context);
    } catch (error) {
      setCustomerState(false);
      console.error('[ ADMIN CUSTOMER DETAILS ]', error);
    }
  }, [customer_id, customer, initialCustomer, adminService, setNotification]);

  const handleField = (context: any, formName: string, field: { name: any, value: any }) => {
    const { name, value } = field;
    const typeIsNameFields = ['password', 'email', 'address'];
    let readOnlyFields = [
      'id', 'object', 'default_source', 'invoice_prefix', 'test_clock', 'tax_exempt', 'currency', 'service', 'created',
      'email_verified', 'password_token', 'type', 'server_url',
    ];
    if (level >= 11) readOnlyFields.push('clearance');

    let fieldContext: IFormField = { name: String(name).toLowerCase(), value, label: name, type: 'text' };
    if (typeIsNameFields.includes(name)) fieldContext.type = name;
    if (readOnlyFields.includes(name)) fieldContext.readonly = true;
    if (typeof value === 'number' || !isNaN(parseFloat(value))) fieldContext.type = parseFloat(value) > 99 ? 'tel' : 'pill';
    if (name === 'created') fieldContext.value = dateFormat(Number(String(value).substring(0, 10)), { isTimestamp: true });
    if (typeof value === 'boolean') fieldContext.type = 'checkbox';

    // Split name into firstName and lastName
    if (name === 'name' && formName == "contact") {
      const [firstName, lastName] = value.split(' ');
      context[formName].push({ ...fieldContext, name: 'firstName', label: 'first name', value: firstName, autoComplete: 'given-name', required: !!firstName });
      context[formName].push({ ...fieldContext, name: 'lastName', label: 'last name', value: lastName, autoComplete: 'family-name', required: !!lastName });
      return;
    }

    // Add autoComplete
    if (['firstName', 'lastName', 'address', 'phone'].includes(name)) {
      fieldContext.autoComplete = name.replace('-', ' ');
    }

    // Add required fields
    if (['address', 'firstName', 'lastName', 'phone'].includes(name) && value) {
      fieldContext.required = true;
    }

    if (!context[formName]) context[formName] = [fieldContext];
    else context[formName].push(fieldContext);
  };

  const initForms = (response: any, context: any, parent?: string) => {
    const isContactField = (value: any) => ['string', 'number', undefined, 'boolean'].includes(typeof value) || !value;

    Object.entries(response).forEach(([respFldKey, respFldVal]: any) => {
      const keyToUse = parent || 'contact';

      if (isContactField(respFldVal)) {
        handleField(context, keyToUse, { name: respFldKey, value: respFldVal });
        updateDisplayFields(keyToUse, respFldKey, respFldVal);
      } else if (respFldVal?.constructor === Object) {
        if (!["data", "address", 'devices'].includes(respFldKey)) {
          initForms(respFldVal, context, respFldKey);
        } else if (respFldKey === 'address') {
          context.contact.push({ name: respFldKey, value: respFldVal, type: respFldKey });
        } else {
          setDisplayFields((prevDisplay: any) => ({ ...prevDisplay, [keyToUse]: respFldVal }));
        }
      } else if (respFldVal?.constructor === Array) {
        respFldVal.forEach((val: any, listVal: number) => {
          let listKeyToUse = keyToUse;

          const lastLetter = respFldKey.slice(-1);
          if (context[listKeyToUse]) listKeyToUse = `${lastLetter === 's' ? respFldKey.slice(0, -1) : respFldKey}-${listVal}`;
          Object.entries(val).forEach(([dictKey, dictValue]: any) => {
            if (dictValue?.constructor === Object) {

              Object.entries(dictValue).forEach(([k, v]:any) => {
                if (v?.constructor == Array) {
                  // console.log({parent, keyToUse, listKeyToUse, dictKey,  k,v})
                  // const toUpdate = customer[listKeyToUse][dictKey][k];
                  // console.log({toUpdate})
                  // setCustomerState({...customer, })
                  if(!displayFields[listKeyToUse]){
                    displayFields[listKeyToUse]=v
                    updateDisplayFields(listKeyToUse, k, typeof v != 'object'? v:v);
                    console.log({lk:displayFields[listKeyToUse]})
                    // console.log({FOOP:[`${k}-${arrInd}`]})
                  }
                  else{
                    Object.values(v).map((vl, arrInd: number) =>{
                      console.log(listKeyToUse,{name:`${k}-${arrInd}`,value:vl})
                      // handleField(context, keyToUse, { name: respFldKey, value: respFldVal });
                      // updateDisplayFields(listKeyToUse, `${k}-${arrInd}`, typeof vl != 'object'? vl:JSON.stringify(vl))
                    }
                    )
                  }
                  // TODO STILL NOT MAPPING REQUEST RIGHT 
                 
                }
                isContactField(v) && handleField(context, listKeyToUse, { name: k, value: v })
              }
              );
            } else {
              handleField(context, listKeyToUse, { name: dictKey, value: dictValue });
            }
          });
        });
      }
    });
  };

  const updateDisplayFields = (keyToUse: string, key: string, value: any) => {
    const isDisplayField = () => {
      let context = false;
      if (keyToUse === 'contact') context = ['name', 'email', 'phone'].includes(key);
      if (keyToUse === 'user') context = ['email', 'email_verified'].includes(key);
      if(keyToUse.includes('device'))context = true;
      return context;
    };

    if (isDisplayField()) {
      setDisplayFields((prevDisplay: any) => {
        const updatedDisplay = { ...prevDisplay };
        if (!updatedDisplay[keyToUse]) {
          updatedDisplay[keyToUse] = {};
        }
        updatedDisplay[keyToUse][key] = ['undefined', 'null', 'boolean'].includes(typeof value) || String(value).length ? `${value}` : value || "n/a";
        return updatedDisplay;
      });
    }
  };

  const setFields = ({ form, e }: { form: string, e: any }) => {
    const { name, value } = e.target;
    const currentForm: IFormField[] = customer[form];
    const fieldToChange = findField(currentForm, name);
    if (fieldToChange) {
      fieldToChange.value = value;
      const updatedForm = currentForm.map((field: IFormField) =>
        field.name === name ? { ...field, value } : field
      );
      setCustomerState((prevState: any) => ({
        ...prevState,
        [form]: updatedForm
      }));
    }
  };

  const modifyCustomer = async () => {
    const modifyCustomerService = async (request: any) => {
      try {
        const response = await adminService.updateCustomer(request);
        if (response) openModal({ children: JSON.stringify(response) });
      } catch (error: any) {
        console.error({ error });
      }
    };

    let request: any = { metadata: {} };
    let user = request.metadata?.user;

    Object.entries(customer).forEach(([formName, fields]: any) => {
      fields.forEach((field: any) => {
        let fieldName: string = field.name;
        let fieldValue: any = field.value;
        if (field?.name === "created") fieldValue = Number(dateFormat(fieldValue, { options: { returnType: "timestamp" } }));

        // Join firstName and lastName
        if (formName === 'contact' && (fieldName === 'firstName' || fieldName === 'lastName')) {
          const firstNameField = findField(fields, 'firstName');
          const lastNameField = findField(fields, 'lastName');
          if (firstNameField && lastNameField) {
            request.name = `${firstNameField.value} ${lastNameField.value}`;
            return;
          }
        }

        if (['contact', 'methods', 'address'].includes(formName)) {
          if (formName === 'contact' && fieldName === 'address') {
            request[fieldName] = fieldValue;
          } else {
            request[fieldName] = fieldValue;
          }
        } else {
          if (!request.metadata[formName]) {
            if (!formName.includes("-")) {
              request.metadata[formName] = {};
            } else {
              const formNameParts = formName.split("-");
              formName = formNameParts[0] + "s";
              if (!request.metadata[formName]) {
                request.metadata[formName] = [];
              }
              if (formNameParts[1]) {
                console.log("[ request.metadata[formName][index] ]", { fields })
                if (!request.metadata.user.devices) {
                  request.metadata.user.devices = []
                }
                Object.entries(fields).map(([index, field]: any) => {
                  const fpOne = Number(formNameParts[1])
                  if (!request.metadata.user.devices?.[fpOne]) {
                    request.metadata.user.devices[fpOne] = {}
                  }
                  if (field?.name === "created") field.value = Number(dateFormat(field.value, { options: { returnType: "timestamp" } }));
                  request.metadata.user.devices[fpOne][field.name] = field.value
                })
              }

              return;
            }
          }
          request.metadata[formName][fieldName] = fieldValue;
        }
      });
    });

    console.log({ request, user });

    if (Object.keys(request).length > 1 || Object.keys(request.metadata).some(key => Object.keys(request.metadata[key]).length > 0)) {
      await modifyCustomerService(request);
    } else {
      console.error("[ ADMIN CUS DETAILS (NO REQ) ]");
    }
  };

  useEffect(() => {
    if (!customer && !initialCustomer) getCustomer();
  }, [getCustomer, customer, initialCustomer]);

  return {
    customer,
    initialCustomer,
    displayFields,
    setFields,
    modifyCustomer,
  };
};

export default useAdminCustomer;
