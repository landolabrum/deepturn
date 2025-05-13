import React from "react";
import styles from"./RemoteVIdeoBoard.scss";
import UiViewLayout from "@webstack/layouts/UiViewLayout/controller/UiViewLayout";
import AdaptGrid from "@webstack/components/Containers/AdaptGrid/AdaptGrid";
import UiMedia from "@webstack/components/UiMedia/controller/UiMedia";
const RemoteVideoBoard: React.FC = () => {
    const RemoteVideo = ({src, id,alt,poster, autoplay, controls, }:any) => {
        return (
            <div className="remote-video">
                <UiMedia
                    src={src}
                    alt={alt}
                    type="iframe"
                    // poster={poster}
                    autoplay={autoplay}
                    controls={controls}
                    loadingText="Loading..."
                    preload="none"
                />
                </div>
        )

    };
const group1 = [
    {
        src: "https://www.youtube.com/embed/Oy0nVlkVvMg?si=tuLP7cf8LgZpbCIr",
        id: "video1",
        alt: "Video 1",
    
        autoplay: false,
        controls: true,
    },
    {
        src: "https://www.youtube.com//qdBD7JPoDDM?si=9pZcoQ2NZCV01akF",
        id: "video1",
        alt: "Video 1",
    
        autoplay: false,
        controls: true,
    },

];
  return ( <>
      <style jsx>{styles}</style>
    <div className="remote-video-board">
        <AdaptGrid xs={1} md={3} gap={10}>
{group1.map((video, index) => (
            <div key={index} className="video-item">
                <RemoteVideo
                    src={video.src}
                    id={video.id}
                    alt={video.alt}
                    poster={video.poster}

                    autoplay={video.autoplay}
                    controls={video.controls}
                />
            </div>
        ))}

        </AdaptGrid>
        </div>
    </>
  );
}
export default RemoteVideoBoard;