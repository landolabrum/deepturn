import Resource from "../../resources/Resource";
import ProductLimitResource from "./ProductResource";

export default interface MemberProductLimitResource extends Resource {
  memberProductLimits?: ProductLimitResource[],
}
