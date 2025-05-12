import { getService } from "@webstack/common";
import { useNotification } from "@webstack/components/Notification/Notification";
import IAdminService from "~/src/core/services/AdminService/IAdminService";
import { useModal } from "@webstack/components/Containers/modal/contexts/modalContext";
import { useRouter } from "next/router";

const useAdminCustomerDelete = (customer_id?: string | string[]) => {
  const router = useRouter();
  const adminService = getService<IAdminService>('IAdminService');
  const [notification, setNotification] = useNotification();
  const { openModal, closeModal, replaceModal } = useModal();

  const deleteCustomers = async () => {
    const deleteCustomersService = async () => {
      if (!customer_id || customer_id.length === 0) {   
        console.error("[ CANNOT DELETE CUSTOMER (NO ID) ]");
        return;
      }

      try {
        const response = await adminService.deleteCustomers(Array.isArray(customer_id) ? customer_id : [customer_id]);
        if (response) {
          // console.log("[ RETURNED FROM SERVER ]", { response, customer_id });
          return response;
        } else {
          console.error(`[ ERROR DELETING ( 1 ) ]: ${customer_id}`);
        }
      } catch (error) {
        console.error(`[ ERROR DELETING ( 2 ) ]: `, { customer_id, error });
      }
    };

    const onDelete = async () => {
      const response: any = await deleteCustomersService();
      if (response) {
        let notificationContext: any = {
          title: "Error",
          children: `Error Deleting: ${customer_id}`,
          confirm: {
            statements: [{
              label: 'return',
              onClick: closeModal
            }]
          }
        };
        if (response?.length > 0 && response[0] && response[0].deleted)
          notificationContext = {
            title: "Success",
            children: `Deleted: ${customer_id}`,
            confirm: {
              statements: [
                {
                  label: "customers",
                  onClick: () => router.push(router.pathname, { query: { vid: "list" } }),
                },
              ],
            },
          };
        return replaceModal(notificationContext);
      }
    };

    openModal({
      confirm: {
        title: 'Are you sure you want to delete?',
        statements: [
          { label: 'Yes', onClick: onDelete },
          { label: 'Cancel', onClick: closeModal }
        ]
      }
    });
  };

  return {
    deleteCustomers
  };
};

export default useAdminCustomerDelete;
