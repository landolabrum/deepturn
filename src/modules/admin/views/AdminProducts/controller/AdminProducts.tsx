import React, { useEffect, useState, useCallback, useRef } from 'react';
import styles from './AdminProducts.scss';
import { getService } from '@webstack/common';
import IProductService, { IGetProduct } from '~/src/core/services/ProductService/IProductService';
import { dateFormat, numberToUsd } from '@webstack/helpers/userExperienceFormats';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import AdminProduct from '../views/AdminProduct/AdminProduct';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import { IProduct } from '~/src/models/Shopping/IProduct';
import UiLoader from '@webstack/components/UiLoader/view/UiLoader';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import { useAdminLevel } from '~/src/core/authentication/hooks/useUser';
import environment from '~/src/core/environment';
import useDeleteProduct from '../hooks/useDeleteProduct';
import { useLoader } from '@webstack/components/Loader/Loader';
import { IFormField } from '@webstack/components/UiForm/models/IFormModel';

const AdminProducts: React.FC = () => {
  const MID_LEVEL = 10;
  const { openModal, closeModal } = useModal();

  const [products, setProducts] = useState<IProduct[] | undefined>();
  const [modified, setModified] = useState<any[] | undefined>();
  const [product, setProduct] = useState<IProduct>();
  const [responseExtras, setExtras] = useState<object | undefined>();
  const [select, setSelect] = useState<boolean>(false);
  const [view, setView] = useState<string>('list');
  const selected = select && products?.filter(p => p?.selected)?.length;
  const { user } = useAdminLevel();
  const [loader, setLoader] = useLoader();
  const searchTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<IProduct[] | undefined>(products);

  const onRowClick = (product: IProduct) => {
    if (!product.id) return;
    setProduct(product);
    setView('product');
  };

  const handleDeselect = () => {
    const deselected = products?.map((product: IProduct) => {
      if (product?.selected == true) {
        delete product.selected;
      }
      return product;
    });
    setProducts(deselected);
    setSelect(false);
  };

  const { deletedProduct, initiateDelete } = useDeleteProduct();

  const confirmDelete = () => {
    const toDelete = filteredProducts
      ?.filter((product) => product?.selected)
      ?.map((product: any) => ({
        ...product,
        label: product.name,
        status: 'incomplete',
      })) ?? [];

    setModified(toDelete);

    const confirmDeleteModal = {
      title: `Delete ${selected} Products?`,
      statements: [
        {
          label: 'Delete',
          onClick: async () => {
            setLoader({ active: true, body: `Deleting products...` });

            for (let i = 0; i < toDelete.length; i++) {
              try {
                const currentProduct = toDelete[i];
                await initiateDelete(currentProduct);
                toDelete[i].status = deletedProduct ? 'complete' : 'error';
              } catch (error) {
                toDelete[i].status = 'error';
                console.error(`Error deleting product ${toDelete[i].id}:`, error);
              }
            }

            setLoader({ active: false });

            openModal({
              title: 'Delete Completed',
              children: (
                <ol>
                  {toDelete?.map((p) => (
                    <li key={p.id}>
                      {p.name} - {p.status}
                    </li>
                  ))}
                </ol>
              ),
            });
          },
        },
        { label: 'Cancel', onClick: handleDeselect, closeModal },
      ],
      body: (
        <ol>
          {toDelete?.map((p) => (
            <li key={p.id}>
              {p.name} - {p.id}
            </li>
          ))}
        </ol>
      ),
    };

    openModal({ confirm: confirmDeleteModal });
  };

  const onSelect = (product: IProduct) => {
    if (!product.id) return;
    const updated = filteredProducts?.map((item: any) => {
      if (item.name == product.name && item.price_id == product.price_id) {
        item.selected = !item?.selected;
      }
      return item;
    });

    setFilteredProducts(updated);
  };

  const handleSearch = useCallback(
    (searchTerm: string) => {
      clearTimeout(searchTimeout.current);

      searchTimeout.current = setTimeout(() => {
        if (!searchTerm) {
          setFilteredProducts(products);
        } else {
          const filtered = products?.filter(product => {
            return Object.values(product).some(value =>
              typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
            );
          });
          setFilteredProducts(filtered);
        }
      }, 1500);
    },
    [products]
  );

  const handleSearchChange = (searchData: string) => {
    setSearchTerm(searchData);
    handleSearch(searchData);
  };

  
    // Function to dynamically extract unique 'mid' values from products
    const getUniqueMids = (products:any[]) => {
      const mids = products?.map((product:any) => product.mid).filter(mid => mid); // Filter out undefined 'mid'
      return Array.from(new Set(mids)); // Remove duplicates
    };
  
    // Adding 'mid' as a filter
    const handleFilterChange = (field: IFormField) => {
      const filtArr = field.name.split('-');
      const filterName = filtArr[1] || field.label;
      const filterParent = filtArr[0];
      if (!filterName || !products) return;
  
      if (filterParent === 'visibility') {
        let newProducts;
        if (filterName === 'active') {
          newProducts = products.filter(product => product.active);
        } else if (filterName === 'inactive') {
          newProducts = products.filter(product => !product.active);
        } else {
          newProducts = products; // handle 'everything' case
        }
        setFilteredProducts(newProducts);
      } else if (filterParent === 'mid') {
        if(filterName=='all'){
          return setFilteredProducts(products)
        }
        const newProducts = products.filter((product:any) => product?.mid === filterName);
        setFilteredProducts(newProducts);
        console.log({ filterName, newProducts });
      }
    };
  
    // Get unique 'mid' values for filters
    const midOptions = getUniqueMids(products||[]).map(mid => ({
      label: mid,
      name: `mid-${mid}`,
    })).concat([{label:'all',name:'mid-all'}]).reverse();

  

  const pageContext: any = {
    list: {
      actions: ['add', 'edit'],
      view: (
        <>
          <AdapTable
            onSelect={select ? onSelect : undefined}
            options={{ tableTitle: 'admin products', hideColumns: ['id', 'selected', 'price_id'] }}
            data={filteredProducts}
            filters={
              {
                visibility:[
                  {
                    label:'everything',
                    name:'visibility-everything'
                  },
                  {
                    label:'active',
                    name:'visibility-active'
                  },
                  {
                    label:'inactive',
                    name:'visibility-inactive'
                  }
                ],
                merchant: midOptions,
              }
            } // Define filter options
            setFilter={handleFilterChange}
            search={searchTerm}
            setSearch={handleSearchChange}
            onRowClick={onRowClick}
          />
        </>
      )
    },
    add: {
      actions: ['list'],
      view: <AdminProduct />
    },
    product: {
      actions: ['list'],
      view: <AdminProduct setView={() => setView('list')} product={product} />
    }
  };

  const ProductService = getService<IProductService>('IProductService');
  const { mid } = environment.merchant;

  async function getProducts() {
    if (products || Boolean(products && view === 'list')) return;
    try {
      const productsResponse = await ProductService.getProducts();
      setExtras({
        total: productsResponse.data?.length,
        livemode: productsResponse?.data[0]?.livemode,
        has_more: productsResponse.has_more
      });

      const formattedProducts = productsResponse?.data.map((field: any) => {
        const notActive = field.active === false;
        const notAllowed = Boolean(field.metadata.mid !== mid && user.type !== 'admin-3');
        if (notAllowed && notActive) return;
        let context: any = {
          id: field.id,
          image: field.images,
          name: field.name,
          type: field.type,
          price_id: field.price.id,
          price: numberToUsd(field.price.unit_amount),
          livemode: JSON.stringify(field.livemode),
          timeline: (
            <div className='heiarchy'>
              <div className='heiarchy-item'>
                <div>created</div>
                <div>{dateFormat(field.created, { isTimestamp: true })}</div>
              </div>
              <div className='heiarchy-item'>
                <div>updated</div>
                <div>{dateFormat(field.updated, { isTimestamp: true })}</div>
              </div>
            </div>
          ),
        };
        if (user.type === 'admin-3') {
          context.mid = field.metadata.mid;
          context.active = field.active;
        }
        return context;
      });
      setProducts(formattedProducts.filter((y: any) => y));
      setFilteredProducts(formattedProducts.filter((y: any) => y));
    } catch (e: any) {
      console.log('[ ADMIN PRODUCTS ( ERROR ) ]', e);
    } finally {
      setView('list');
    }
  }

  const handleAction = (actionName: string) => {
    switch (actionName) {
      case 'edit':
        setSelect(!select);
        break;
      default:
        setView(actionName);
        break;
    }
  };

  useEffect(() => { getProducts() }, [setProducts]);

  if (products) return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-products'>
        <div className='admin-products__header'>
          <div className='admin-products__header--left'>
            <div className='heiarchy'>
              {responseExtras && Object.entries(responseExtras)?.map(([k, v]) => (
                <div key={k} className='heiarchy__item'>
                  <div className='heiarchy-key'>{k}</div>
                  <div className='heiarchy-value'>{v?.toString()}</div>
                </div>
              ))}
            </div>
          </div>
          <div className='admin-products__header--right'>
            {
              pageContext[view].actions.map(
                (action: string) => (
                  <div key={action}><UiButton onClick={() => handleAction(action)}>{action}</UiButton></div>
                ))
            }
            {selected != false && <div>
              <UiButton label='coming soon' onClick={confirmDelete} variant='primary'>{selected} items</UiButton> 
            </div> || ''} 
          </div> 
        </div> 
        {pageContext[view].view} 
      </div> 
    </>
  );

  return <UiLoader />;
};

export default AdminProducts;
