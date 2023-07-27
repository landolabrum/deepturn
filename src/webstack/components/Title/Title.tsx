import { capitalize } from "lodash";
import { useState, useEffect, FC } from "react";
import { useHeader } from "../Header/views/Header";

interface TitleProps {}

const Title: FC<TitleProps> = ({}) => {
  const [header, setHeader] = useHeader();
  const [title, setTitle] = useState<any>("");

  useEffect(() => {
    const handleTitle = () => {
      if (header?.title !== undefined && header.title.includes(" ")) {
        alert(header.title);
        const t: string = header.title;
        const h = (): any => {
          return t
            .split(" ")
            .map((str: string) => capitalize(str))
            .join(" ");
        };
        setTitle(h());
      }
    };

    // Run the code when the DOM is loaded
    document.addEventListener("DOMContentLoaded", handleTitle);

    return () => {
      // Clean up the event listener when the component is unmounted
      document.removeEventListener("DOMContentLoaded", handleTitle);
    };
  }, []);

  return <title>{`Deepturn ${title ? "| " + title : ""}`}</title>;
};

export default Title;
