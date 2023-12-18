import { useRouter } from "next/router";
import ProductsListing from "~/src/modules/ecommerce/products/ProductsListing/ProductsListing";
import ProductDescription from "./[id]";
const ProductRouter = () =>{
    const router = useRouter();
    if(router.query?.id)return <ProductDescription/>;
    return <ProductsListing/>;
}
export default ProductRouter;