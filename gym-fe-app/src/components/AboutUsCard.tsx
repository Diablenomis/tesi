import { CircularProgress } from "@mui/material";
import { useState } from "react";
import Vimeo from "@u-wave/react-vimeo";
import { HOMEPAGE_VIDEO_URL } from "../constants/TypeConstants";

export const AboutUsCard: React.FC = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center panel home-page-intro-card m-auto"
    >
      <Vimeo
          video={HOMEPAGE_VIDEO_URL}
          loop={false}
          autoplay={false}
          responsive={true}
          controls={true}
          muted={false}
          className="home-page-intro-video"
        />
    </div>
  );
};
