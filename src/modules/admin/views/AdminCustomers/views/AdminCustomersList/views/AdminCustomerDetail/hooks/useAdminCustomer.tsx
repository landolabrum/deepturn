import { getService } from "@webstack/common";
import { useNotification } from "@webstack/components/Notification/Notification";
import { createField, findField } from "@webstack/components/UiForm/functions/formFieldFunctions";
import { IFormField } from "@webstack/components/UiForm/models/IFormModel";
import { useCallback, useEffect, useState } from "react";
import IAdminService from "~/src/core/services/AdminService/IAdminService";
import { useModal } from "@webstack/components/Containers/modal/contexts/modalContext";
import { useRouter } from "next/router";
import { dateFormat } from "@webstack/helpers/userExperienceFormats";

// Utility function to deep clone objects
const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

const useAdminCustomer = ({ customer_id, level }: { customer_id?: string, level: number }) => {
  const router = useRouter();
  const adminService = getService<IAdminService>('IAdminService');
  const [customer, setCustomerState] = useState<any>();
  const [initialCustomer, setInitialCustomer] = useState<any>();
  const [displayFields, setDisplayFields] = useState<any>({});
  const [notification, setNotification] = useNotification();
  const { openModal } = useModal();

  // Refresh state and clear customer data
  const refresh = () => {
    setCustomerState(undefined);
  };

  // Fetch customer data if it doesn't exist
  const getCustomer = useCallback(async () => {
    if (!customer_id || customer || initialCustomer) return;

    try {
      const response = await adminService.getCustomer(customer_id);
      // console.log({ response });
      if (!response?.error) return initForms(response);
      setNotification({ active: true, dismissable: true, apiError: response });
      console.error("Couldn't get customer");
      return;
    } catch (error) {
      setCustomerState(false);
      console.error('[ ADMIN CUSTOMER DETAILS ]', error);
    }
  }, [customer_id, customer, initialCustomer, adminService, setNotification]);

  // Initialize forms with customer data
  const initForms = (customerResponse: any, context?: any, parent?: string) => {
    const deepClonedCustomer = deepClone(customerResponse); // Deep clone to avoid reference issues
    setCustomerState(deepClonedCustomer);
    setInitialCustomer(deepClone(customerResponse)); // Deep clone initialCustomer for immutability
    setDisplayFields(deepClonedCustomer);
  };

  // Update a specific field in the customer data
  const updateField = (newField: any) => {
    // console.log({ newField });

    // Deep clone customer to ensure immutability
    const updatedCustomer = deepClone(customer);

    let fieldToUpdate = updatedCustomer;

    // Find the field to update in the customer object
    const fieldPath = newField.id.split('-').slice(1); // Remove 'customer' from the path
    fieldPath.forEach((pathSegment: any, index: any) => {
      if (index === fieldPath.length - 1) {
        fieldToUpdate[pathSegment] = newField.value; // Update the specific field
      } else {
        fieldToUpdate = fieldToUpdate[pathSegment]; // Traverse nested objects
      }
    });

    setCustomerState(updatedCustomer); // Set updated customer state

    // Update ThreeTree component if the field type is 'select'
    if (newField.type === 'select') {
      newField.options = newField.options.map((option: any) => ({
        ...option,
        selected: false,
      }));
      const selectedOption = newField.options.find((option: any) => option.value === newField.value);
      if (selectedOption) selectedOption.selected = true;
    }

    setDisplayFields(updatedCustomer); // Update display fields
  };

  // Function to modify the customer (send update request)
  const getDifferences = (initialObj: any, updatedObj: any) => {
    const differences: any = {};
  
    const compare = (initial: any, updated: any, path: string[] = []) => {
      for (const key in updated) {
        if (typeof updated[key] === "object" && !Array.isArray(updated[key]) && updated[key] !== null) {
          // Recursively compare objects
          compare(initial[key] || {}, updated[key], [...path, key]);
        } else if (updated[key] !== initial[key]) {
          // If values differ, store the updated value in the differences object
          const fullPath = [...path, key].join('.');
          set(differences, fullPath, updated[key]);
        }
      }
    };
  
    compare(initialObj, updatedObj);
    return differences;
  };
  
  // Helper function to set values in the nested differences object based on a path
  const set = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    keys.reduce((acc: any, key: string, index: number) => {
      if (index === keys.length - 1) {
        acc[key] = value;
      } else {
        if (!acc[key]) acc[key] = {};
      }
      return acc[key];
    }, obj);
  };
  
  const modifyCustomer = async () => {
    const modifyCustomerService = async (request: any) => {
      try {
        const response = await adminService.updateCustomer({id:initialCustomer.id,...request});
        if (response) openModal({ children: JSON.stringify(response) });
      } catch (error: any) {
        console.error({ error });
      }
    };
  
    // Get only the differences between the current customer and the initialCustomer
    const differences = getDifferences(initialCustomer, customer);
    
    // If no differences, do not send the request
    if (Object.keys(differences).length === 0) {
      console.log("No changes to update");
      return;
    }
  
    console.log({ differences }); // This is the payload with only changed fields
  
    // Send the differences as the payload
    await modifyCustomerService(differences);
  };

  useEffect(() => {
    if (customer === undefined) getCustomer();
  }, []);

  return {
    customer,
    initialCustomer,
    displayFields,
    updateField,
    modifyCustomer,
    refresh,
  };
};

export default useAdminCustomer;
