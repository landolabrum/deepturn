import { getService } from "@webstack/common";
import { useLoader } from "@webstack/components/Loader/Loader";
import { useModal } from "@webstack/components/Containers/modal/contexts/modalContext";
import { useCallback, useState } from "react";
import IAdminService from "~/src/core/services/AdminService/IAdminService";

export interface IUseDelete {
  deletedProduct: any;
  setProduct: (e: any) => void;
  initiateDelete: (e: any) => void;
}

const useDeleteProduct = (): IUseDelete => {
  const adminService = getService<IAdminService>("IAdminService");
  const [loader, setLoader] = useLoader();
  const [product, setProduct] = useState<any>(null);
  const [deletedProduct, setDeletedProduct] = useState<any>(null);
  const { openModal, closeModal } = useModal();

  const handleDelete = useCallback(
    async (priceId?: string) => {
      if (!deletedProduct?.id) return;

      setLoader({ active: true, body: `Deleting: ${deletedProduct.id}` });

      try {
        const response = await adminService.deleteProduct(deletedProduct.id, priceId);
        if (response?.data) {
          openModal({ title: response.message, children: <>{response.message}</> });
        }
        if (response?.detail?.detail) {
          openModal({ title: "Error", children: <>{response.detail.detail}</> });
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        openModal({ title: "Error", children: <>Error deleting product</> });
      } finally {
        setLoader({ active: false });
      }
    },
    [deletedProduct, adminService, openModal, setLoader]
  );

  const initiateDelete = (product: any) => {
    if (!product) return;
    setDeletedProduct(product);

    const modalConfig = product.price_id
      ? {
          title: `Product: ${product.id} has a price connected`,
          statements: [
            {
              label: `Detach ${product.price_id}`,
              onClick: () => handleDelete(product.price_id),
            },
          ],
        }
      : {
          title: `Delete: ${product.id}`,
          statements: [{ label: "Yes", onClick: () => handleDelete() }],
        };

    openModal({ confirm: modalConfig });
    return true
  };

  return { deletedProduct, initiateDelete, setProduct };
};

export default useDeleteProduct;
