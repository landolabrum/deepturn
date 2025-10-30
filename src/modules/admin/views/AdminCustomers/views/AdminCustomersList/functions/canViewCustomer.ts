import environment from "~/src/core/environment";
import type { ICustomer } from "~/src/models/CustomerContext";
import type IAuthenticatedUser from "~/src/models/ICustomer";

/**
 * Returns a strict boolean (never undefined). Keeps logic simple:
 * - Data admin (>=12) sees all
 * - Merchant admin (>=10) sees their own mid
 * - A user may see themself (email match)
 */
const canViewCustomer = (
  customer: ICustomer,
  user?: IAuthenticatedUser
): boolean => {
  if (!customer) return false;

  const { mid } = environment.merchant;
  const level = Number(user?.metadata?.user?.clearance ?? 0);

  const custMid = customer?.metadata?.merchant?.mid;
  const isDataAdmin = level >= 12;
  const isMerchantAdmin = level >= 10 && custMid === mid;
  const isSelf =
    Boolean(user?.email) &&
    Boolean((customer as any)?.email) &&
    user!.email === (customer as any).email;

  return isDataAdmin || isMerchantAdmin || isSelf;
};

export default canViewCustomer;
