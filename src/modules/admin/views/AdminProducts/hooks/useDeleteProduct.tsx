import { getService } from "@webstack/common";
import { useLoader } from "@webstack/components/Loader/Loader";
import { useCallback, useState } from "react";
import IAdminService from "~/src/core/services/AdminService/IAdminService";

export interface IUseDelete {
  deletedProduct: any;
  setProduct: (e: any) => void;
  initiateDelete: (product: any) => Promise<any>;
}

const useDeleteProduct = (): IUseDelete => {
  const adminService = getService<IAdminService>("IAdminService");
  const [loader, setLoader] = useLoader();
  const [deletedProduct, setDeletedProduct] = useState<any>(null);

  const initiateDelete = useCallback(async (product: any) => {
    if (!product?.id) return;

    setDeletedProduct(product);
    setLoader({ active: true, body: `Deleting ${product.name}` });

    try {
      // console.log("[DELETING]", product.id, product.price_id);
      const response = await adminService.deleteProduct(product.id, product.price_id);
      return response;
    } catch (error) {
      console.error("Failed to delete product", error);
      throw error;
    } finally {
      setLoader({ active: false });
    }
  }, [adminService, setLoader]);

  return { deletedProduct, initiateDelete, setProduct: setDeletedProduct };
};

export default useDeleteProduct;
