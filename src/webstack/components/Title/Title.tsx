import { capitalize } from "lodash";
import type { FC } from "react";
import { useHeader } from "../Header/views/Header";

interface TitleProps {}

const Title: FC<TitleProps> = ({}) => {
  const [header, setHeader] = useHeader();
  const title = header?.title && header.title.includes(" ")?header.title.split(" ").forEach((str) => capitalize(str)): capitalize(header?.title);
  return <title>{`Deepturn ${title ? "| " + title : ""}`}</title>;
};
export default Title;
