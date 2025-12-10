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
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { IPackCardDetailLevel } from "../models/ComponentInterface";
import PlayerIcon from "../assets/images/player-icon.png";
import Vimeo from "@u-wave/react-vimeo";
import { BASE_VIDEO_URL } from "../constants/TypeConstants";

export const PackCardDetailWeeks: React.FC<IPackCardDetailLevel> = ({
  packLevel,
}) => {
  const [indexWeekShow, setIndexWeekShow] = useState<number>(0);
  const [videoIndex, setVideoIndex] = useState<string>("");


  const changeWeek = (indexWeek: number) => {
    setIndexWeekShow(indexWeek);
  };

  const showExercise = (idVideo: string) => {
    setVideoIndex(idVideo);
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
          <div className="col m-auto pack-card-level-icon-size pack-card-detail-steps-icon footer-icon-size p-0"></div>
          <div className="col m-0">
            <span className="pack-card-detail-title no-pm text-font-big">
              Scheda
            </span>
          </div>
        </div>
      </div>
      <div className="col-12 p-0 m-0 mt-2 text-align-center">
        <span className="sign-card-sign-label-size sign-card-color-field">
          Settimane
        </span>
      </div>
      <div className="col-11 m-auto p-0 mt-1">
        <hr className="col-12 no-pm" />
      </div>
      <div className="col-12 row mt-2 mb-2 m-0 p-0 justify-content-center">
        {packLevel.form &&
          packLevel.form.weeks &&
          packLevel.form.weeks.map((week: any, indexWeek: number) => (
            <div
              className="col navbar-icon my-auto p-0 text-align-center"
              key={indexWeek}
            >
              <IconButton
                onClick={() => {
                  changeWeek(indexWeek);
                }}
                size={isMobile ? "small" : "medium"}
                className="icon-button-bg-gray"
              >
                <span className="navbar-img number-button-style">
                  {indexWeek + 1}
                </span>
              </IconButton>
            </div>
          ))}
      </div>
      {packLevel.form &&
        packLevel.form.weeks &&
        packLevel.form.weeks.map(
          (week: any, weekIndex: number) =>
            weekIndex === indexWeekShow && (
              <div className="col-12 no-pm" key={weekIndex}>
                <div className="col-12 row mt-2 mb-2 m-0 p-0 justify-content-center">
                  {week.name}
                </div>
                {week.sections &&
                  week.sections.map((section: any, sectionIndex: number) => (
                    <div
                      key={sectionIndex}
                      className="col-11 mt-3 m-auto p-0 row"
                    >
                      <div className="col-12 no-pm">
                        <span>{section.name}</span>
                      </div>
                      <div className="col-12 row m-auto info-card-title mt-3 default-info-title container-fluid">
                        {section.exercises &&
                          section.exercises.map(
                            (exercise: any, exIndex: number) =>
                              exercise.exe ? (
                                <div
                                  className="row col-12 p-0 m-0 mb-2"
                                  key={exIndex}
                                >
                                  <div className="col-12 p-0 m-0 mb-2">
                                    <span className="sign-card-sign-label-size">
                                      {"🔵 " + exercise.exe.name}
                                    </span>
                                  </div>
                                  <div className="col row">
                                    <div className="col-12 text-align-center sign-card-sign-label-size">
                                      Sets
                                    </div>
                                    <div className="col-12 text-align-center exe-desc-label-size">
                                      {exercise.series}
                                    </div>
                                  </div>
                                  <div className="col row">
                                    <div className="col-12 text-align-center sign-card-sign-label-size">
                                      Reps
                                    </div>
                                    <div className="col-12 text-align-center exe-desc-label-size">
                                      {exercise.repetitions}
                                    </div>
                                  </div>
                                  <div className="col row">
                                    <div className="col-12 text-align-center sign-card-sign-label-size">
                                      Rest
                                    </div>
                                    <div className="col-12 text-align-center exe-desc-label-size">
                                      {exercise.stop}
                                    </div>
                                  </div>
                                  <div className="col row">
                                    <div className="col-12 text-align-center sign-card-sign-label-size">
                                      Load
                                    </div>
                                    <div className="col-12 text-align-center exe-desc-label-size">
                                      {exercise.load}
                                    </div>
                                  </div>
                                  <div className="col row">
                                    <div className="col-12 text-align-center sign-card-sign-label-size">
                                      Intensity
                                    </div>
                                    <div className="col-12 text-align-center exe-desc-label-size">
                                      {exercise.intensity}
                                    </div>
                                  </div>
                                  <div className="col player-icon no-pm">
                                    <div className="col navbar-icon my-auto p-0">
                                      <Tooltip title="Video">
                                        <IconButton
                                          onClick={() => {
                                            showExercise(exercise.exe.video);
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
                                  {section.exercises.length - 1 !== exIndex && (
                                    <div className="col-12 m-auto p-0 mt-2 mb-2">
                                      <hr className="col-12 no-pm" />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="col-12 no-pm" key={exIndex}>
                                  {exercise.super_series &&
                                    exercise.super_series.map(
                                      (supSer: any, supSerIndex: number) => (
                                        <div
                                          className="row col-12 p-0 m-0 mb-2"
                                          key={supSerIndex}
                                        >
                                          <div className="col-12 p-0 m-0 mb-2">
                                            <span className="sign-card-sign-label-size">
                                              {"🔵 " + supSer.exe.name}
                                            </span>
                                          </div>
                                          <div className="col row">
                                            <div className="col-12 text-align-center sign-card-sign-label-size">
                                              Sets
                                            </div>
                                            <div className="col-12 text-align-center exe-desc-label-size">
                                              {supSer.series}
                                            </div>
                                          </div>
                                          <div className="col row">
                                            <div className="col-12 text-align-center sign-card-sign-label-size">
                                              Reps
                                            </div>
                                            <div className="col-12 text-align-center exe-desc-label-size">
                                              {supSer.repetitions}
                                            </div>
                                          </div>
                                          <div className="col row">
                                            <div className="col-12 text-align-center sign-card-sign-label-size">
                                              Rest
                                            </div>
                                            <div className="col-12 text-align-center exe-desc-label-size">
                                              {supSer.stop}
                                            </div>
                                          </div>
                                          <div className="col row">
                                            <div className="col-12 text-align-center sign-card-sign-label-size">
                                              Load
                                            </div>
                                            <div className="col-12 text-align-center exe-desc-label-size">
                                              {supSer.load}
                                            </div>
                                          </div>
                                          <div className="col row">
                                            <div className="col-12 text-align-center sign-card-sign-label-size">
                                              Intensity
                                            </div>
                                            <div className="col-12 text-align-center exe-desc-label-size">
                                              {supSer.intensity}
                                            </div>
                                          </div>
                                          <div className="col player-icon no-pm">
                                            <div className="col navbar-icon my-auto p-0">
                                              <Tooltip title="Video">
                                                <IconButton
                                                  onClick={() => {
                                                    showExercise(
                                                      supSer.exe.video
                                                    );
                                                  }}
                                                  size={
                                                    isMobile
                                                      ? "small"
                                                      : "medium"
                                                  }
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
                                        </div>
                                      )
                                    )}
                                  {section.exercises.length - 1 !== exIndex && (
                                    <div className="col-12 m-auto p-0 mt-2 mb-2">
                                      <hr className="col-12 no-pm" />
                                    </div>
                                  )}
                                </div>
                              )
                          )}
                      </div>
                    </div>
                  ))}
              </div>
            )
        )}

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
