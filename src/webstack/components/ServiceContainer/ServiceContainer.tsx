import React from "react";
import { serviceProvider } from "@webstack/common";
import environment from "~/src/environment";
import CustomerService from "~/src/core/services/CustomerService/CustomerService";
import ProductService from "~/src/core/services/ProductService/ProductService";
import HomeService from "~/src/core/services/HomeService/HomeService";
import AdminService from "~/src/core/services/AdminService/AdminService";
import DocumentService from "~/src/core/services/DocumentService/DocumentService";
import ProspectService from "~/src/core/services/ProspectService/ProspectService";

interface IProps { }
export default class ServiceContainer extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    const mock = environment.devSettings?.mockApis;
    serviceProvider.registerService("ICustomerService", CustomerService);
    serviceProvider.registerService("IProductService", ProductService);
    serviceProvider.registerService("IProspectService", ProspectService);
    serviceProvider.registerService("IHomeService", HomeService);
    serviceProvider.registerService("IAdminService", AdminService);
    serviceProvider.registerService("IDocumentService", DocumentService);
  }

  render() {
    return <></>;
  }
}
