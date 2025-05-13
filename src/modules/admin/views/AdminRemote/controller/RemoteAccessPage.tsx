import React from "react";
import RemoteAccessViewer from "../views/RemoteAccessViewer";
import styles from "./RemoteAccessPage.scss";
import UiViewLayout from "@webstack/layouts/UiViewLayout/controller/UiViewLayout";
import RemoteVideoBoard from "../views/RemoteVideoBoard/RemoteVideoBoard";
const RemoteAccessPage: React.FC = () => {
  return (
<>
<style jsx>{styles}</style>
    <div className="remote-access-page">
      <UiViewLayout
       views={{
        remoteAccess: <RemoteAccessViewer />,
        loading: <div className="loading">Loading...</div>,
        board: <RemoteVideoBoard />,
        error: <div className="error">Error loading remote access</div>,
       }}
        currentView="board"  
       />
    </div>
</>
  );
};

export default RemoteAccessPage;
