import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import Vimeo from "@u-wave/react-vimeo";
import {
  BASE_VIDEO_URL,
  LS_USER,
  LS_USER_TYPE,
  PAGE_TYPE_SCHEDA_TUTORIAL_DETAIL,
  PAGE_TYPE_SCHEDA_TUTORIAL_DETAIL_USER,
} from "../constants/TypeConstants";
import {
  IPackDetail,
  IPackLevel,
  IPackLevelUser,
  IPackPers,
} from "../models/Pack";
import {
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  IconButton,
  Modal,
  styled,
  Tooltip,
} from "@mui/material";
import { Footer } from "../components/Footer";
import {
  initialPackDetail,
  initialPackLevel,
} from "../constants/InitialEntities";
import { PackCardDetailMain } from "../components/PackCardDetailMain";
import { PackCardDetailLevels } from "../components/PackCardDetailLevels";
import { PackCardDetailRequirements } from "../components/PackCardDetailRequirements";
import { PackCardDetailGoals } from "../components/PackCardDetailGoals";
import { PackCardDetailFrequency } from "../components/PackCardDetailFrequency";
import { PackCardDetailDuration } from "../components/PackCardDetailDuration";
import { PackCardDetailUtils } from "../components/PackCardDetailUtils";
import PackService from "../services/PackService";
import { useParams } from "react-router-dom";
import { PackCardDetailDescription } from "../components/PackCardDetailDescription";
import { getStorageValue } from "../services/LocalStorage";
import { isMobile } from "react-device-detect";
import { PackCardDetailWeeks } from "../components/PackCardDetailWeeks";

import PlayerIcon from "../assets/images/playButton.png";
import DefaulHeader from "../components/DefaultHeader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DocumentPDF from "../components/DocumentPDF";

