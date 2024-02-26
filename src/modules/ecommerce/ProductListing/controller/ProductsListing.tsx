import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import styles from "./ProductsListing.scss";
import { getService } from "@webstack/common";
import ProductSlider from "../views/ProductSlider/ProductSlider";
import { dateFormat, numberToUsd } from "@webstack/helpers/userExperienceFormats";
import { useUser } from '~/src/core/authentication/hooks/useUser';
import IProductService from "~/src/core/services/ProductService/IProductService";
import ProductChapters from "../views/ProductChapters/ProductChapters";
import { useLoader } from "@webstack/components/Loader/Loader";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import Image from "next/image";
import environment from "~/src/environment";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import ProductList from "../views/ProductList/ProductList";

interface Filter {
  [key: string]: {
    [key: string]: { selected: boolean };
  };
}

const mockProducts = [{ "id": "prod_PDLOly1ARxP9ZO", "object": "product", "active": true, "attributes": [], "created": 1702959306, "default_price": "price_1OOuhyIodeKZRLDVHXlzwQbo", "description": "solidify your place in line to get your medium box", "features": [], "images": [], "livemode": true, "metadata": { "mid": "nirv1" }, "name": "medium box", "package_dimensions": null, "shippable": null, "statement_descriptor": null, "tax_code": "txcd_10000000", "type": "service", "unit_label": null, "updated": 1702959319, "url": null, "price": { "id": "price_1OOuhyIodeKZRLDVHXlzwQbo", "object": "price", "active": true, "billing_scheme": "per_unit", "created": 1702959306, "currency": "usd", "custom_unit_amount": null, "livemode": true, "lookup_key": null, "metadata": {}, "nickname": "", "product": "prod_PDLOly1ARxP9ZO", "recurring": null, "tax_behavior": "exclusive", "tiers_mode": null, "transform_quantity": null, "type": "one_time", "unit_amount": 10000, "unit_amount_decimal": "10000" } }, { "id": "prod_P5rw5TZ4rOQpUA", "object": "product", "active": true, "attributes": [], "created": 1701235270, "default_price": "price_1OMLyBIodeKZRLDVuoC12whs", "description": "Start Date: November 30, 2023, End Date: May 30, 2023", "features": [], "images": [
  "https://files.stripe.com/links/MDB8YWNjdF8xRzM4SVhJb2RlS1pSTERWfGZsX2xpdmVfc1QyY3lvRUdGS2NwQjZUeHlNUkxJYm9i0080oSMGPF"
], "livemode": true, "metadata": { "clearance": "6", "mid": "mb1", "t-10_cleanliness": "The Tenant must maintain cleanliness and good condition of their room, house, and yard. They are responsible for disposing of garbage, cleaning personal messes, and shared areas, including dishes and countertops. Tenants will also assist with household chores like taking out the trash and floor cleaning. If living standards decline, a chore list will be implemented. Trash day is every Tuesday, and tenants must ensure trash is curbside before 11:00 am.", "t-11_quiet-hours": "The Tenant acknowledges and agrees that loud noise or excessive light is prohibited after midnight unless mutually discussed and agreed upon with roommates.\nNO SMOKING: Smoking is strictly prohibited inside the house. If the Tenant violates this provision, a cleaning fee of up to $1000 may be added to the monthly rent cost to cover the costs of odor removal and cleaning.", "t-12_governing-law": "This Agreement shall be governed by and construed in accordance with the laws of the state of UTAH without regard to its conflict of laws principles.", "t-13_entire-agreement": "This Agreement contains the entire agreement between the Parties and supersedes any other agreements or understandings, whether written or oral, relating to the Property. Any modifications to this Agreement must be made in writing and signed by both Parties.", "t-14_termination-by-tenant": "A 30 day notice is required for the tenant to move out and rent must be paid in full for the remainder of the tenants stay..", "t-1_property": "The Landlord, agrees to rent out a single room located at 2731 Juniper Way, Holladay, UT 84117 (hereinafter referred to as the \"Property\").", "t-2_term": "The term of this Agreement shall commence on the following Start Date, and shall continue in entirety to the End Date. The Tenant's occupancy shall be limited to the aforementioned single room.", "t-3_rent-payment": "The Tenant, agrees to pay a monthly rent of the Amount designated on this form on or before the 1st day of each month. The payment shall be made via [Payment Method], payable to the Landlord or as instructed by the Landlord. Rent is due in its entirety unless discussed with the Landlord.", "t-4_utilities": "The Tenant shall be responsible for the payment of utilities, including gas, electricity, internet, water, and waste. The cost of utilities shall be variable and shall be paid directly by the Tenant to the respective service providers.", "t-5_security-deposit": "The Tenant shall provide a security deposit equivalent to 1 month's rent, which amounts to $800, upon signing this Agreement. The security deposit shall be held by the Landlord as security for any damages caused by the Tenant beyond normal wear and tear. The deposit will be returned to the Tenant within 30 days after the termination of this Agreement, subject to any deductions for unpaid rent or damages.", "t-6_property-damage": "The Tenant shall be held responsible for any damage caused to the Property, including the house and neighboring structures, during the term of this Agreement. The Tenant agrees to reimburse the Landlord, for the cost of repair or replacement of damaged property.", "t-7_termination-by-landlord": "The Landlord reserves the right to terminate this Agreement for any reason. In the event of termination, the Tenant shall be given a written notice of termination and shall have 24 hours to vacate the Property.", "t-8_guest-notification": "The Tenant agrees to notify all roommates at least 1 hour before bringing any guests onto the Property. The Tenant shall obtain consent from roommates for overnight guests and shall ensure that guests comply with the terms of this Agreement.", "t-9_parking": "The Tenant will be provided with off road parking under a first come first serve basis. The Tenant will agree to not block the garage for prolonged amounts of time and if they do, they will be available to move their car if other tenants need to exit the garage.", "type": "document" }, "name": "Rental Agreement", "package_dimensions": null, "shippable": null, "statement_descriptor": null, "tax_code": "txcd_10000000", "type": "service", "unit_label": null, "updated": 1702349244, "url": null, "price": { "id": "price_1OMLyBIodeKZRLDVuoC12whs", "object": "price", "active": true, "billing_scheme": "per_unit", "created": 1702349115, "currency": "usd", "custom_unit_amount": null, "livemode": true, "lookup_key": null, "metadata": {}, "nickname": null, "product": "prod_P5rw5TZ4rOQpUA", "recurring": { "aggregate_usage": null, "interval": "month", "interval_count": 1, "trial_period_days": null, "usage_type": "licensed" }, "tax_behavior": "exclusive", "tiers_mode": null, "transform_quantity": null, "type": "recurring", "unit_amount": 80000, "unit_amount_decimal": "80000" } }, {
  "id": "prod_P5lI35r2EWTAxi", "object": "product", "active": true, "attributes": [], "created": 1701210554, "default_price": "price_1OHZmJIodeKZRLDVUeSlY6M7", "description": null, "features": [],
  "images": [
    "https://files.stripe.com/links/MDB8YWNjdF8xRzM4SVhJb2RlS1pSTERWfGZsX2xpdmVfc1QyY3lvRUdGS2NwQjZUeHlNUkxJYm9i0080oSMGPF",
    "https://files.stripe.com/links/MDB8YWNjdF8xRzM4SVhJb2RlS1pSTERWfGZsX2xpdmVfc1QyY3lvRUdGS2NwQjZUeHlNUkxJYm9i0080oSMGPF",
    "https://files.stripe.com/links/MDB8YWNjdF8xRzM4SVhJb2RlS1pSTERWfGZsX2xpdmVfc1QyY3lvRUdGS2NwQjZUeHlNUkxJYm9i0080oSMGPF"
  ], "livemode": true, "metadata": { "mid": "nirv1" }, "name": "offgrid box", "package_dimensions": null, "shippable": null, "statement_descriptor": null, "tax_code": "txcd_10000000", "type": "service", "unit_label": null, "updated": 1701210555, "url": null, "price": { "id": "price_1OHZmJIodeKZRLDVUeSlY6M7", "object": "price", "active": true, "billing_scheme": "per_unit", "created": 1701210555, "currency": "usd", "custom_unit_amount": null, "livemode": true, "lookup_key": null, "metadata": {}, "nickname": null, "product": "prod_P5lI35r2EWTAxi", "recurring": null, "tax_behavior": "exclusive", "tiers_mode": null, "transform_quantity": null, "type": "one_time", "unit_amount": 10000, "unit_amount_decimal": "10000" }
}, { "id": "prod_Lg9ZQfQK3hGlXk", "object": "product", "active": true, "attributes": [], "created": 1652405127, "default_price": null, "description": null, "features": [], "images": [], "livemode": true, "metadata": {}, "name": "Labor - Business Card", "package_dimensions": null, "shippable": null, "statement_descriptor": null, "tax_code": null, "type": "service", "unit_label": null, "updated": 1652405128, "url": null, "price": { "id": "price_1KynXpIodeKZRLDVpBoqMwsT", "object": "price", "active": true, "billing_scheme": "per_unit", "created": 1652406233, "currency": "usd", "custom_unit_amount": null, "livemode": true, "lookup_key": null, "metadata": {}, "nickname": null, "product": "prod_Lg9ZQfQK3hGlXk", "recurring": null, "tax_behavior": "exclusive", "tiers_mode": null, "transform_quantity": null, "type": "one_time", "unit_amount": 2721, "unit_amount_decimal": "2721" } }, { "id": "prod_Lg9ZQfQK3hGlXk", "object": "product", "active": true, "attributes": [], "created": 1652405127, "default_price": null, "description": null, "features": [], "images": [], "livemode": true, "metadata": {}, "name": "Labor - Business Card", "package_dimensions": null, "shippable": null, "statement_descriptor": null, "tax_code": null, "type": "service", "unit_label": null, "updated": 1652405128, "url": null, "price": { "id": "price_1KynH8IodeKZRLDVLPMJvidW", "object": "price", "active": true, "billing_scheme": "per_unit", "created": 1652405198, "currency": "usd", "custom_unit_amount": null, "livemode": true, "lookup_key": null, "metadata": {}, "nickname": null, "product": "prod_Lg9ZQfQK3hGlXk", "recurring": null, "tax_behavior": "exclusive", "tiers_mode": null, "transform_quantity": null, "type": "one_time", "unit_amount": 1800, "unit_amount_decimal": "1800" } }, { "id": "prod_Lg9ZQfQK3hGlXk", "object": "product", "active": true, "attributes": [], "created": 1652405127, "default_price": null, "description": null, "features": [], "images": [], "livemode": true, "metadata": {}, "name": "Labor - Business Card", "package_dimensions": null, "shippable": null, "statement_descriptor": null, "tax_code": null, "type": "service", "unit_label": null, "updated": 1652405128, "url": null, "price": { "id": "price_1KynG0IodeKZRLDVAdFj6GNx", "object": "price", "active": true, "billing_scheme": "per_unit", "created": 1652405128, "currency": "usd", "custom_unit_amount": null, "livemode": true, "lookup_key": null, "metadata": {}, "nickname": null, "product": "prod_Lg9ZQfQK3hGlXk", "recurring": null, "tax_behavior": "exclusive", "tiers_mode": null, "transform_quantity": null, "type": "one_time", "unit_amount": 2500, "unit_amount_decimal": "2500" } }, { "id": "prod_LcN7vPRm82iHWY", "object": "product", "active": true, "attributes": [], "created": 1651532968, "default_price": null, "description": null, "features": [], "images": [], "livemode": true, "metadata": {}, "name": "Toll Free Phone Number Line", "package_dimensions": null, "shippable": null, "statement_descriptor": null, "tax_code": "txcd_10000000", "type": "service", "unit_label": null, "updated": 1696842553, "url": null, "price": { "id": "price_1Kv8O0IodeKZRLDV6Kx9RC0b", "object": "price", "active": true, "billing_scheme": "per_unit", "created": 1651533036, "currency": "usd", "custom_unit_amount": null, "livemode": true, "lookup_key": null, "metadata": {}, "nickname": null, "product": "prod_LcN7vPRm82iHWY", "recurring": null, "tax_behavior": "exclusive", "tiers_mode": null, "transform_quantity": null, "type": "one_time", "unit_amount": 3500, "unit_amount_decimal": "3500" } }, { "id": "prod_LcN7vPRm82iHWY", "object": "product", "active": true, "attributes": [], "created": 1651532968, "default_price": null, "description": null, "features": [], "images": [], "livemode": true, "metadata": {}, "name": "Toll Free Phone Number Line", "package_dimensions": null, "shippable": null, "statement_descriptor": null, "tax_code": "txcd_10000000", "type": "service", "unit_label": null, "updated": 1696842553, "url": null, "price": { "id": "price_1Kv8MuIodeKZRLDVgy05I3Hr", "object": "price", "active": true, "billing_scheme": "per_unit", "created": 1651532968, "currency": "usd", "custom_unit_amount": null, "livemode": true, "lookup_key": null, "metadata": {}, "nickname": null, "product": "prod_LcN7vPRm82iHWY", "recurring": null, "tax_behavior": "exclusive", "tiers_mode": null, "transform_quantity": null, "type": "one_time", "unit_amount": 2400, "unit_amount_decimal": "2400" } }, { "id": "prod_KaJjdc2gSx8W3j", "object": "product", "active": true, "attributes": [], "created": 1636759458, "default_price": null, "description": "Custom Email Routed with Google and Includes Additional Google Apps (Drive, Team Mgmt, Sheets, Docs, etc. )", "features": [], "images": [], "livemode": true, "metadata": {}, "name": "Custom Email", "package_dimensions": null, "shippable": null, "statement_descriptor": null, "tax_code": null, "type": "service", "unit_label": null, "updated": 1636759458, "url": null, "price": { "id": "price_1Jv99kIodeKZRLDVisjDvbyr", "object": "price", "active": true, "billing_scheme": "per_unit", "created": 1636759660, "currency": "usd", "custom_unit_amount": null, "livemode": true, "lookup_key": null, "metadata": {}, "nickname": null, "product": "prod_KaJjdc2gSx8W3j", "recurring": null, "tax_behavior": "inclusive", "tiers_mode": null, "transform_quantity": null, "type": "one_time", "unit_amount": 800, "unit_amount_decimal": "800" } }, { "id": "prod_KaJjdc2gSx8W3j", "object": "product", "active": true, "attributes": [], "created": 1636759458, "default_price": null, "description": "Custom Email Routed with Google and Includes Additional Google Apps (Drive, Team Mgmt, Sheets, Docs, etc. )", "features": [], "images": [], "livemode": true, "metadata": {}, "name": "Custom Email", "package_dimensions": null, "shippable": null, "statement_descriptor": null, "tax_code": null, "type": "service", "unit_label": null, "updated": 1636759458, "url": null, "price": { "id": "price_1Jv96VIodeKZRLDVSDx93f6U", "object": "price", "active": true, "billing_scheme": "per_unit", "created": 1636759459, "currency": "usd", "custom_unit_amount": null, "livemode": true, "lookup_key": null, "metadata": {}, "nickname": null, "product": "prod_KaJjdc2gSx8W3j", "recurring": { "aggregate_usage": null, "interval": "month", "interval_count": 1, "trial_period_days": null, "usage_type": "licensed" }, "tax_behavior": "unspecified", "tiers_mode": null, "transform_quantity": null, "type": "recurring", "unit_amount": 800, "unit_amount_decimal": "800" } }];

