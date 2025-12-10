import styled from "@emotion/styled";
import { Button, ButtonProps } from "react-bootstrap";
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
import AdminCreateCodes from "../components/AdminCreateCodes";
import AdminEditCodes from "../components/AdminEditCodes";
import AdminCreateAbbonamenti from "../components/AdminCreateAbbonamenti";
import AdminEditAbbonamenti from "../components/AdminEditAbbonamenti";

const ColoredButton = styled(Button)<ButtonProps>(({ theme }) => ({
    backgroundColor: "#a6ce24",
    color: "#ffffff",
    fontWeight: 400,
    "&:hover": {
      color: "#ffffff",
      backgroundColor: "#192b3f",
    },
  }));

const AdminPage: React.FC = () => {
    const [pageSelected, setPageSelected] = useState<string>("codes");
  return (
    <div className="col-12 no-pm content-container">
    <div className="col m-auto mt-4 row padding-page">
      <div className="panel col-12 m-0 p-0 row zoom-in justify-content-center">
        <div className="col-4 navbar-icon my-auto p-0">
          <Tooltip title="Crea un codice">
            <IconButton
              onClick={() => {
                setPageSelected("codes");
              }}
              size={isMobile ? "small" : "medium"}
            >
              {/* <img alt="videoIcon" className="navbar-img" src={VideoIcon} />
               */}
               <span className="button-admin">Codici</span>
            </IconButton>
          </Tooltip>
        </div>
        <div className="col navbar-icon my-auto p-0">
          <Tooltip title="Modifica un codice">
            <IconButton
              onClick={() => {
                setPageSelected("abbonamenti");
              }}
              size={isMobile ? "small" : "medium"}
            >
              {/* <img alt="exerciseIcon" className="navbar-img" src={ExerciseIcon} /> */}
              <span className="button-admin">Abbonamenti</span>
            </IconButton>
          </Tooltip>
        </div>
       
        
       
      </div>
    </div>
    {pageSelected === "codes" && (
      <div className="col m-auto py-0 row mt-4 padding-page">
        <AdminCreateCodes></AdminCreateCodes>
        <hr />
        <AdminEditCodes></AdminEditCodes>
      
      </div>
    )}
   
    {pageSelected === "abbonamenti" && (
      <div className="col m-auto py-0 row mt-4 padding-page">
        <AdminCreateAbbonamenti></AdminCreateAbbonamenti>
        <hr />
        <AdminEditAbbonamenti></AdminEditAbbonamenti>
      </div>
    )}
  </div>
  );
};

export default AdminPage;
