"use client";
import UiMedia from "@webstack/components/UiMedia/controller/UiMedia";
import styles from "./RemoteAccessViewer.scss";
import { useEffect, useState } from "react";

interface GuacSession {
  authToken: string;
  connectionId: string;
}

export default function RemoteDesktop() {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/remote/session")
      .then(res => res.text()) // Fetch as plain text to check for HTML errors
      .then((data) => {
        // Check if the response contains HTML (error page)
        if (data.includes("<!DOCTYPE html>")) {
          setError(true);
          console.error("Received HTML error page instead of JSON.");
        } else {
          const parsedData = JSON.parse(data);
          const { authToken, connectionId } = parsedData;
          
          // Construct the URL to embed the remote desktop session
        }
      })
      .catch(err => {
        console.error("Failed to load Guacamole session:", err);
        setError(true);
      });
      const guacUrl = `https://remote.tiktok.soy/vnc.html`;
      setIframeUrl(guacUrl);
  }, []);

  return (
    <>
    <style jsx>{styles}</style>
        <div className="remote-access-viewer ">
      {iframeUrl  ? (
        <UiMedia 
        // controls={false}
          src={iframeUrl}
          type='iframe'
          variant="background"
          // className="remote-access-viewer__media"
          // allow="clipboard-read; clipboard-write"
          // allowFullScreen
        />
        // <iframe
        //   src={iframeUrl}
        //   className="remote-access-viewer__iframe"
        //   allow="clipboard-read; clipboard-write"
        //   allowFullScreen
        //   sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-popups"
        // />
      ) : (
        <>
              <h1 className="text-2xl font-bold">Remote Computer Viewer</h1>
        
        <div className="text-white flex items-center justify-center h-full text-lg">
          {error ? "Failed to connect to remote desktop." : "Connecting to remote session..."}
        </div>
        </>
      )}
    </div>
    </>

  );
}
