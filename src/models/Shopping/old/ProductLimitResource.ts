
import Resource from "../../resources/Resource";

export default interface ProductLimitResource extends Resource {
  productID: String;
  allowedToPurchase: boolean;
}




