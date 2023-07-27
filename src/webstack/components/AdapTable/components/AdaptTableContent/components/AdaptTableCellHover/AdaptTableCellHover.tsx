import keyStringConverter from "@webstack/helpers/keyStringConverter";
import styles from "./AdaptTableCellHover.scss";
import { Fragment } from "react";
function createChunks(value: string, chunkSize: number) {
  const chunks = [];
  let index = 0;

  while (index < value.length) {
    chunks.push(value.slice(index, index + chunkSize));
    index += chunkSize;
  }

  return chunks;
}
export default function AdaptTableCellHover(value: any) {
  function orderedList(obj: any) {
    if (!obj || typeof obj !== "object") {
      throw new Error("Invalid input. Expected an object.");
    }
    const listItems = Object.entries(obj).map(([key, value]: any) => {
      return (
        <span key={key}>
          <style jsx>{styles}</style>
          <div className="td-hover-key">{keyStringConverter(key)}: </div>
          <div className="td-hover-key-value">
            {createChunks(value, 20).map((chunk, index, arr) => (
              <Fragment key={index}>
                {chunk}
                {index < arr.length - 1 && <br />}
              </Fragment>
            ))}
          </div>
        </span>
      );
    });
    return (
      <>
        <style jsx>{styles}</style>
        <div className="td-hover">
          <div className="td-hover-content">{listItems}</div>
        </div>
      </>
    );
  }
  if (typeof value === "string")
    return (
      <>
        <style jsx>{styles}</style>
        <div className="td-hover">
          <div className="td-hover-content">{value}</div>
        </div>
      </>
    );
  else if (typeof value === "object" && value.props?.data) {
    return orderedList(Object(value.props.data));
  }
  return <></>;
}
