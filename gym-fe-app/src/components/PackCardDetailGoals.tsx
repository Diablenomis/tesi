import {
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Tooltip,
} from "@mui/material";
import Vimeo from "@u-wave/react-vimeo";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import {
  BASE_VIDEO_URL,
  PAGE_TYPE_SCHEDA_TUTORIAL_DETAIL_USER,
} from "../constants/TypeConstants";
import { IPackCardDetailLevel } from "../models/ComponentInterface";
import PlayerIcon from "../assets/images/player-icon.png";

export const PackCardDetailGoals: React.FC<IPackCardDetailLevel> = ({
  packLevel,
  page,
}) => {
  const [text, setText] = useState<string[]>([]);
  const [videoIndex, setVideoIndex] = useState<string>("");

  useEffect(() => {
    if (packLevel && packLevel.goals !== "") {
      adaptText();
    }
  }, [packLevel]);

  const adaptText = () => {
    let textRows = packLevel.goals.split("\n");
    setText(textRows);
  };

  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    bgcolor: "background.paper",
    borderRadius: "16px",
    boxShadow: 24,
    textAlign: "center",
    p: 1,
  };

  return (
    <div className="panel m-0 p-0 pb-3 col-12 container-fluid little-card zoom-in">
      <div className="col-12 m-0 py-0 row pack-card-detail-header padding-page-half container-fluid">
        <div className="m-0 p-0 col row">
          <div className="col m-auto pack-card-level-icon-size pack-card-detail-goals-icon footer-icon-size p-0"></div>
          <div className="col m-0">
            <span className="pack-card-detail-title no-pm text-font-big">
              Obiettivi
            </span>
          </div>
          {page === PAGE_TYPE_SCHEDA_TUTORIAL_DETAIL_USER && (
            <div className="col player-icon no-pm center-div-button">
              <div className="col navbar-icon my-auto p-0">
                <Tooltip title="Video">
                  <IconButton
                    onClick={() => {
                      setVideoIndex(packLevel.requirements_video);
                    }}
                    size={isMobile ? "small" : "medium"}
                    className="bg-white"
                  >
                    <img
                      alt="exerciseIcon"
                      className="navbar-img"
                      src={PlayerIcon}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </div>
      {packLevel.goals_video !== undefined &&
        packLevel.goals_video !== null &&
        packLevel.goals_video !== "" &&
        packLevel.goals_video !== "default" &&
        page !== PAGE_TYPE_SCHEDA_TUTORIAL_DETAIL_USER && (
          <div className="col-12 py-0 m-0 mt-3 mb-3 row pack-card-body padding-page-field">
            <div className="no-pm col">
              <div className="d-flex align-items-center justify-content-center col-12 no-pm">
                <Vimeo
                  video={BASE_VIDEO_URL + packLevel.goals_video}
                  loop={false}
                  autoplay={false}
                  responsive={true}
                  controls={true}
                  muted={false}
                  className="home-page-intro-video"
                />
              </div>
            </div>
          </div>
        )}
      <div className="col-12 py-0 m-0 mt-3 mb-3 pack-card-body padding-page-half">
        <Grid item xs={12} md={6} className="no-pm">
          <List dense={true} className="no-pm">
            {text &&
              text.map((textRow, index) => (
                <ListItem className="no-pm" key={index}>
                  <ListItemText primary={textRow} />
                </ListItem>
              ))}
          </List>
        </Grid>
      </div>
      <Modal open={videoIndex !== ""} onClose={() => setVideoIndex("")}>
        <Box sx={modalStyle}>
          <div className="col-12 py-0 m-0 mt-3 mb-3 row pack-card-body padding-page-field">
            <div className="no-pm col">
              <div className="d-flex align-items-center justify-content-center col-12 no-pm">
                <Vimeo
                  video={BASE_VIDEO_URL + videoIndex}
                  loop={false}
          autoplay={false}
          responsive={true}
          controls={true}
          muted={false}
                  className="home-page-intro-video"
                />
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
