import { useEffect, useState } from "react";
import styles from "./MemberDetailsPage.scss";
import AdapTable from "@webstack/components/AdapTable/views/AdapTable";
import { getService } from "@webstack/common";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import { useHeader } from "@shared/components/Header/views/Header";
import { LinkProvider } from "@webstack/components/UiButton/UiButton";
import { MemberLicensesResponse } from "~/src/core/services/LicensingService/LicensingService";
import ILicensingService from "~/src/core/services/LicensingService/ILicensingService";
import AdaptTableCell, { NaCell } from "@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell";
import { useSearch } from "@webstack/components/AdapTable/hooks/useSearch";
import IShoppingService from "~/src/core/services/ShoppingService/IShoppingService";
import PartnerIcon from "@shared/components/PartnerIcon/PartnerIcon";
import keyStringConverter from "@webstack/helpers/keyStringConverter";
import { dateFormat, phoneFormat } from "@webstack/helpers/userExperienceFormats";
import MemberDetailsModal from "../../views/MemberDetailsModal/MemberDetailsModal";
import { OrderHistoryResponse } from "~/src/models/shopping/MemberOrderHistory";

const RESET_FILTER_KEY = "all licenses";
const MEMBER_DETAIL_KEYS = ["memberId", "email", "phone", "country", "dateJoined", "lastLogin"];

interface IProps {
  memberId: string;
}
type License = {
  type: React.ReactElement;
  startDate: React.ReactElement;
  expirationDate: React.ReactElement;
  licenseTypeName?: string;
};

