import { getService } from "@webstack/common";
import { useEffect, useState } from "react";
import IAdminService from "~/src/core/services/AdminService/IAdminService";
import { ICustomer } from "~/src/models/ICustomer";
import AdaptTableCell from "@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell";
import styles from './../AdminCustomerList.scss';
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import canViewCustomer from "../../../functions/canViewCustomer";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { getUserClearance, useUser } from "~/src/core/authentication/hooks/useUser";
import environment from "~/src/core/environment";

const useAdminCustomers = () => {
  const adminService = getService<IAdminService>('IAdminService');
  const [hasMore, setHasMore] = useState(false);
  const user = useUser();  

  const [customers, setCustomers] = useState<ICustomer[] | undefined>();
  const refresh = () =>{
    setCustomers(undefined)
    // getCustomerList()
  }
  const getCustomerList = async () => {
    if(customers !== undefined)return;
    let customerList = await adminService.listCustomers();
    if (customerList?.object === 'list') {
      setHasMore(customerList.has_more)
      customerList = customerList.data;
      const transformedCustomerList = customerList.map((customer: any) => {
        if (!customer?.id) return;
        const viewableCustomer = canViewCustomer(customer, user);
        const notUser = customer.email !== user?.email;
      
        const extras = {
          ...customer.metadata,
          ...customer.invoice_settings,
          description: customer.description,
          discount: customer.discount,
          currency: customer.currency,
          invoice_prefix: customer.invoice_prefix,
          next_invoice_sequence: customer.next_invoice_sequence,
        };
      
        if (viewableCustomer) return {
          customer: <AdaptTableCell cell='member' data={{
            id: customer.id as string,  // Type assertion here
            name: customer.name,
            email: customer.email,
          }} />,
          id: customer.id,
          balance: customer.balance,
          created: <AdaptTableCell cell='date' data={customer.created} />,
          default_source: <AdaptTableCell cell='check' data={Boolean(customer.default_source)} />,
          merchant: <>
            <style jsx>{styles}</style>
            <div className={`d-flex ${notUser ? '' : "user"}`}>
              <UiIcon icon={notUser ? `${customer?.metadata?.merchant?.name}-logo` : 'fa-star'} />
            </div>
          </>,
          tax_exempt: <AdaptTableCell cell='check' data={Boolean(customer.tax_exempt === 'exempt')} />,
          clearance: <AdaptTableCell cell='id' data={keyStringConverter(getUserClearance(Number(customer?.metadata?.user?.clearance))?.user.type, { textTransform: "capitalize" })} />,
          extras: extras,
          quote: customer.metadata && <AdaptTableCell cell='check' data={Boolean(Object.entries(customer.metadata).find((f: any) => String(f).includes(String(environment.merchant.mid))))} />,
        };
      });
      
      // Set the transformed customer list in state
      setCustomers(transformedCustomerList);
    }
  };

  useEffect(() => {
    getCustomerList();
  }, [getCustomerList]);

  return {
    customers,
    hasMore,
    refresh,
  };
};

export default useAdminCustomers;
