import React from "react";
import { serviceProvider } from "@webstack/common";
import ModalService from "@webstack/services/ModalService/ModalService";
import environment from "~/src/environment";
import MemberService from "~/src/core/services/MemberService/MemberService";
import ShoppingService from "~/src/core/services/ShoppingService/ShoppingService";
import LicensingService from "~/src/core/services/LicensingService/LicensingService";
import DistributorService from "~/src/core/services/DistributerService/DistributorService";

interface IProps { }
export default class ServiceContainer extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    const mock = environment.devSettings?.mockApis;
    serviceProvider.registerService("IModalService", ModalService);
    serviceProvider.registerService("IMemberService", MemberService);
    serviceProvider.registerService("IShoppingService", ShoppingService);
    serviceProvider.registerService("ILicensingService", LicensingService);
    serviceProvider.registerService("IDistributorService", DistributorService);
  }

  render() {
    return <></>;
  }
}