export default function MemberDetailsPage({ memberId }: IProps) {
  const [header, setHeader] = useHeader();
  const [filters, setFilters] = useState<{ licenseType: string[] } | null>(null);
  const memberService = getService<IMemberService>("IMemberService");
  const shoppingService = getService<IShoppingService>("IShoppingService");
  const [orderHistory, setOrderHistory] = useState<OrderHistoryResponse | null>(null);
  const licenseService = getService<ILicensingService>("ILicensingService");
  const [licenses, setLiceneses] = useState<License[] | null>(null);
  const [licenseSearch, setLicenseSearch] = useSearch(localLicensesSearch);
  const showOrderHistoryModal = MemberDetailsModal();

  function localLicensesSearch(searchCriteria: string) {
    const returnData: any = [];
    const localSearch = (newLicenses: License[] | null) =>
      newLicenses?.filter((item: any) => {
        for (const key of Object.keys(item)) {
          if (item?.keywords.toLowerCase().includes(searchCriteria.toLowerCase())) returnData.push(item);
        }
        setLiceneses(returnData);
      });
    if (searchCriteria !== "" && searchCriteria !== RESET_FILTER_KEY) {
      const promise = new Promise<License[] | null>((resolve) => {
        getMemberLicenses().then((licenses: any) => {
          resolve(licenses);
        });
      });
      promise.then((licenses) => {
        localSearch(licenses);
      });
    } else {
      localSearch(licenses);
    }
  }

  async function getMemberProfileInformation() {
    const memberResponse = await memberService.getMemberProfileInformation(memberId);
    if (memberResponse === null) throw new Error("Unable to load Personal Information");
    if (header?.title !== memberResponse.fullName) {
      setHeader({
        title: memberResponse.fullName,
        breadcrumbs: [{ label: "members" }, { label: memberResponse.fullName }],
        subheader: (
          <>
            <style jsx>{styles}</style>
            <div className="report-details_subheader">
              {memberResponse &&
                Object.entries(memberResponse).map(([key, value]: any, index: number) => {
                  if (MEMBER_DETAIL_KEYS.includes(key))
                    return (
                      <div key={index + key} className="report-details_subheader-column">
                        <div className="report-details_subheader-key">{keyStringConverter(key)}</div>
                        <div className="report-details_subheader-value">
                          {!["phone", "email"].includes(key) && (value ? value : <NaCell />)}
                          {/* PHONE */}
                          {key === "phone" &&
                          typeof phoneFormat(value, memberResponse.countryPhoneCode) === "string" ? (
                            <span className="report-details__subheader-link">
                              {" "}
                              <LinkProvider href={`tel:${value}`}>
                                {phoneFormat(value, memberResponse.countryPhoneCode)}
                              </LinkProvider>
                            </span>
                          ) : (
                            key === "phone" && phoneFormat(value, memberResponse.countryPhoneCode)
                          )}
                          {/* EMAIL */}
                          {key === "email" ? (
                            <span className="report-details__subheader-link">
                              <LinkProvider href={`mailto:${value}`}>{value}</LinkProvider>
                            </span>
                          ) : (
                            key === "email" && <NaCell />
                          )}
                        </div>
                      </div>
                    );
                })}
            </div>
          </>
        ),
      });
    }
  }

  async function getMemberLicenses() {
    const licenceFormatter = (licensesArray: MemberLicensesResponse[] | null): License[] | undefined => {
      if (!licensesArray) return;

      return licensesArray.map((license) => {
        return {
          keywords: license?.licenseTypeName,
          type: (
            <AdaptTableCell
              data={{ icon: <PartnerIcon icon={license?.licenseTypeName} />, label: license.licenseTypeName }}
              cell="icon-label"
            />
          ),
          startDate: <AdaptTableCell data={license.startDate} cell="date" />,
          expirationDate: <AdaptTableCell data={license.endDate} cell="date" />,
        };
      });
    };
    const licenseResponse = await licenseService.getMemberLicenses(memberId);
    const formatted = licenceFormatter(licenseResponse);
    formatted && setLiceneses(formatted);
    const getUniquelicenseTypeNames = (licenses: any): string[] => {
      const licenseTypeNames: string[] = [];
      licenses.forEach((license: License) => {
        if (license?.licenseTypeName && !licenseTypeNames.includes(license?.licenseTypeName.toLowerCase())) {
          licenseTypeNames.push(license.licenseTypeName.toLowerCase());
        }
      });
      return licenseTypeNames;
    };
    if (licenseResponse) {
      let uniq = [RESET_FILTER_KEY];
      uniq = [...uniq, ...getUniquelicenseTypeNames(licenseResponse)];

      if (Array(uniq).length) {
        setFilters({ licenseType: uniq });
      }
    }
    return formatted;
  }

  async function getMemberOrderHistory() {
    const orderHistoryFormatter = (orderHistoryArray: any | null): any | undefined => {
      if (!orderHistoryArray) return;
      return orderHistoryArray.map((historyItem: any) => {
        return {
          orderId: historyItem.orderId,
          orderDate: dateFormat(historyItem.orderDate),
          transactionHash: (
            <AdaptTableCell
              cell="wallet-address"
              data={{ walletAddress: historyItem.transactionhash, transactionhash: historyItem.transactionhash }}
            />
          ),
          walletAddress: (
            <AdaptTableCell cell="wallet-address" data={{ walletAddress: historyItem.fromWalletAddress }} />
          ),
          orderTotal: (
            <AdaptTableCell
              cell="currency-crypto"
              data={{
                amount: historyItem.orderTotal,
                currencySymbol: historyItem.transactionCurrency,
                status: historyItem.orderStatus,
              }}
            />
          ),
        };
      });
    };
    const memberOrderHistoryResponse = await shoppingService.orderHistory(memberId);
    const formatted = orderHistoryFormatter(memberOrderHistoryResponse);
    setOrderHistory(formatted);
  }
  useEffect(() => {
    if (licenseSearch === "") getMemberLicenses();
    if (!orderHistory) getMemberOrderHistory();
    getMemberProfileInformation();
  }, []);

  return (
    <>
      <style jsx>{styles}</style>
      <AdapTable
        options={{ hide: "footer", tableTitle: "Order History", title: memberId, hideColumns: ["walletAddress"] }}
        data={orderHistory}
        onRowClick={showOrderHistoryModal}
      />
      <br />

    </>
  );
}
