import UiLoader from "@webstack/components/UiLoader/UiLoader";
import styles from "./AdaptTableLoader.scss";
export default function AdaptTableLoader() {
  return (
    <>
      <style jsx>{styles}</style>
      <div className="table-loader">
        <UiLoader />
      </div>
    </>
  );
}
