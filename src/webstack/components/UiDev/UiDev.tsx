import type { FC } from "react";
import styles from "./UiDev.scss";
interface UiDevProps {
  data: any;
}

const UiDev: FC<UiDevProps> = ({ data }) => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className="dev">
        {data &&
          Object.entries(data).map(([key,value], index) => {
            return (
              <div className="dev-item" key={index}>
                <div className="dev-key">{key}</div>
                {typeof value !== "object" && `${value}`}
                {typeof value === "object" && JSON.stringify(value)}
              </div>
            );
          })}
      </div>
    </>
  );
};
export default UiDev;
