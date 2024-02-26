export interface IGetProduct {
  id?: string
  pri?: string
}
export type IProducts = {
  ending_before?: string | undefined,
  starting_after?: string | undefined
}
export default interface IProductService {
  getProducts(request?: any): Promise<any>;
  getProduct({ id, pri }: IGetProduct): Promise<any>;
}

