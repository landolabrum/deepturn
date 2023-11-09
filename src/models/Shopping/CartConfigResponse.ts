export default interface PromotionsResource {
  id: string;
  type: string;
  discount: number;
  eligibleSkus: string[];
  minQuantity: number;
  discountUsdIncrement: number;
}

export default interface CartConfigResponse {
  promotions: PromotionsResource[],
}
