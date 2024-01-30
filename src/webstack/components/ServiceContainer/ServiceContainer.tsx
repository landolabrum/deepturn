import React from "react";
import { serviceProvider } from "@webstack/common";
import environment from "~/src/environment";
import MemberService from "~/src/core/services/MemberService/MemberService";
import ShoppingService from "~/src/core/services/ShoppingService/ShoppingService";
import HomeService from "~/src/core/services/HomeService/HomeService";
import AdminService from "~/src/core/services/AdminService/AdminService";
import DocumentService from "~/src/core/services/DocumentService/DocumentService";

interface IProps { }
export default class ServiceContainer extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    const mock = environment.devSettings?.mockApis;
    serviceProvider.registerService("IMemberService", MemberService);
    serviceProvider.registerService("IShoppingService", ShoppingService);
    serviceProvider.registerService("IHomeService", HomeService);
    serviceProvider.registerService("IAdminService", AdminService);
    serviceProvider.registerService("IDocumentService", DocumentService);
  }

  render() {
    return <></>;
  }
}
