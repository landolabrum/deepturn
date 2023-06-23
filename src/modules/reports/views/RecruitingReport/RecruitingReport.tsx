import { useCallback, useEffect, useState } from "react";
import AdaptGrid from "@webstack/components/AdaptGrid/AdaptGrid";
import type { NextComponentType, NextPageContext } from "next";
import ReportGraph from "../../Components/ReportGraph/ReportGraph";
import ReportSummary from "../../Components/ReportSummary/ReportSummary";
import styles from "./RecruitingReport.scss";
import { getService } from "@webstack/common";
import IMemberService from "~/src/core/services/MemberService/IMemberService";
import DateControl, { DateRangeProps } from "@webstack/components/UiCalendar/components/DateControl/DateControl";
import { getMonthInfo } from "@webstack/components/UiCalendar/components/DateControl/functions/getMonthInfo";
import { dateFormat } from "@webstack/helpers/userExperienceFormats";
import { GetRecruitesResponse } from "~/src/models/membership/Recruites";
import IShoppingService from "~/src/core/services/ShoppingService/IShoppingService";
import IDistributorService from "~/src/core/services/DistributerService/IDistributorService";
import {
  EnrollmentActivityResponse,
  RecentEnrollmentResponse,
} from "~/src/models/membership/Enrollments";
import { NewInfluencersResponse } from "~/src/models/distributor/NewInfluencers";
import stringNum from "@webstack/helpers/stringNumber";
import AdapTable from "@webstack/components/AdapTable/views/AdapTable";
import AdaptTableCell from "@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell";
import { useRequest } from "@webstack/components/AdapTable/hooks/useRequest";
import { keywordGenerator } from "@webstack/helpers/Dictionary";

