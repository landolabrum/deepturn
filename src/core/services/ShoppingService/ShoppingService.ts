import ApiService from "../ApiService";
import { getService } from "@webstack/common";
import environment from "~/src/environment";
import IShoppingService, { IProduct } from "./IShoppingService"
import IMemberService from "../MemberService/IMemberService";

export default class ShoppingService extends ApiService implements IShoppingService {

  private memberService: IMemberService;

  constructor() {
    super(environment.serviceEndpoints.social);
    this.memberService = getService<IMemberService>('IMemberService');
  }
  public async getProducts(
    request?: any
  ): Promise<any> {
    if (request === undefined){
      return await this.get<any>(
        `/api/products`,
      )
    }else{
      return await this.get<any>(
        `/api/products${request}`,
      );
    }
  }
  public async getProduct({ id, pri }: IProduct): Promise<any> {
    if (pri) {
      return this.get<any>(
        `/api/product?id=${id}&pri=${pri}`,
      );
    }
    return this.get<any>(
      `/api/product?id=${id}`,
    );
  }
  // nodesPurchasedByDate({dateFrom, dateTo, customDateRange}: any): Promise<any> {
  //   return this.post('/reports/nodes-purchased-by-date', {dateFrom, dateTo, customDateRange});
  // }
  // revenueTotals({skip, limit, dateFrom, dateTo}: RevenueRequest): Promise<RevenueTotalsResponse> {
  //   return this.post('/reports/sales-totals-by-date', {skip, limit, dateFrom, dateTo});
  // }
  // revenueDetails({skip, limit, dateFrom, dateTo}: any): Promise<any> {
  // // getRevenueDetails({skip, limit, dateFrom, dateTo}: any): Promise<RevenueDetailsResponse> {
  //   return this.post('reports/sales-by-date', {skip, limit, dateFrom, dateTo});
  //   // return this.get('/admin/orders/export');
  // }
  
  // orderHistoryDetails(orderId: string ): Promise<any>{
  //   return this.post(`/reports/order-history/details/${orderId}`)
  // }
  // protected appendHeaders(headers: { [key: string]: string }) {
  //   super.appendHeaders(headers);
  //   const token = this.memberService.getCurrentUserToken();
  //   if (token) { headers['Authorization'] = `Bearer ${token}`; }
  // }
  // orderHistory(memberId: string): Promise<any> {
  //   return this.post(`/reports/order-history/${memberId}`);
  // }

}