const SchedaPersDetailUserPage: React.FC = () => {
  const { packPersId } = useParams();
  const [user, setUser] = useState<string>("");
  const [isUserAdminLoggedIn, setIsUserAdminLoggedIn] =
    useState<boolean>(false);
  const [packPers, setPackPers] = useState<IPackPers | null>(null);
  const [indexWeekShow, setIndexWeekShow] = useState<number>(0);
  const [indexDayShow, setIndexDayShow] = useState<number>(0);
  const [videoIndex, setVideoIndex] = useState<string>("");
  const [downloadable, setDownloadable] = useState<any>();
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [PDFstring, setPDFstring] = useState("");
  useEffect(() => {
    getUserFromLS();
  }, []);

  useEffect(() => {
    if (user !== "" && !isUserAdminLoggedIn) {
      getPackPersByUserId();
    }
  }, [user, isUserAdminLoggedIn]);

  const getPackPersByUserId = () => {
    setIsLoading(true);
    PackService.getPacksPersByUser(packPersId ? packPersId : "")
      .then((response) => {
        setPackPers(response.data.data);
        setIsLoading(false);
      })
      .catch((e: Error) => {
        setPackPers(null);
        setMessage(e.message);
        setIsLoading(false);
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const getUserFromLS = () => {
    const user = getStorageValue(LS_USER) || "";
    const userType = getStorageValue(LS_USER_TYPE) || "";
    setIsUserAdminLoggedIn(userType === "coach");
    setUser(user);
  };

  const changeWeek = (indexWeek: number) => {
    setIndexWeekShow(indexWeek);
  };

  const showExercise = (idVideo: string) => {
    setVideoIndex(idVideo);
  };

  const downloadPDF = async () => {
    try {
      // Seleziona il contenuto HTML che vuoi convertire in PDF
      const element = document.getElementById("scheda");

      if (!element) {
        console.error("Elemento con id 'scheda' non trovato");
        return;
      }

      // Usa html2canvas per catturare l'elemento come immagine
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");

      // Crea un nuovo documento PDF
      const pdf = new jsPDF({
        orientation: "portrait", // Puoi cambiare a 'landscape' se necessario
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      // Aggiungi l'immagine al PDF
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      // Salva il PDF
      pdf.save(
        "scheda-fit-nexus-settimana-" +
          (indexWeekShow + 1) +
          "-giorno-" +
          (indexDayShow + 1) +
          ".pdf"
      );
    } catch (error) {
      console.error("Errore nella creazione del PDF:", error);
    }
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
  const ColoredButton = styled(Button)<ButtonProps>(({ theme }) => ({
    backgroundColor: "#a6ce24",
    color: "#ffffff",
    fontWeight: 400,
    "&:hover": {
      color: "#ffffff",
      backgroundColor: "#192b3f",
    },
  }));

  return (
    <div className="schede-tutorial-panel col-12 m-0">
      <DefaulHeader></DefaulHeader>
      {isLoading ? (
        <div className="d-flex align-items-center justify-content-center mt-5 padding-page content-container">
          <CircularProgress style={{ color: "#ffffff" }} />
        </div>
      ) : packPers ? (
        <div style={{ paddingTop: "200px", maxWidth: 1400, margin: "auto" }}>
          <div className="no-pm">
            <div className="col-lg-8 col-md-12 col-sm-12 m-0 py-0 mt-4 padding-page-half mx-auto p-0">
              <div
                // id="scheda"
                className="panel m-0 p-0 pb-3 col-12 container-fluid scheda-card "
                style={{}}
              >
                {/* <div className="col-12 m-0 py-0 row pack-card-detail-header padding-page-half container-fluid">
                  <div className="m-0 p-0 col row">
                    <div className="col m-auto pack-card-level-icon-size pack-card-detail-steps-icon footer-icon-size p-0"></div>
                    <div className="col m-0">
                      <span className="pack-card-detail-title no-pm text-font-big">
                        Scheda
                      </span>
                    </div>
                  </div>
                </div> */}
                <div className="col-12 p-0 m-0 mt-2 text-align-center">
                  <h4 className="text-align-center">Settimana</h4>
                </div>
                <div className="col-11 m-auto p-0 mt-1">
                  <hr className="col-12 no-pm" />
                </div>
                <div className="col-12 row mt-2 mb-2 m-0 p-0 justify-content-center">
                  {packPers &&
                    packPers.weeks &&
                    packPers.weeks.map((week: any, indexWeek: number) => (
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
                          style={{
                            backgroundColor:
                              indexWeek === indexWeekShow ? "#a6ce24" : "",
                          }}
                        >
                          <span className="navbar-img number-button-style">
                            {indexWeek + 1}
                          </span>
                        </IconButton>
                      </div>
                    ))}
                </div>
                <div className="col-12 p-0 m-0 mt-2 text-align-center">
                  <h4 className="text-align-center">Giorno</h4>
                </div>
                <div className="col-11 m-auto p-0 mt-1">
                  <hr className="col-12 no-pm" />
                </div>
                <div className="col-12 row mt-2 mb-2 m-0 p-0 justify-content-center">
                  {packPers &&
                    packPers.weeks &&
                    packPers.weeks[indexWeekShow].days.map(
                      (day: any, indexDay: number) => (
                        <div
                          className="col navbar-icon my-auto p-0 text-align-center"
                          key={indexDay}
                        >
                          <IconButton
                            onClick={() => {
                              setIndexDayShow(indexDay);
                            }}
                            size={isMobile ? "small" : "medium"}
                            className="icon-button-bg-gray"
                            style={{
                              backgroundColor:
                                indexDay === indexDayShow ? "#a6ce24" : "",
                            }}
                          >
                            <span className="navbar-img number-button-style">
                              {indexDay + 1}
                            </span>
                          </IconButton>
                        </div>
                      )
                    )}
                </div>
                {packPers &&
                  packPers.weeks &&
                  packPers.weeks.map(
                    (week: any, weekIndex: number) =>
                      weekIndex === indexWeekShow && (
                        <div
                          className="col-12 no-pm d-flex flex-column justify-content-center- align-items-center"
                          key={weekIndex}
                        >
                          <ColoredButton onClick={downloadPDF}>
                            Download
                            {/* <PDFDownloadLink
                                document={<DocumentPDF week={week} />}
                                fileName={
                                  "Scheda-Palestra-Settimana" +
                                  (indexWeekShow + 1) +
                                  ".pdf"
                                }
                              >
                                {({ loading }) =>
                                  loading
                                    ? "Caricamento..."
                                    : "Scarica PDF della settimana numero " +
                                      (indexWeekShow + 1)
                                }
                              </PDFDownloadLink> */}
                          </ColoredButton>
                          <div id="scheda" className="col-12">
                            {week.days &&
                              week.days.map(
                                (day: any, dayIndex: number) =>
                                  dayIndex === indexDayShow && (
                                    <div
                                      key={dayIndex}
                                      className="col-11 mt-3 m-auto p-0 row"
                                    >
                                      <h2 className="m-0 p-0 text-align-left">
                                        {day.name}
                                      </h2>

                                      <div className="p-0 m-0">
                                        {day.sections &&
                                          day.sections.map(
                                            (
                                              section: any,
                                              indexSection: number
                                            ) => {
                                              return section.exercises.length >
                                                0 ? (
                                                <div className="col-12 row m-auto info-card-title mt-3 default-info-title container-fluid p-4">
                                                  <h2
                                                    style={{
                                                      textTransform:
                                                        "uppercase",
                                                      color: "white",
                                                      margin: 0,
                                                      padding: 0,
                                                      marginBottom: 50,
                                                    }}
                                                  >
                                                    {section.exercises
                                                      ? section.name
                                                      : null}
                                                  </h2>
                                                  {section.exercises &&
                                                    section.exercises.map(
                                                      (
                                                        exercise: any,
                                                        exIndex: number
                                                      ) =>
                                                        exercise.exe ? (
                                                          <div
                                                            className="row col-12 p-3 m-0 mb-2"
                                                            key={exIndex}
                                                            style={{
                                                              backgroundColor:
                                                                "#ffffff",
                                                              borderRadius: 15,
                                                              color: "#020202",
                                                            }}
                                                          >
                                                            <div className="col-12 p-3 m-0 mb-2 d-flex justify-content-between align-items-center">
                                                              <span className="sign-card-sign-label-size p-10">
                                                                <b>
                                                                  {"🔵 " +
                                                                    exercise.exe
                                                                      .name +
                                                                    " "}
                                                                </b>
                                                              </span>
                                                              <Tooltip title="Video">
                                                                <IconButton
                                                                  onClick={() => {
                                                                    showExercise(
                                                                      exercise
                                                                        .exe
                                                                        .video
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
                                                                    src={
                                                                      PlayerIcon
                                                                    }
                                                                  />
                                                                </IconButton>
                                                              </Tooltip>
                                                            </div>
                                                            <div className="col-12 d-flex justify-content-between pb-4">
                                                              <div className="col row">
                                                                <div className="col-12 text-align-center sign-card-sign-label-size fs-7">
                                                                  SERIE
                                                                </div>
                                                                <div className="col-12 text-align-center exe-desc-label-size">
                                                                  {exercise.series
                                                                    ? exercise.series
                                                                    : "/"}
                                                                </div>
                                                              </div>
                                                              <div className="col row">
                                                                <div className="col-12 text-align-center sign-card-sign-label-size">
                                                                  RIPETIZIONI
                                                                </div>
                                                                <div className="col-12 text-align-center exe-desc-label-size">
                                                                  {exercise.repetitions
                                                                    ? exercise.repetitions
                                                                    : "/"}
                                                                </div>
                                                              </div>
                                                              <div className="col row">
                                                                <div className="col-12 text-align-center sign-card-sign-label-size">
                                                                  RIPOSO
                                                                </div>
                                                                <div className="col-12 text-align-center exe-desc-label-size">
                                                                  {Math.floor(
                                                                    exercise.stop /
                                                                      60
                                                                  )}
                                                                  m
                                                                  {exercise.stop %
                                                                    60}
                                                                  s
                                                                </div>
                                                              </div>
                                                              <div className="col row">
                                                                <div className="col-12 text-align-center sign-card-sign-label-size">
                                                                  CARICO
                                                                </div>
                                                                <div className="col-12 text-align-center exe-desc-label-size">
                                                                  {exercise.load
                                                                    ? exercise.load +
                                                                      "kg"
                                                                    : "/"}
                                                                </div>
                                                              </div>
                                                              <div className="col row">
                                                                <div className="col-12 text-align-center sign-card-sign-label-size">
                                                                  INTENSITA'
                                                                </div>
                                                                <div className="col-12 text-align-center exe-desc-label-size">
                                                                  {exercise.intensity
                                                                    ? exercise.intensity
                                                                    : "/"}
                                                                </div>
                                                              </div>
                                                            </div>
                                                            {exercise.description !==
                                                              "" && (
                                                              <div className="col-12 row d-flex justify-content-center pb-30 mx-auto">
                                                                <div className="col-12 text-align-left sign-card-sign-label-size">
                                                                  DESCRIZIONE
                                                                </div>
                                                                <div className="col-12 text-align-left exe-desc-label-size">
                                                                  {
                                                                    exercise.description
                                                                  }
                                                                </div>
                                                              </div>
                                                            )}
                                                          </div>
                                                        ) : (
                                                          <div
                                                            className="col-12 no-pm"
                                                            key={exIndex}
                                                            style={{
                                                              backgroundColor:
                                                                "#ffffff",
                                                              borderRadius: 15,
                                                              color: "#020202",
                                                            }}
                                                          >
                                                            {exercise.super_series &&
                                                              exercise.super_series.map(
                                                                (
                                                                  supSer: any,
                                                                  supSerIndex: number
                                                                ) => (
                                                                  <div
                                                                    className="row col-12 p-30 m-0 mb-2"
                                                                    key={
                                                                      supSerIndex
                                                                    }
                                                                  >
                                                                    <div className="col-12 p-3 m-0 mb-2 d-flex justify-content-between align-items-center">
                                                                      <span className="sign-card-sign-label-size ">
                                                                        <b>
                                                                          {"🔵 " +
                                                                            supSer
                                                                              .exe
                                                                              .name +
                                                                            " "}
                                                                        </b>
                                                                      </span>

                                                                      <Tooltip title="Video">
                                                                        <IconButton
                                                                          onClick={() => {
                                                                            showExercise(
                                                                              supSer
                                                                                .exe
                                                                                .video
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
                                                                            src={
                                                                              PlayerIcon
                                                                            }
                                                                          />
                                                                        </IconButton>
                                                                      </Tooltip>
                                                                    </div>
                                                                    <div className="col-12 d-flex justify-content-between pb-4">
                                                                      <div className="col row">
                                                                        <div className="col-12 text-align-center sign-card-sign-label-size">
                                                                          SERIE
                                                                        </div>
                                                                        <div className="col-12 text-align-center exe-desc-label-size">
                                                                          {supSer.series
                                                                            ? supSer.series
                                                                            : "/"}
                                                                        </div>
                                                                      </div>
                                                                      <div className="col row">
                                                                        <div className="col-12 text-align-center sign-card-sign-label-size">
                                                                          RIPETIZIONI
                                                                        </div>
                                                                        <div className="col-12 text-align-center exe-desc-label-size">
                                                                          {supSer.repetitions
                                                                            ? supSer.repetitions
                                                                            : "/"}
                                                                        </div>
                                                                      </div>
                                                                      <div className="col row">
                                                                        <div className="col-12 text-align-center sign-card-sign-label-size">
                                                                          RIPOSO
                                                                        </div>
                                                                        <div className="col-12 text-align-center exe-desc-label-size">
                                                                          {Math.floor(
                                                                            supSer.stop /
                                                                              60
                                                                          )}
                                                                          m
                                                                          {supSer.stop %
                                                                            60}
                                                                          s
                                                                        </div>
                                                                      </div>
                                                                      <div className="col row">
                                                                        <div className="col-12 text-align-center sign-card-sign-label-size">
                                                                          CARICO
                                                                        </div>
                                                                        <div className="col-12 text-align-center exe-desc-label-size">
                                                                          {supSer.load
                                                                            ? supSer.load +
                                                                              "kg"
                                                                            : "/"}
                                                                        </div>
                                                                      </div>
                                                                      <div className="col row">
                                                                        <div className="col-12 text-align-center sign-card-sign-label-size">
                                                                          INTENSITA'
                                                                        </div>
                                                                        <div className="col-12 text-align-center exe-desc-label-size">
                                                                          {supSer.intensity
                                                                            ? supSer.intensity
                                                                            : "/"}
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                    {supSer.description !==
                                                                      "" && (
                                                                      <div className="col-12 row d-flex justify-content-center pb-30 mx-auto">
                                                                        <div className="col-12 text-align-left sign-card-sign-label-size">
                                                                          DESCRIZIONE
                                                                        </div>
                                                                        <div className="col-12 text-align-left exe-desc-label-size">
                                                                          {
                                                                            supSer.description
                                                                          }
                                                                        </div>
                                                                      </div>
                                                                    )}
                                                                  </div>
                                                                )
                                                              )}
                                                          </div>
                                                        )
                                                    )}
                                                </div>
                                              ) : (
                                                <></>
                                              );
                                            }
                                          )}
                                      </div>
                                    </div>
                                  )
                              )}
                          </div>
                        </div>
                      )
                  )}

                <Modal
                  open={videoIndex !== ""}
                  onClose={() => setVideoIndex("")}
                >
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
            </div>
          </div>
          <br />
          <br />
        </div>
      ) : (
        <div className="col m-auto py-0 row mt-4 padding-page">
          <div className="panel col-12 m-0 row padding-page-half justify-content-between pb-3 zoom-in">
            <div className="col-12 m-0 p-0 mt-3 text-align-center">
              <span className="text-font-big">
                Non hai nessuna scheda personalizzata
              </span>
            </div>
          </div>
        </div>
      )}

      <Footer></Footer>
    </div>
  );
};

export default SchedaPersDetailUserPage;