const INITIAL_DATE_RANGE = 0;
const DEFAULT_REQUEST = {
  searchCriteria: " ",
  limit: 20,
  skip: 0,
};
interface RecruitingReportProps {}
const RecruitingReport: NextComponentType<NextPageContext, {}, RecruitingReportProps> = ({}) => {
  const today = dateFormat(new Date()).toString();
  const memberService = getService<IMemberService>("IMemberService");
  const shoppingService = getService<IShoppingService>("IShoppingService");
  const distributorService = getService<IDistributorService>("IDistributorService");
  const [dateRange, setDateRange] = useState<DateRangeProps>({
    start: dateFormat(new Date(new Date(today).setDate(new Date(today).getDate() - INITIAL_DATE_RANGE))).toString(),
    end: today,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [nodesPurchased, setNodesPurchased] = useState<any>(null);
  const [influencers, setInfluencers] = useState<NewInfluencersResponse | null>(null);
  const [enrollmentActivity, setEnrollmentActivity] = useState<EnrollmentActivityResponse | null>(null);
  const [recruites, setRecruites] = useState<GetRecruitesResponse | null>(null);
  const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollmentResponse | null>(null);
  const [recentEnrollmentsTotal, setRecentEnrollmentsTotal] = useState<number | undefined>();
  const dateFrom = dateFormat(dateRange.start, { server: true }).toString();
  const dateTo = dateFormat(dateRange.end, { server: true }).toString();

  const getRecruites = async () => {
    const response = await memberService.recruitesList({
      dateFrom: dateFrom,
      dateTo: dateTo,
      customDateRange: true,
    });
    if (response) setRecruites(response);
  };

  const getNodesPurchased = async () => {
    const response = await shoppingService.nodesPurchasedByDate({
      dateFrom: dateFrom,
      dateTo: dateTo,
      customDateRange: true,
    });
    if (response) setNodesPurchased(response);
  };
  const getInfluencers = async () => {
    const response = await distributorService.newInfluencers({
      dateFrom: dateFrom,
      dateTo: dateTo,
      customDateRange: true,
    });
    if (response) setInfluencers(response);
  };
  const activityHistory = async () => {
    const response = await memberService.recentEnrollmentActivity();
    if (response.enrollmentsByDate) {
      const enrollmentActivity: any = response.enrollmentsByDate;
      enrollmentActivity.forEach(function ({ date, count }: any, key: number) {
        enrollmentActivity[key].date = dateFormat(date).toString();
      });
      setEnrollmentActivity(enrollmentActivity.reverse());
    }
  };

  const serverEnrollSearch = useCallback(async (req: any) => {
    setLoading(true);
    // if (req.searchCriteria.length < 3) req.searchCriteria = " ";
    const response = await memberService.recentEnrollments(req);
    if (response) {
      let recentEnrollments: any = response.memberRecords.reduce((acc: any, member: any) => {
        acc.push({
          member: (
            <AdaptTableCell
              cell="member"
              data={{ name: member.memberName, id: member.memberId, email: member.emailAddress }}
            />
          ),
          referredBy: member.sponsor ? (
            <AdaptTableCell
              cell="member"
              data={{
                name: member.sponsor.memberName,
                id: member.sponsor.memberId,
                email: member.sponsor.emailAddress,
              }}
            />
          ) : (
            ""
          ),
          signUpDate: dateFormat(member.signUpDate).toString(),
          keywords: keywordGenerator(member),
        });
        return acc;
      }, []);
      setRecentEnrollments(recentEnrollments);
      setRecentEnrollmentsTotal(response.totalRecords);
    }

    setLoading(false);
  }, []);
  //TODO: "fix later, types definition of recentEnrollments"
  const typesBypass: any = recentEnrollments;

  const [request, setRequest] = useRequest(DEFAULT_REQUEST, typesBypass?.length, serverEnrollSearch);
  const handleRequest = (req: any) => {
    setLoading(true);
    setRequest(req);
    setLoading(false);
  };
  const handleLimit:React.SetStateAction<any>=(limit: number)=>{
    handleRequest({...request, skip:0, limit: limit})
  }
  function handleSelect(sort: string) {
    if (sort === "daily") {
      setDateRange({ start: today, end: today });
      // setSortLabel(dateRange.start);
    }
   else  if (['custom','monthly'].includes(sort)) {
      sort === "monthly"&&setDateRange(getMonthInfo(today));
      // setSortLabel(dateFormat(dateRange.start, {format:"MM-YYYY"}).toString());
    }
  }
  const sortLabel = dateRange.start === today?"today":dateRange.start;
  useEffect(() => {
    serverEnrollSearch(DEFAULT_REQUEST);
  }, []);
  useEffect(() => {
    getRecruites();
    getNodesPurchased();
    getInfluencers();
    activityHistory();
  }, [dateTo]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className="recruiting-report__recruiting-report__summary">
        <div>
          <DateControl
          variant="mobile-bottom"
          onSelect={handleSelect}
          dateRange={dateRange}
          setDateRange={setDateRange}
          />
        </div>
        <AdaptGrid xs={1} sm={3} md={3} variant="card" gap={10} backgroundColor="#525252">
          <ReportSummary
            title={`new recruites ( ${sortLabel} )`}
            data={recruites?.newRecruits}
            percent={stringNum(recruites?.percentDifference, { toFixed: 2, postChar: "%" })}
          />
          <ReportSummary
            title={`nodes purchased ( ${sortLabel} )`}
            data={nodesPurchased?.nodesPurchased}
            percent={stringNum(nodesPurchased?.percentDifference, { toFixed: 2, postChar: "%" })}
          />

          <ReportSummary
            title={`new influencers ( ${sortLabel} )`}
            data={influencers?.newInfluencers}
            percent={stringNum(influencers?.percentDifference, { toFixed: 2, postChar: "%" })}
          />
        </AdaptGrid>
      </div>
      <div className="recruiting-report__activity-history">
        <div className="recruiting-report__activity-history-header">
          <div className="recruiting-report__activity-history-title">activity history</div>
          <div className="recruiting-report__activity-history-sub-title">New recruitments signed up per day</div>
        </div>
        <ReportGraph data={enrollmentActivity} />
      </div>
      <div className="recruiting-report__recent-enrollments">
        <AdapTable
          loading={loading}
          options={{ index: request.skip, tableTitle: "recent enrollments", position: "fixed" }}
          data={recentEnrollments}
          total={recentEnrollmentsTotal}
          page={request.skip === 0? 1:Math.floor(request.skip / request.limit + 1)}
          setPage={(page)=>handleRequest({...request, skip: page===1?1: (page-1)*request.limit})}
          limit={request.limit}
          setLimit={handleLimit}
          setSearch={(searchCriteria) => handleRequest({ ...request, searchCriteria: searchCriteria })}
        />
      </div>
    </>
  );
};

export default RecruitingReport;
