import React, { useEffect, useState } from 'react';
import styles from './ProductTable.scss';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import UiSelect from '@webstack/components/UiSelect/UiSelect';
import UiButton from '@webstack/components/UiButton/UiButton';

// Remember to create a sibling SCSS file with the same name as this component
interface ProductTableProps {
    products: any;
    hasMore?: boolean;
    firstPage?: boolean;
    onClick?: any;
}
const ProductTable = ({ products, onClick, hasMore, firstPage }: ProductTableProps) => {
    const [filters, setFilters] = useState<any>({
        categories: {
        },
        types:{
        }
    });
    const metaMaker = () => {

        products.map((element: { metadata:any }) => {
            if(!Object.keys(filters.categories).includes(element.metadata.category)){
                let uniqCats = filters.categories;
                let uniqTypes = filters.types;
                uniqCats[element.metadata.category]={selected: true};
                uniqTypes[element.metadata.type]={selected: true};
                setFilters({...filters, categories: uniqCats});
            }
            if(element?.metadata && !Object.keys(filters.types).includes(element.metadata.type)){
                let uniqTypes = filters.types;
                uniqTypes[element.metadata.type]={selected: true};
                setFilters({...filters, types: uniqTypes});
            }
        });
    }
    const handleCategorySelect = (category: string) => {
        let newCats = filters.categories;
        newCats[category]={ selected: !filters.categories[category].selected }
        setFilters({ ...filters, categories: newCats});
    }
    const handleTypeSelect = (type: string) => {
        let newTypes = filters.types;
        newTypes[type]={ selected: !filters.types[type].selected }
        setFilters({ ...filters, types: newTypes});
    }
    function getSelectedCategories(filter:any) {
        const entries = Object.entries(filter);
        const selectedEntries = entries.filter(([key, value]:any) => value.selected);
    
        if (entries.length === selectedEntries.length) {
            return "all";
        }
    
        return selectedEntries.map(([key, value]) => key).join(', ');
    }
    useEffect(() => {
        metaMaker()
    }, [ hasMore ])
    return (
        <>
            <style jsx>{styles}</style>
            {/* {JSON.stringify(filters)} */}
            <div className="product-table">
              <div className='product-table__header'>
                    <div className='product-table__filters'>
                        <UiSelect
                            variant="dark"
                            onSelect={handleCategorySelect}
                            label="categories"
                            options={Object.keys(filters?.categories)?.map((element: any) => {
                                return element
                            })}
                            title={getSelectedCategories(filters?.categories)}
                            value={getSelectedCategories(filters?.categories)}
                        />
                        <UiSelect
                            variant="dark"
                            onSelect={handleTypeSelect}
                            label="types"
                            options={Object.keys(filters?.types)?.map((element: any) => {
                                return element
                            })}
                            title={getSelectedCategories(filters?.types)}
                            value={getSelectedCategories(filters?.types)}
                        />
                    </div>
                </div>
                  <AdaptGrid xs={1} md={3} gap={10}>
                    {Object.entries(products).length && Object.entries(products).map(([key, product]: any) => {
                        if (filters.categories[product.metadata.category]?.selected && filters.types[product.metadata.type]?.selected  ) {
                            return <div className="product-table__product" key={key}>
                                {product?.id}
                                {product?.images}
                                {product?.name}
                                {JSON.stringify(product.metadata)}<hr />
                                {filters.categories[product.metadata.category]?.selected?.toString()}
                            </div>
                        }
                    })}
                </AdaptGrid>
                <div className="product-table__footer">
                    {!firstPage && <UiButton onClick={()=>onClick(`?ending_before=${products[0].price_object.id}`)} >Previous</UiButton>}
                    {hasMore && <UiButton onClick={()=>onClick(`?starting_after=${products[products.length - 1].price_object.id}`)} >Next</UiButton>}
                </div>
            </div>
        </>
    );
};

export default ProductTable;