const ProductsListing: NextPage = () => {
  const [loader, setLoader] = useLoader();
  const user = useUser();
  const [filters, setFilters] = useState<Filter>({ categories: {}, types: {} });
  // const [products, setProducts] = useState<any[]>(mockProducts);
  const [products, setProducts] = useState<any[]>();
  const [hasMore, setHasMore] = useState<boolean>(false);
  const ProductService = getService<IProductService>("IProductService");
  const getSelectedCategories = (filter: any) => {
    const selectedEntries = Object.entries(filter).filter(([, value]: any) => value.selected);
    if (selectedEntries.length === 0) return "all";
    return selectedEntries.map(([key]) => key).join(", ");
  };

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
    const fetchProducts = async () => {
      !loader.active && setLoader({ active: true, body: 'loding products', animation: true });
      try {
        const memberResponse = await ProductService.getProducts();
        const fetchedProducts: any = memberResponse?.data;
        if (fetchedProducts) {
          // const formatted = fetchedProducts
          // // .filter((product: any)=>product?.metadata?.mid == merchantId)
          // .map((product: any) => ({
          //   id: product.id,
          //   description: product.description,
          //   name: product.name,
          //   created: dateFormat(product.price.created, { isTimestamp: true }),
          //   images: product.images[0],
          //   price: product.price,
          //   type: product.type,
          //   metadata: product.metadata
          // }));
          setHasMore(memberResponse.has_more);
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      finally { setLoader({ active: false }); }
    };

    if (!products) fetchProducts();
  }, [setProducts]);

  return (<>
    <style jsx>{styles}</style>
    <div className="product-listing">
      {/* <ProductChapters/> */}
      {/* <div className="product-listing__header">
        <div className="product-listing__filters">
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
      </div> */}
      <ProductList products={products} />
    </div>
  </>
  );
};

export default ProductsListing;

// Choose your nirvana

// ON SUBMIT Add to POSTGRES

// Contact Info
// Package info

