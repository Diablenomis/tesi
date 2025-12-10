import { IconButton, Tooltip } from "@mui/material";
import { AdminSchedaCreationPanel } from "../components/AdminSchedaCreationPanel";
import MediaUploader from "../components/MediaUploader";
import { AdminCoachCreationPanel } from "../components/AdminCoachCreationPanel";
import { AdminExerciseCreationPanel } from "../components/AdminExerciseCreationPanel";
import { isMobile } from "react-device-detect";
import VideoIcon from "../assets/images/video-icon.png";
import ExerciseIcon from "../assets/images/icon-detail-util.png";
import SchedaIcon from "../assets/images/scheda-icon.png";
import CoachIcon from "../assets/images/coach-icon.png";
import ConnectionIcon from "../assets/images/connection-icon.png";
import { useState } from "react";
import { AdminConnectionCreationPanel } from "../components/AdminConnectionCreationPanel";

const CoachPage: React.FC = () => {
  const [pageSelected, setPageSelected] = useState<string>("connection");

  return (
    <div className="col-12 no-pm content-container">
      <div className="col m-auto mt-4 row padding-page">
        <div className="panel col-12 m-0 p-0 row zoom-in justify-content-center">
          <div className="col navbar-icon my-auto p-0">
            <Tooltip title="Video">
              <IconButton
                onClick={() => {
                  setPageSelected("video");
                }}
                size={isMobile ? "small" : "medium"}
              >
                <img alt="videoIcon" className="navbar-img" src={VideoIcon} />
              </IconButton>
            </Tooltip>
          </div>
          <div className="col navbar-icon my-auto p-0">
            <Tooltip title="Esercizio">
              <IconButton
                onClick={() => {
                  setPageSelected("exercise");
                }}
                size={isMobile ? "small" : "medium"}
              >
                <img alt="exerciseIcon" className="navbar-img" src={ExerciseIcon} />
              </IconButton>
            </Tooltip>
          </div>
          <div className="col navbar-icon my-auto p-0">
            <Tooltip title="Scheda">
              <IconButton
                onClick={() => {
                  setPageSelected("scheda");
                }}
                size={isMobile ? "small" : "medium"}
              >
                <img alt="schedaIcon" className="navbar-img" src={SchedaIcon} />
              </IconButton>
            </Tooltip>
          </div>
          <div className="col navbar-icon my-auto p-0">
            <Tooltip title="Coach">
              <IconButton
                onClick={() => {
                  setPageSelected("coach");
                }}
                size={isMobile ? "small" : "medium"}
              >
                <img alt="coachIcon" className="navbar-img" src={CoachIcon} />
              </IconButton>
            </Tooltip>
          </div>
          <div className="col navbar-icon my-auto p-0">
            <Tooltip title="Connessione">
              <IconButton
                onClick={() => {
                  setPageSelected("connection");
                }}
                size={isMobile ? "small" : "medium"}
              >
                <img alt="connectionIcon" className="navbar-img" src={ConnectionIcon} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
      {pageSelected === "video" && (
        <div className="col m-auto py-0 row mt-4 padding-page">
          <MediaUploader></MediaUploader>
        </div>
      )}
      {pageSelected === "exercise" && (
        <div className="col m-auto py-0 row mt-4 padding-page">
          <AdminExerciseCreationPanel></AdminExerciseCreationPanel>
        </div>
      )}
      {pageSelected === "scheda" && (
        <div className="col m-auto py-0 row mt-4 padding-page">
          <AdminSchedaCreationPanel></AdminSchedaCreationPanel>
        </div>
      )}
      {pageSelected === "coach" && (
        <div className="col m-auto py-0 row mt-4 padding-page">
          <AdminCoachCreationPanel></AdminCoachCreationPanel>
        </div>
      )}
      {pageSelected === "connection" && (
        <div className="col m-auto py-0 row mt-4 padding-page">
          <AdminConnectionCreationPanel></AdminConnectionCreationPanel>
        </div>
      )}
    </div>
  );
};

export default CoachPage;
