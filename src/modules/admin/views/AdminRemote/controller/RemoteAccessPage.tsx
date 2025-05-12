import React from "react";
import RemoteAccessViewer from "../views/RemoteAccessViewer";
import styles from "./RemoteAccessPage.scss";
const RemoteAccessPage: React.FC = () => {
  return (
<>
<style jsx>{styles}</style>
    <div className="remote-access-page">
      <h1 className="text-2xl font-bold">Remote Computer Viewer</h1>
      <RemoteAccessViewer />
    </div>
</>
  );
};

export default RemoteAccessPage;
