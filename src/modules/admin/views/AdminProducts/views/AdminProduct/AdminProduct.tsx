import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getService } from '@webstack/common';
import IAdminService from '~/src/core/services/AdminService/IAdminService';
import useDeleteProduct from '../../hooks/useDeleteProduct';
import UiForm from '@webstack/components/UiForm/controller/UiForm';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import styles from './AdminProduct.scss';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';
import environment from '~/src/core/environment';
import { useNotification } from '@webstack/components/Notification/Notification';
import useSessionStorage from '@webstack/hooks/storage/useSessionStorage';
import { IProduct } from '~/src/models/Shopping/IProduct';

const AdminProduct: React.FC<{ product?: any, products?: IProduct[] | null }> = ({ product, products }) => {
  const router = useRouter();
  const mid = environment.merchant.mid;
  const adminService = getService<IAdminService>('IAdminService');
  const { initiateDelete } = useDeleteProduct();
  const [notification, setNotification] = useNotification();

  const [fields, setFields] = useState<IFormField[]>([]);
  const [productMetadata, setProductMetadata] = useState<IFormField[]>([]);
  const [prices, setPrices] = useState<IFormField[][]>([]);
  const [priceMetadata, setPriceMetadata] = useState<IFormField[][]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ label: string, value: string }[]>([]);

  // Preload the existing image files into state
  const [imageFiles, setImageFiles] = useState<File[]>([]); 


  function getInitialPriceFields(includeTax = 'no', taxRate = '0.00', existing?: any): IFormField[] {
    const fields: IFormField[] = [
      { name: 'nickname', label: 'Price Name', type: 'text', value: existing?.nickname || '' },
      {
        name: 'unit_amount',
        label: 'Amount (USD)',
        type: 'text',
        value: existing?.unit_amount ? String(existing.unit_amount / 100) : '',
        traits: { mask: 'currency' },
      },
      { name: 'recurring', type: 'checkbox', label: 'recurring' },
      {
        name: 'include_tax',
        label: 'Include Tax',
        type: 'select',
        value: includeTax,
        options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
      },
      { name: 'file', label: 'Image File(s)', type: 'file', multiple: true, value: imageFiles },  // Use preloaded image files
    ];
    if (includeTax === 'yes') {
      fields.push({
        name: 'tax_rate',
        label: 'Sales Tax Rate',
        type: 'select',
        value: taxRate,
        options: [
          { label: 'No Tax (0%)', value: '0.00' },
          { label: 'Standard (7.45%)', value: '0.0745' },
          { label: 'Custom (10%)', value: '0.10' },
        ],
      });
    }
    return fields;
  }

  const onChange = (e: any, index?: number, isPriceMeta?: boolean) => {
    let { name, value, files } = e.target;
    name = name.replace(/^metadata\./, '');
    const val = value?.value !== undefined ? value?.value : value;

    if ((files && files.length > 0) || val instanceof File) {
      const newFiles = files ? Array.from(files) : [val];
      if (typeof index === 'number') {
        const updated: any = [...prices];
        updated[index] = updated[index].map((f: any) => {
          if (f.name === name) {
            const prev = Array.isArray(f.value) ? f.value : f.value ? [f.value] : [];
            return { ...f, value: [...prev, ...newFiles] };
          }
          return f;
        });
        return setPrices(updated);
      }
    }

    if (typeof index === 'number') {
      const updated = [...(isPriceMeta ? priceMetadata : prices)];

      updated[index] = updated[index].map(f => {
        if (f.name === name) {
          return { ...f, value: val };
        }
        return f;
      });

      isPriceMeta ? setPriceMetadata(updated) : setPrices(updated);
    } else {
      const isMeta = productMetadata.some(f => f.name === name);
      const isMain = fields.some(f => f.name === name);
      if (isMeta) {
        setProductMetadata(prev => prev.map(f => f.name === name ? { ...f, value: val } : f));
      } else if (isMain) {
        setFields(prev => prev.map(f => f.name === name ? { ...f, value: val } : f));
      } else {
        console.warn(`Unknown field name "${name}"`);
      }
    }
  };

  const taxRateOptions = [
    { label: 'No Tax (0%)', value: '0.00' },
    { label: 'Standard (7.45%)', value: '0.0745' },
    { label: 'Custom (10%)', value: '0.10' },
  ];

  const onDelete = async () => {
    try {
      const res = await initiateDelete({ id: product.id, price_id: product?.price?.id, name: product.name });
      // console.log("res", res);
      if (res?.id || res?.success) {
        setNotification({
          active: true,
          list: [{
            label: 'Product Deleted',
            message: `"${product.name}" has been deleted successfully.`,
            onClick: () => router.push('/admin?vid=products', undefined, { shallow: false }),
          }],
        });
      }
    } catch (err: any) {
      setNotification({
        active: true,
        apiError: {
          error: true,
          status: err?.status || 400,
          message: err?.message || 'Failed to delete product',
          detail: err?.response?.data?.detail || err?.detail || 'Unexpected error',
        },
        persistence: 5000,
      });
    }
  };
  function getTimeWithString(message:string) {
  // Get current time
  const now = new Date();
  
  // Format hours, minutes, seconds with leading zeros
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  // Combine into HH:MM:SS format
  const timeString = `${hours}:${minutes}:${seconds}`;
  
  // Return the time and the provided string
  return `${timeString} - ${message}`;
}

  // useEffect(() => {
  //   const testValues = fields.map(
  //     f=>{if(f?.type?.includes('text')&&!f?.value) f.value=getTimeWithString(f.name);return f;}
  //   )
  //   console.log("testValues", testValues);motor controller rcrc 
  // },[fields]);



  
  useEffect(() => {
    const categorySet = new Set<string>();
    products?.forEach(p => {
      const cat = p?.metadata?.category;
      if (cat) categorySet.add(cat);
    });

    const options = Array.from(categorySet).map(cat => ({ label: cat, value: cat }));
    const currentCategory = product?.metadata?.category;
    if (currentCategory && !options.find(opt => opt.value === currentCategory)) {
      options.push({ label: currentCategory, value: currentCategory });
    }

    setCategoryOptions(options);
    setFields([
      { name: 'name', label: 'Product Name', type: 'text', required: true, value: product?.name || '' },
      { name: 'description', label: 'Description', type: 'textarea', value: product?.description || '' },
      { name: 'active', label: 'Active', type: 'checkbox', value: product?.active ?? true },
      {
        name: 'marketing_features',
        label: 'Marketing Features',
        type: 'multi-select',
        value: product?.marketing_features || [],
        options: [
          { label: 'AI Generated', value: 'ai_generated' },
          { label: 'Verified Creator', value: 'verified_creator' },
          { label: 'Premium Support', value: 'premium_support' },
          { label: 'Early Access', value: 'early_access' },
        ],
      },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        value: currentCategory || '',
        options,
        input: true,
      },
    ]);

    const metadataFields: IFormField[] = [];
    if (product?.metadata) {
      Object.entries(product.metadata).forEach(([key, value]) => {
        if (key === 'mid' || key === 'metadata.category') return; // Remove redundant fields
        metadataFields.push({
          name: `metadata.${key}`,
          label: key,
          type: 'text',
          value: String(value),
        });
      });
    }
    setProductMetadata(metadataFields);

    if (product?.price && typeof product.price === 'object') {
      const priceFields = getInitialPriceFields(
        product.price.tax_behavior === 'inclusive' ? 'yes' : 'no',
        product.price.tax_rate || '0.00',
        product.price
      );
      setPrices([priceFields]);
      setPriceMetadata([
        product.price.metadata
          ? Object.entries(product.price.metadata).map(([key, value]) => ({
              name: key,
              label: key,
              type: 'text',
              value: String(value),
            }))
          : [],
      ]);
    } else {
      setPrices([getInitialPriceFields()]);
      setPriceMetadata([[]]);
    }

    // Preload the existing image files into the imageFiles state
    if (product?.images && product.images.length > 0) {
      const existingFiles = product.images.map((image: string) => {
        return {
          src: image, // Use the image URL directly for rendering
          alt: `Product image`, // Alt text for accessibility
        };
      });
      console.log("Preloaded image files:", existingFiles);
      setImageFiles(existingFiles);
    }
  }, [products, product, prices?.length]);
  const onSubmit = async () => {
    const imageFiles: File[] = [];

    prices.forEach((priceFields, index) => {
      const fileField = priceFields.find(f => f.name === 'file');
      const files = Array.isArray(fileField?.value) ? fileField.value : fileField?.value ? [fileField.value] : [];
      files.forEach((file: any, i: number) => {
        console.log("file", file);
        if (file instanceof File && file.name) {
          const nickname = String(priceFields.find(f => f.name === 'nickname')?.value || `price_${index}`);
          const ext = file.name.split('.').pop() || 'jpg';
          imageFiles.push(new File([file], `${nickname}_${index}_${i}.${ext}`, { type: file.type }));
        }
      });
    });

    const pricesData = prices.map((fields, index) => {
      const price = Object.fromEntries(fields.map(f => [f.name, f.value]));
      const billingPeriod = price.billing_period;
      const nickname = String(price.nickname || `price_${index}`).trim().replace(/\s+/g, '_');

      return {
        nickname,
        unit_amount: price.unit_amount
          ? Math.round(parseFloat(String(price.unit_amount).replace(/[^\d.]/g, '')) * 100)
          : 0,
        currency: 'usd',
        tax_behavior: price.include_tax === 'yes' ? 'inclusive' : 'exclusive',
        billing_scheme: 'per_unit',
        ...(price.include_tax === 'yes' && typeof price.tax_rate === 'string' && { tax_rate: price.tax_rate }),
        ...(billingPeriod !== 'one_time' && billingPeriod !== 'custom' && {
          recurring: {
            interval: ['day', 'week', 'month', 'year'].includes(String(billingPeriod)) ? String(billingPeriod) : 'month',
            interval_count: billingPeriod === 'quarter' ? 3 : billingPeriod === 'biannual' ? 6 : 1,
          },
        }),
        metadata: Object.fromEntries((priceMetadata[index] || []).map(f => [f.name, f.value])),
      };
    });

    const categoryValue = fields.find(f => f.name === 'category')?.value || '';

    const payload: any = {
      metadata: Object.fromEntries([
        ['mid', mid],
        ...productMetadata.map(f => [f.name, f.value]),
        ['category', categoryValue],
      ]),
      name: fields.find(f => f.name === 'name')?.value || '',
      description: fields.find(f => f.name === 'description')?.value || '',
      active: fields.find(f => f.name === 'active')?.value || false,
      marketing_features: fields.find(f => f.name === 'marketing_features')?.value || [],
      price: pricesData,
      merchant_id: mid,
      imageFiles,
    };
    if (!imageFiles.every(f => f instanceof File)) {
      return setNotification({
        active: true,
        apiError: {
          error: true,
          status: 400,
          message: 'One or more uploaded files are invalid.',
          detail: 'Ensure all image fields have valid image files.',
        },
      });
    }

    if (product?.id) payload.id = product.id;
    try {
      const response = await adminService.createProduct(payload);
      if (response?.id) {
        setNotification({
          active: true,
          list: [
            {
              label: "Product Created Successfully!",
              message: `"${response.name}" was created successfully.`,
              onClick: () => router.push(`/products/${response.id}`),
            },
          ],
        });
      }
    } catch (error: any) {
      setNotification({
        active: true,
        apiError: {
          error: true,
          status: error?.status || 400,
          message: error?.message || 'Failed to create product',
          detail: error?.response?.data?.detail || error?.detail || 'Unexpected error',
        },
        persistence: 5000,
      });
    }
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className="admin-product">
        <div className="admin-product__section">
          <UiForm title={product?.id ? 'Edit Product' : 'Add Product'} fields={fields} onChange={(e) => onChange(e)} />
          <UiForm
            key={`product-meta-${productMetadata.length}`}
            title="Product Metadata"
            fields={productMetadata}
            onChange={(e) => onChange(e)}
            onAddField={(e) => {
              let { name, value } = e.target;
              name = name.replace(/^metadata\./, '');
              if (!productMetadata.find(f => f.name === name)) {
                setProductMetadata(prev => [...prev, { name, label: value || name, type: 'text', value: '' }]);
              }
            }}
          />
        </div>

        {prices.map((price, index) => (
          <div className="admin-product__section" key={index}>
            <UiForm title={product?.price?.nickname || `Price ${index + 1}`} onChange={(e) => onChange(e, index)} fields={price} />
            <UiForm
              key={`price-meta-${index}`}
              title={`Price ${index + 1} Metadata`}
              fields={priceMetadata[index] || []}
              onChange={(e) => onChange(e, index, true)}
              onAddField={(e) => {
                let { name, value } = e.target;
                name = name.replace(/^metadata\./, '');
                setPriceMetadata(prev => {
                  const updated = [...prev];
                  if (!updated[index]) updated[index] = [];
                  if (!updated[index].find(f => f.name === name)) {
                    updated[index].push({ name, label: value || name, type: 'text', value: '' });
                  }
                  return updated;
                });
              }}
            />
            <UiIcon icon="fa-trash-can" onClick={() => {
              setPrices(prev => prev.filter((_, i) => i !== index));
              setPriceMetadata(prev => prev.filter((_, i) => i !== index));
            }} />
          </div>
        ))}

        <UiButton variant="link" traits={{ afterIcon: 'fa-dollar-sign-circle' }} onClick={() => {
          setPrices(prev => [...prev, getInitialPriceFields()]);
          setPriceMetadata(prev => [...prev, []]);
        }}>Add Price</UiButton>

        <UiButton variant="glow" onClick={onSubmit}>
          {product?.id ? 'Save Changes' : 'Add Product'}
        </UiButton>

        {product?.id && (
          <UiButton
            variant="danger"
            traits={{ afterIcon: 'fa-trash-can' }}
            onClick={async () => {
              await onDelete();
            }}
          >
            Delete Product
          </UiButton>
        )}
      </div>
    </>
  );  
};

export default AdminProduct;
