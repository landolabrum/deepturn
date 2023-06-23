import Resource from "../resources/Resource";
import ProductResource from "./ProductResource";

export default interface ShoppingResource extends Resource {
  products?: ProductResource[], 
}


