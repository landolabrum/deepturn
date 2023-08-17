import React, { useEffect, useState } from 'react';
import styles from './ProductTable.scss';
import UiSelect from '@webstack/components/UiSelect/UiSelect';
import UiButton from '@webstack/components/UiButton/UiButton';
import ProductSlider from '../ProductSlider/ProductSlider';

interface ProductTableProps {
    products: any;
    hasMore?: boolean;
    firstPage?: boolean;
    onClick?: any;
}

interface Filter {
    [key: string]: {
        [key: string]: { selected: boolean };
    };
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onClick, hasMore, firstPage }) => {
    const [filters, setFilters] = useState<Filter>({
        categories: { test: { selected: true }, social: { selected: true } },
        types: { undefined: { selected: false }, saas: { selected: true } },
    });
    const [visibleProducts, setVisibleProducts] = useState<any>(products);

    const updateFilters = (filterKey: keyof Filter, value: string) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterKey]: {
                ...prevFilters[filterKey],
                [value]: { selected: !prevFilters[filterKey][value]?.selected }
            }
        }));
    };

    useEffect(() => {
        const uniqCats = { ...filters.categories };
        const uniqTypes = { ...filters.types };
        products.forEach((element: { metadata: any }) => {
            uniqCats[element.metadata.category] = { selected: true };
            uniqTypes[element.metadata.type] = { selected: true };
        });
        setFilters({ categories: uniqCats, types: uniqTypes });
    }, [hasMore]);

    useEffect(() => {
        const filteredProducts = products.filter((product: any) => {
            return filters.categories[product.metadata.category]?.selected && filters.types[product.metadata.type]?.selected;
        });
        setVisibleProducts(filteredProducts);
    }, [filters, products]);

    const getSelectedCategories = (filter: any) => {

        const entries = Object.entries(filter);
        const selectedEntries = entries.filter(([_, value]:any) =>  value.selected);
        if (entries.length === selectedEntries.length) {
            return "all";
        }
        return selectedEntries.map(([key]) => key).join(', ');
    };

    return (
        <>
            <style jsx>{styles}</style>
            <div className="product-table">
                <div className="product-table__header">
                    <div className="product-table__filters">
                        {['categories', 'types'].map(filterKey => (
                            <UiSelect
                                key={filterKey}
                                variant="dark"
                                onSelect={(value) => updateFilters(filterKey as keyof Filter, value)}
                                label={filterKey}
                                options={Object.keys(filters[filterKey])}
                                title={getSelectedCategories(filters[filterKey])}
                                value={getSelectedCategories(filters[filterKey])}
                            />
                        ))}
                    </div>
                </div>
                <ProductSlider products={visibleProducts} />
                <div className="product-table__footer">
                    {!firstPage && <UiButton onClick={() => onClick(`?ending_before=${products[0].price_object.id}`)}>Previous</UiButton>}
                    {hasMore && <UiButton onClick={() => onClick(`?starting_after=${products[products.length - 1].price_object.id}`)}>Next</UiButton>}
                </div>
            </div>
        </>
    );
};

export default ProductTable;
