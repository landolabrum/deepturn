import Resource from "../resources/Resource";

export default interface ProductResource extends Resource {
  bundleProducts: any;
  productId: string;
  partnerId: string;
  isItem: boolean;
  name: string;
  parentProductId: string;
  brandId: string;
  productPriceAsString: string;
  productPriceAsDecimal: number;
  productType: string;
  sku: string;
  quantity: number;
}



