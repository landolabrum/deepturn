import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "./BreadCrumbs.scss";
import capitalize from "@webstack/helpers/Capitalize";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import useWindow from "@webstack/helpers/useWindow";
import environment from "~/src/environment";

export type BreadCrumbLinkProps = {
  href?: string;
  label: string;
  blank?: boolean;
}
export interface BreadCrumbsProps {
  links?: BreadCrumbLinkProps[]
}
export default function BreadCrumbs({ links }: BreadCrumbsProps) {
  const router = useRouter();
  const width = useWindow().width;
  function handleClick(route: string) {
    router.push(route)
  }

  const linkLen = links ? links.length - 1 : 0;
  useEffect(() => {
  }, [links, router]);
  return <>
    <style jsx >{styles}</style>
    <div className="breadcrumbs">
      <div className="crumb" onClick={() => handleClick("/")}>
        {environment?.brand?.name} <UiIcon icon="fa-chevron-right" />
      </div>
      {links && width > 900 && links.map((link, key) => {
        return <div key={key} onClick={() => key + 1 !== links.length && handleClick(link.href ? link.href : "/" + link.label)} className={`crumb ${key === linkLen ? "active" : ""}`}>
          {capitalize(link.label)} {key !== linkLen && <UiIcon icon="fa-chevron-right" />}
        </div>
      })}
      {width < 900 && <div className="crumb active" onClick={router.back}>back</div>}
    </div>
  </>
}