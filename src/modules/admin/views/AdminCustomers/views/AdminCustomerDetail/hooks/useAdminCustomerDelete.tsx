import { getService } from "@webstack/common";
import { useNotification } from "@webstack/components/Notification/Notification";
import { useModal } from "@webstack/components/modal/contexts/modalContext";
import { useRouter } from "next/router";
import IAdminService from "~/src/core/services/AdminService/IAdminService";

const useAdminDeleteCustomer = (customer_id?: string) => {
    const { isModalOpen, openModal, closeModal, replaceModal } = useModal();
    const router = useRouter();
    const [notification, setNotification] = useNotification();

    const handleDelete = () => {
        const deleteCustomer = async (customer_id?: string) => {
            let context;
            const adminService = getService<IAdminService>('IAdminService');
            if (!customer_id) return;
            if (customer_id) {
                try {
                    const response = await adminService.deleteCustomer(customer_id);
                    if (response) {
                        console.log("[ SUCCESS DELETED ]", { response, customer_id });
                    } else {
                        console.error(`[ ERROR DELETING ( 1 ) ]: ${customer_id}`);
                    }
                    context = response;
                } catch (error) {
                    console.error(`[ ERROR DELETING ( 2 ) ]: `, { customer_id, error });
                }
            }
            return await context;
        };
        const onDelete = async () => {
            const deleted: any = await deleteCustomer(customer_id);
            if (deleted) {
                let notificationContext:any = {
                     title: "Error",
                     children: `Error Deleting: ${customer_id}` ,
                     confirm:{
                        statements: [{
                            label:'return',
                            onClick: closeModal
                        }]
                    }
                };
                if (deleted.deleted) notificationContext = { 
                    title: "Success",
                    children: `Deleted: ${customer_id}`,
                    confirm:{
                        statements: [{
                            label:'customers',
                            onClick: ()=>router.push(router.pathname,{
                                query:{cid: 'list'}
                            })
                        }]
                    }
                   
                 };
                replaceModal(notificationContext)
                // closeModal();
               
                // router.query.cid = undefined;
                // setNotification({
                //     active: true,
                //     list: [
                //         notificationContext
                //     ]
                // });
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
    return handleDelete;
}
export default useAdminDeleteCustomer;