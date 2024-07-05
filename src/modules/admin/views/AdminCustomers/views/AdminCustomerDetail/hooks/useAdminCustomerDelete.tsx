import { getService } from "@webstack/common";
import { useNotification } from "@webstack/components/Notification/Notification";
import IAdminService from "~/src/core/services/AdminService/IAdminService";
import { useModal } from "@webstack/components/modal/contexts/modalContext";
import { useRouter } from "next/router";

const useAdminCustomerDelete = (customer_id?: string) => {
  const router = useRouter();
  const adminService = getService<IAdminService>('IAdminService');
  const [notification, setNotification] = useNotification();
  const { openModal, closeModal, replaceModal } = useModal();

  const deleteCustomer = async () => {
    const deleteCustomerService = async () => {
      if (!customer_id) {
        console.error("[ CANNOT DELETE CUSTOMER (NO ID) ]");
        return;
      }

      try {
        const response = await adminService.deleteCustomer(customer_id);
        if (response) {
          console.log("[ SUCCESS DELETED ]", { response, customer_id });
          return response;
        } else {
          console.error(`[ ERROR DELETING ( 1 ) ]: ${customer_id}`);
        }
      } catch (error) {
        console.error(`[ ERROR DELETING ( 2 ) ]: `, { customer_id, error });
      }
    };

    const onDelete = async () => {
      const deleted: any = await deleteCustomerService();
      if (deleted) {
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
        if (deleted.deleted) notificationContext = {
          title: "Success",
          children: `Deleted: ${customer_id}`,
          confirm: {
            statements: [{
              label: 'customers',
              onClick: () => router.push(router.pathname, { query: { cid: 'list' } })
            }]
          }
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
    deleteCustomer
  };
};

export default useAdminCustomerDelete;
