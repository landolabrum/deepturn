import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { SetStateAction, useState } from "react";
import styles from "./AdapTableFooter.scss";
import { Dispatch } from "react";
import Input from "@webstack/components/UiInput/UiInput";
import UiButton from "@webstack/components/UiButton/UiButton";
import UiSelect from "@webstack/components/UiSelect/UiSelect";
import { NaCell } from "../AdaptTableContent/components/AdaptTableCell/AdaptTableCell";

interface IProps {
  totalPages: number;
  limit?: number;
  startIndex: number;
  total?: number;
  endIndex: number;
  page: number;
  handlePageChange: (e: any) => void;
  setPage: Dispatch<SetStateAction<number>>;
  setLimit?: Dispatch<SetStateAction<number>>;
  visibleData: any;
}
export default function AdapTableFooter({
  startIndex,
  endIndex,
  totalPages,
  limit,
  page,
  handlePageChange,
  setPage,
  setLimit,
  total,
}: IProps) {
  const ITEMS_PER_PAGE_OPTIONS = [10, 15, 25, 50, 75, 100, 150];
  const pageRange = Array.from({ length: page + 2 - page + 1 }, (_, i) => page + i);
  const [placeHolder, setPlaceHolder] = useState<boolean>(false);
  const selectOptions: any = ITEMS_PER_PAGE_OPTIONS.map((o) => {
    if (total && o < total) {
      return { label: o, href: o };
    }
  });
  const handleLimit = (newPageLimit: number) => {
    if (newPageLimit <= endIndex * page) handlePageChange(1);
    setLimit && setLimit(newPageLimit);
  };
  const handlePageInput = (input: any) => {
    input.preventDefault();
    const toPage = Number(input.target.value);
    setPlaceHolder(toPage === 0);
    if (placeHolder) {
      handlePageChange(toPage);
    } else if (toPage <= totalPages && toPage !== 0) {
      handlePageChange(toPage);
    }
  };
  if (!totalPages || totalPages === 1) return <></>;
  return (
    <>
      <style jsx>{styles}</style>
      <div className="adaptable-footer__table-footer">
        <div className="adaptable-footer__content">
          <div className="adaptable-footer__page-input">
            Page{" "}
            <Input
              variant="center"
              name="page-input"
              traits={{width: 35, height: 43}}
              type="tel"
              value={placeHolder ? " " : page.toString()}
              onChange={handlePageInput}
            />
            of {totalPages}
          </div>
          {limit && (
            <div className="adaptable-footer__page-select">
              view
              <UiSelect title={limit.toString()} openDirection="up" options={selectOptions} onSelect={handleLimit} />
              entries per page
            </div>
          )}
        </div>
        <div className="adaptable-footer__page-info">
          Showing {startIndex + 1} to {endIndex} of {total ? total : <NaCell />} entries
        </div>
        <div className="adaptable-footer__page-carousel">
          {" "}
          <UiButton
            onClick={() => setPage(1)}
            disabled={page === 1}
            variant={`${page === 1 ? "disabled-icon" : "icon"}`}
          >
            <UiIcon icon="fa-chevrons-left" />
          </UiButton>
          <UiButton
            onClick={() => page && setPage(page - 1)}
            disabled={page === 1}
            variant={`${page === 1 ? "disabled-icon" : "icon"}`}
          >
            <UiIcon icon="fa-chevron-left" />
          </UiButton>
          {pageRange.map((b) => {
            let displayed = b;
            if (b >= 2 && page != 1) displayed = b - 1;
            if (displayed <= totalPages)
              return (
                <UiButton
                  key={displayed}
                  onClick={() => setPage(page && displayed)}
                  variant={page === displayed ? "miniactive" : "mini"}
                >
                  {displayed}
                </UiButton>
              );
          })}
          <UiButton
            onClick={() => setPage(page && page + 1)}
            disabled={page === totalPages}
            variant={`${page === totalPages ? "disabled-icon" : "icon"}`}
          >
            <UiIcon icon="fa-chevron-right" />
          </UiButton>
          <UiButton
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            variant={`${page === totalPages ? "disabled-icon" : "icon"}`}
          >
            <UiIcon icon="fa-chevrons-right" />
          </UiButton>
        </div>
      </div>
    </>
  );
}
