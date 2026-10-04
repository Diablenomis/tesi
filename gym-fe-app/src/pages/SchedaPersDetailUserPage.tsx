import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  Stack,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { LS_USER, LS_USER_TYPE } from "../constants/TypeConstants";
import { IPackPers } from "../models/Pack";
import PackService from "../services/PackService";
import { getStorageValue } from "../services/LocalStorage";
import { Footer } from "../components/Footer";
import DefaulHeader from "../components/DefaultHeader";
import PlayerIcon from "../assets/images/playButton.png";
import { isMobile } from "react-device-detect";

const SchedaPersDetailUserPage: React.FC = () => {
  const { packPersId } = useParams();
  const [user, setUser] = useState<string>("");
  const [isUserAdminLoggedIn, setIsUserAdminLoggedIn] = useState<boolean>(false);
  const [packPers, setPackPers] = useState<IPackPers | null>(null);
  const [indexWeekShow, setIndexWeekShow] = useState<number>(0);
  const [indexDayShow, setIndexDayShow] = useState<number>(0);
  const [videoIndex, setVideoIndex] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const activeWeek = useMemo(
    () => packPers?.weeks?.[indexWeekShow],
    [packPers, indexWeekShow]
  );
  const activeDay = useMemo(
    () => activeWeek?.days?.[indexDayShow],
    [activeWeek, indexDayShow]
  );

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
    const storedUser = getStorageValue(LS_USER) || "";
    const userType = getStorageValue(LS_USER_TYPE) || "";
    setIsUserAdminLoggedIn(userType === "coach");
    setUser(storedUser);
  };

  const changeWeek = (indexWeek: number) => {
    setIndexWeekShow(indexWeek);
    setIndexDayShow(0);
  };

  const showExercise = (idVideo: string) => {
    setVideoIndex(idVideo);
  };

  const downloadPDF = async () => {
    try {
      const element = document.getElementById("scheda");

      if (!element) {
        return;
      }

      const canvas = await html2canvas(element, {
        onclone: (clonedDocument) => {
          // Export the final layout, without restarting the entrance animation.
          const sheet = clonedDocument.getElementById("scheda");
          if (sheet) sheet.style.animation = "none";
        },
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

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
    width: "92%",
    maxWidth: 900,
    bgcolor: "#ffffff",
    borderRadius: "18px",
    boxShadow: 24,
    textAlign: "center",
    p: 2,
  };

  const PageWrapper = styled("div")(() => ({
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f9fbff 0%, #f4f8ff 100%)",
  }));

  const Content = styled(Box)(() => ({
    maxWidth: 1200,
    margin: "0 auto",
    padding: isMobile ? "140px 16px 80px" : "180px 28px 100px",
  }));

  const HeroCard = styled(Box)(() => ({
    background: "#ffffff",
    border: "1px solid #e6ecf2",
    borderRadius: 20,
    padding: isMobile ? "18px" : "26px",
    color: "#192b3f",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  }));

  const SelectorCard = styled(Box)(() => ({
    background: "#ffffff",
    borderRadius: 16,
    padding: isMobile ? "16px" : "18px",
    border: "1px solid #e6ecf2",
    boxShadow: "0 14px 32px rgba(0,0,0,0.08)",
  }));

  const PillButton = styled(Button)<ButtonProps>(() => ({
    minWidth: 46,
    height: 46,
    borderRadius: 14,
    padding: 0,
    margin: "4px 6px",
    background: "#f4f7fa",
    border: "1px solid #e1e6ec",
    color: "#192b3f",
    fontWeight: 700,
    "&:hover": {
      background: "#e9f2ff",
      borderColor: "#c9d8f0",
    },
    "&.active": {
      background: "linear-gradient(135deg, #a6ce24 0%, #89b51c 100%)",
      color: "#0f1b2f",
      boxShadow: "0 12px 30px rgba(166,206,36,0.35)",
      borderColor: "transparent",
    },
  }));

  const SectionCard = styled(Box)(() => ({
    background: "#ffffff",
    border: "1px solid #e6ecf2",
    borderRadius: 18,
    padding: isMobile ? "16px" : "22px",
    boxShadow: "0 20px 46px rgba(0,0,0,0.1)",
  }));

  const ExerciseCard = styled(Box)(() => ({
    background: "#f9fbff",
    borderRadius: 14,
    padding: isMobile ? "12px" : "16px",
    border: "1px solid #e6ecf2",
    boxShadow: "0 12px 26px rgba(0,0,0,0.08)",
    marginBottom: 14,
    color: "#192b3f",
  }));

  const StatBox = styled(Box)(() => ({
    background: "#f6f9fb",
    borderRadius: 12,
    padding: "10px 12px",
    border: "1px solid #e6ecf2",
    textAlign: "center",
    minWidth: 110,
  }));

  const ColoredButton = styled(Button)<ButtonProps>(() => ({
    backgroundColor: "#a6ce24",
    color: "#0f1b2f",
    fontWeight: 700,
    textTransform: "none",
    borderRadius: 12,
    padding: "10px 18px",
    boxShadow: "0 12px 30px rgba(166,206,36,0.35)",
    "&:hover": {
      color: "#0f1b2f",
      backgroundColor: "#c5e563",
    },
  }));

  const formatRest = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}m ${sec}s`;
  };

  const renderExerciseName = (name: string) => (
    <Typography
      variant={isMobile ? "subtitle1" : "h6"}
      fontWeight={800}
      sx={{ letterSpacing: "0.2px" }}
      color="#192b3f"
    >
      {"> "} {name}
    </Typography>
  );

  return (
    <PageWrapper>
      <DefaulHeader />

      {isLoading ? (
        <div className="d-flex align-items-center justify-content-center mt-5 padding-page content-container">
          <CircularProgress style={{ color: "#192b3f" }} />
        </div>
      ) : packPers ? (
        <Content>
          <HeroCard className="zoom-in">
            <Stack
              direction={isMobile ? "column" : "row"}
              alignItems={isMobile ? "flex-start" : "center"}
              justifyContent="space-between"
              gap={isMobile ? 1.5 : 2.5}
            >
              <Box>
                <Typography variant="overline" sx={{ color: "#a6ce24" }}>
                  La tua scheda personalizzata
                </Typography>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  fontWeight={800}
                  color="#192b3f"
                >
                  Settimana {indexWeekShow + 1} | Giorno {indexDayShow + 1}
                </Typography>
                <Typography variant="body2" sx={{ color: "#4f5f7a" }}>
                  Naviga tra le settimane e i giorni, guarda i video degli
                  esercizi e scarica la scheda in PDF per averla sempre con te.
                </Typography>
              </Box>
              <ColoredButton onClick={downloadPDF}>Scarica PDF</ColoredButton>
            </Stack>
          </HeroCard>

          <Stack direction={isMobile ? "column" : "row"} gap={2} mt={3}>
            <SelectorCard className="zoom-in" sx={{ flex: 1 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Typography variant="subtitle1" fontWeight={700} color="#192b3f">
                  Settimana
                </Typography>
                <Typography variant="caption" color="#6b7a8e">
                  Seleziona il blocco di lavoro
                </Typography>
              </Stack>
              <Divider sx={{ borderColor: "#e6ecf2", mb: 1.5 }} />
              <Box display="flex" flexWrap="wrap">
                {packPers.weeks?.map((_, indexWeek: number) => (
                  <PillButton
                    key={indexWeek}
                    onClick={() => changeWeek(indexWeek)}
                    className={indexWeek === indexWeekShow ? "active" : ""}
                  >
                    {indexWeek + 1}
                  </PillButton>
                ))}
              </Box>
            </SelectorCard>
            <SelectorCard className="zoom-in" sx={{ flex: 1 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Typography variant="subtitle1" fontWeight={700} color="#192b3f">
                  Giorno
                </Typography>
                <Typography variant="caption" color="#6b7a8e">
                  Focus della settimana
                </Typography>
              </Stack>
              <Divider sx={{ borderColor: "#e6ecf2", mb: 1.5 }} />
              <Box display="flex" flexWrap="wrap">
                {activeWeek?.days?.map((_, indexDay: number) => (
                  <PillButton
                    key={indexDay}
                    onClick={() => setIndexDayShow(indexDay)}
                    className={indexDay === indexDayShow ? "active" : ""}
                  >
                    {indexDay + 1}
                  </PillButton>
                ))}
              </Box>
            </SelectorCard>
          </Stack>

          <Box id="scheda" mt={3} className="zoom-in">
            {activeDay ? (
              <SectionCard>
                <Stack
                  direction={isMobile ? "column" : "row"}
                  alignItems={isMobile ? "flex-start" : "center"}
                  justifyContent="space-between"
                  gap={1}
                  mb={2}
                >
                  <Box>
                    <Typography
                      variant={isMobile ? "h5" : "h4"}
                      fontWeight={800}
                      sx={{ color: "#192b3f" }}
                    >
                      {activeDay.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#4f5f7a" }}>
                      Segui la sequenza di esercizi e controlla i dettagli di
                      serie, ripetizioni e recupero.
                    </Typography>
                  </Box>
                  <ColoredButton onClick={downloadPDF}>Esporta PDF</ColoredButton>
                </Stack>

                <Divider sx={{ borderColor: "#e6ecf2", mb: 3 }} />

                {activeDay.sections?.map((section: any, indexSection: number) =>
                  section.exercises.length > 0 ? (
                    <Box key={indexSection} mb={3}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1.5}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={800}
                          sx={{ color: "#a6ce24", textTransform: "uppercase" }}
                        >
                          {section.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#6b7a8e" }}>
                          {section.exercises.length} esercizi
                        </Typography>
                      </Box>

                      {section.exercises.map((exercise: any, exIndex: number) =>
                        exercise.exe ? (
                          <ExerciseCard key={exIndex}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              flexWrap="wrap"
                              gap={1}
                              mb={1}
                            >
                              {renderExerciseName(exercise.exe.name)}
                              {exercise.exe.video && (
                                <Button data-html2canvas-ignore="true" onClick={() => showExercise(exercise.exe.video)}>
                                  Guarda video
                                </Button>
                              )}
                            </Stack>

                            <Stack
                              direction={isMobile ? "column" : "row"}
                              flexWrap="wrap"
                              gap={1}
                              mb={exercise.description !== "" ? 1.5 : 0}
                            >
                              <StatBox>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#6b7a8e" }}
                                >
                                  Serie
                                </Typography>
                                <Typography variant="body1" fontWeight={800}>
                                  {exercise.series ? exercise.series : "/"}
                                </Typography>
                              </StatBox>
                              <StatBox>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#6b7a8e" }}
                                >
                                  Ripetizioni
                                </Typography>
                                <Typography variant="body1" fontWeight={800}>
                                  {exercise.repetitions
                                    ? exercise.repetitions
                                    : "/"}
                                </Typography>
                              </StatBox>
                              <StatBox>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#6b7a8e" }}
                                >
                                  Riposo
                                </Typography>
                                <Typography variant="body1" fontWeight={800}>
                                  {formatRest(exercise.stop)}
                                </Typography>
                              </StatBox>
                              <StatBox>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#6b7a8e" }}
                                >
                                  Carico
                                </Typography>
                                <Typography variant="body1" fontWeight={800}>
                                  {exercise.load ? `${exercise.load} kg` : "/"}
                                </Typography>
                              </StatBox>
                              <StatBox>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#6b7a8e" }}
                                >
                                  Intensita'
                                </Typography>
                                <Typography variant="body1" fontWeight={800}>
                                  {exercise.intensity || "/"}
                                </Typography>
                              </StatBox>
                            </Stack>

                            {exercise.description !== "" && (
                              <Box mt={1}>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#6b7a8e" }}
                                >
                                  Descrizione
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#192b3f" }}
                                >
                                  {exercise.description}
                                </Typography>
                              </Box>
                            )}
                          </ExerciseCard>
                        ) : (
                          <ExerciseCard key={exIndex}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={800}
                              sx={{ color: "#a6ce24", mb: 1 }}
                            >
                              Super Serie
                            </Typography>
                            {exercise.super_series &&
                              exercise.super_series.map(
                                (supSer: any, supSerIndex: number) => (
                                  <Box
                                    key={supSerIndex}
                                    sx={{
                                      borderBottom:
                                        supSerIndex !==
                                        exercise.super_series.length - 1
                                          ? "1px solid #e6ecf2"
                                          : "none",
                                      pb:
                                        supSerIndex !==
                                        exercise.super_series.length - 1
                                          ? 1.5
                                          : 0,
                                      mb:
                                        supSerIndex !==
                                        exercise.super_series.length - 1
                                          ? 1.5
                                          : 0,
                                    }}
                                  >
                                    <Stack
                                      direction="row"
                                      justifyContent="space-between"
                                      alignItems="center"
                                      flexWrap="wrap"
                                      gap={1}
                                      mb={1}
                                    >
                                      {renderExerciseName(supSer.exe.name)}
                                      {supSer.exe.video && (
                                        <Button data-html2canvas-ignore="true" onClick={() => showExercise(supSer.exe.video)}>
                                          Guarda video
                                        </Button>
                                      )}
                                    </Stack>

                                    <Stack
                                      direction={isMobile ? "column" : "row"}
                                      flexWrap="wrap"
                                      gap={1}
                                    >
                                      <StatBox>
                                        <Typography
                                          variant="caption"
                                          sx={{ color: "#6b7a8e" }}
                                        >
                                          Serie
                                        </Typography>
                                        <Typography
                                          variant="body1"
                                          fontWeight={800}
                                        >
                                          {supSer.series ? supSer.series : "/"}
                                        </Typography>
                                      </StatBox>
                                      <StatBox>
                                        <Typography
                                          variant="caption"
                                          sx={{ color: "#6b7a8e" }}
                                        >
                                          Ripetizioni
                                        </Typography>
                                        <Typography
                                          variant="body1"
                                          fontWeight={800}
                                        >
                                          {supSer.repetitions
                                            ? supSer.repetitions
                                            : "/"}
                                        </Typography>
                                      </StatBox>
                                      <StatBox>
                                        <Typography
                                          variant="caption"
                                          sx={{ color: "#6b7a8e" }}
                                        >
                                          Riposo
                                        </Typography>
                                        <Typography
                                          variant="body1"
                                          fontWeight={800}
                                        >
                                          {formatRest(supSer.stop)}
                                        </Typography>
                                      </StatBox>
                                      <StatBox>
                                        <Typography
                                          variant="caption"
                                          sx={{ color: "#6b7a8e" }}
                                        >
                                          Carico
                                        </Typography>
                                        <Typography
                                          variant="body1"
                                          fontWeight={800}
                                        >
                                          {supSer.load ? `${supSer.load} kg` : "/"}
                                        </Typography>
                                      </StatBox>
                                      <StatBox>
                                        <Typography
                                          variant="caption"
                                          sx={{ color: "#6b7a8e" }}
                                        >
                                          Intensita'
                                        </Typography>
                                        <Typography
                                          variant="body1"
                                          fontWeight={800}
                                        >
                                          {supSer.intensity || "/"}
                                        </Typography>
                                      </StatBox>
                                    </Stack>
                                    {supSer.description !== "" && (
                                      <Box mt={1}>
                                        <Typography
                                          variant="caption"
                                          sx={{ color: "#6b7a8e" }}
                                        >
                                          Descrizione
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          sx={{ color: "#192b3f" }}
                                        >
                                          {supSer.description}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                )
                              )}
                          </ExerciseCard>
                        )
                      )}
                    </Box>
                  ) : null
                )}
              </SectionCard>
            ) : (
              <SectionCard sx={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: "#192b3f" }}
                >
                  Nessun giorno disponibile
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b7a8e" }}>
                  Sembra che questa settimana non abbia ancora esercizi
                  assegnati.
                </Typography>
              </SectionCard>
            )}
          </Box>

          <Modal open={videoIndex !== ""} onClose={() => setVideoIndex("")}>
            <Box sx={modalStyle}>
              <div className="col-12 py-0 m-0 mt-3 mb-3 row pack-card-body padding-page-field">
                <div className="no-pm col">
                  <div className="d-flex align-items-center justify-content-center col-12 no-pm">
                    {/* Embed directly: hidden-on-Vimeo videos may not expose oEmbed. */}
                    <iframe
                      title="Video esercizio"
                      src={`https://player.vimeo.com/video/${encodeURIComponent(videoIndex)}?dnt=1`}
                      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                      allowFullScreen
                      style={{ width: "100%", aspectRatio: "16 / 9", border: 0 }}
                    />
                  </div>
                </div>
              </div>
            </Box>
          </Modal>
        </Content>
      ) : (
        <Content>
          <SectionCard sx={{ textAlign: "center" }}>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ color: "#192b3f" }}
            >
              Non hai nessuna scheda personalizzata
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7a8e" }}>
              Quando il tuo coach la pubblichera, la troverai qui pronta da
              seguire.
            </Typography>
          </SectionCard>
        </Content>
      )}

      <Footer />
      {message !== "" && (
        <Alert
          className="alert-position-top"
          severity={"error"}
          sx={{ background: "#ffffff", color: "#192b3f" }}
        >
          {message}
        </Alert>
      )}
    </PageWrapper>
  );
};

export default SchedaPersDetailUserPage;
