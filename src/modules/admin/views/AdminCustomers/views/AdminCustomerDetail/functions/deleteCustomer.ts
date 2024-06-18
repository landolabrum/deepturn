import { getService } from "@webstack/common";
import { useEffect, useState } from "react";
import IAdminService from "~/src/core/services/AdminService/IAdminService";

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

export default deleteCustomer;