import {
  Box,
  Button,
  ButtonProps,
  Checkbox,
  FormLabel,
  IconButton,
  InputAdornment,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  styled,
  TextField,
  Tooltip,
  Modal,
} from "@mui/material";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import {
  BASE_VIDEO_URL,
  formQuestions,
  marks,
  tools_to_use,
} from "../constants/TypeConstants";
import { IFormUserCard } from "../models/ComponentInterface";
import { SignCard } from "./SignCard";
import MaleIcon from "../assets/images/gender-male-icon.png";
import MaleIconBlack from "../assets/images/gender-male-icon-black.png";
import FemaleIcon from "../assets/images/gender-female-icon.png";
import FemaleIconBlack from "../assets/images/gender-female-icon-black.png";
import AcceptIcon from "../assets/images/icon-accept.png";
import DisagreeIcon from "../assets/images/icon-disagree.png";
import AcceptIconBW from "../assets/images/icon-accept-bw.png";
import DisagreeIconBW from "../assets/images/icon-disagree-bw.png";
import { getGenderName } from "../services/PackLevelService";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Textarea } from "@mui/joy";
import React from "react";
import Vimeo from "@u-wave/react-vimeo";
import PlayerIcon from "../assets/images/playButton.png";
import { PAYMENT_PATH } from "../constants/PathConstants";
import { useNavigate } from "react-router-dom";
import { QuestionAnswer } from "@mui/icons-material";

export const FormUserCard: React.FC<IFormUserCard> = ({
  step,
  userForm,
  handleSelectOption,
  handleChangeStep,
  sendForm,
}) => {
  const [smallTools, setSmallTools] = React.useState<string[]>([]);
  const [videoIndex, setVideoIndex] = React.useState<string>("");
  const [videoUrl, setVideoUrl] = React.useState<string>("");
  const navigate = useNavigate();

  const handleChangeDate = (event: any) => {
    const dataFormattata = event.format("YYYY-MM-DD");
    handleSelectOption(userForm[3].question, dataFormattata);
  };

  const showExercise = (idVideo: string) => {
    setVideoUrl(BASE_VIDEO_URL + idVideo + "?dnt=1");
    setVideoIndex(idVideo);
  };

  const handleSelectOptionSlider = (
    event: any,
    newValue: number | number[]
  ) => {
    let val = newValue as number;
    if (
      event.target &&
      event.target.name &&
      event.target.name === "slider-pag5-1"
    ) {
      handleSelectOption(userForm[35].question, val + "");
    }
    if (
      event.target &&
      event.target.name &&
      event.target.name === "slider-pag5-2"
    ) {
      handleSelectOption(userForm[36].question, val + "");
    }
    if (
      event.target &&
      event.target.name &&
      event.target.name === "slider-pag5-3"
    ) {
      handleSelectOption(userForm[37].question, val + "");
    }
    if (
      event.target &&
      event.target.name &&
      event.target.name === "slider-pag5-4"
    ) {
      handleSelectOption(userForm[38].question, val + "");
    }

    if (
      event.target &&
      event.target.name &&
      event.target.name === "slider-pag5-5"
    ) {
      handleSelectOption(userForm[43].question, val + "");
    }
    if (
      event.target &&
      event.target.name &&
      event.target.name === "slider-pag5-6"
    ) {
      handleSelectOption(userForm[44].question, val + "");
    }
    if (event.target && event.target.name && event.target.name === "slider17") {
      handleSelectOption(userForm[17].question, val + "");
    }

    if (event.target && event.target.name && event.target.name === "slider8") {
      handleSelectOption(userForm[8].question, val + "");
    }
  };

  const handleChangeSliderRange = (
    event: Event,
    newValue: number | number[]
  ) => {
    let val = newValue as number[];
    handleSelectOption(userForm[15].question, val[0] + "-" + val[1]);
  };

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0]; // Ottieni il file selezionato

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        if (typeof base64String === "string") {
          handleSelectOption(userForm[47].question, base64String);
        }
      };
      reader.readAsDataURL(file); // Converte il file in un URL leggibile da <img>
    }
  };

  const checkIfAllSelected = (questionNumber: number, answer: string) => {
    if (answer.split(", ").indexOf("Seleziona tutto") > -1) {
      if (questionNumber === 19) {
        let answerArray = Array.from(
          new Set([
            ...(userForm[18].answer.includes("Casa")
              ? tools_to_use[0].tools
              : []),
            ...(userForm[18].answer.includes("HomeFitNexus")
              ? tools_to_use[1].tools
              : []),
            ...(userForm[18].answer.includes("Palestra")
              ? tools_to_use[2].tools
              : []),
            ...(userForm[18].answer.includes("Parco")
              ? tools_to_use[3].tools
              : []),
          ])
        );
        if (
          userForm[questionNumber].answer.split(",").length - 1 ===
          answerArray.length
        ) {
          handleSelectOption(userForm[questionNumber].question, "");
        } else {
          let string = "";
          answerArray.map((singleAnswer) => {
            string += singleAnswer + ",";
          });
          handleSelectOption(userForm[19].question, string);
        }
      } else if (
        userForm[questionNumber].answer.split(",").length - 1 ===
        formQuestions[questionNumber].answer.length
      ) {
        handleSelectOption(userForm[questionNumber].question, "");
      } else {
        let string = "";

        formQuestions[questionNumber].answer.map((singleAnswer) => {
          if (singleAnswer !== "Seleziona tutto") {
            string += singleAnswer + ", ";
          }
        });
        handleSelectOption(userForm[questionNumber].question, string);
      }
    }
    return;
  };

  const handleChangeSelectMulti = (event: any) => {
    const {
      target: { value },
    } = event;
    let val: string = value.join(", ");
    if (val.startsWith(", ")) {
      val = val.substring(2);
    }
    if (event.target.name == "multi1") {
      handleSelectOption(userForm[16].question, val);
    }
    if (event.target.name == "multi2") {
    }
    if (event.target.name == "multi3") {
      handleSelectOption(userForm[19].question, val);
      checkIfAllSelected(19, val);
    }
    if (event.target.name == "multi4") {
      handleSelectOption(userForm[20].question, val);
      checkIfAllSelected(20, val);
    }
    if (event.target.name == "multi5") {
      handleSelectOption(userForm[18].question, val);
    }
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
    <div className="panel big-card col-12 relative">
      <div className="col-12 p-2 m-3 text-align-left">
        <span className="font-weight-bold" style={{ whiteSpace: "pre-wrap" }}>
          {step === 1
            ? "Pagina 1"
            : step === 2
            ? "Pagina 2"
            : step === 3
            ? "Pagina 3"
            : step === 4
            ? "Test di forza - (Se non sei interessato ad un determinato esercizio dei test oppure non riesci ad eseguirlo scrivilo nella domanda; \n i test sono attendibili solo se svolti come nei video.)"
            : step === 5
            ? "Test di mobilità - (I valori vanno da 1 a 5, selezionare la risposta idonea in base alla vostra performance.)"
            : "Nutrizione"}
        </span>

        <Modal open={videoIndex !== ""} onClose={() => setVideoIndex("")}>
          <Box sx={modalStyle}>
            <div className="col-12 py-0 m-0 mt-3 mb-3 row pack-card-body padding-page-field">
              <div className="no-pm col">
                <div className="d-flex align-items-center justify-content-center col-12 no-pm">
                  <Vimeo
                    video={videoUrl}
                    loop={false}
                    autoplay={false}
                    responsive={true}
                    controls={true}
                    muted={false}
                    className="home-page-intro-video"
                    onEnd={() => setVideoIndex("")}
                  />
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </div>

      <div className="col-12 p-0 p-0 m-auto text-align-center">
        COMPILARE QUESTIONARIO
        <br />
        {step === 5 ||
          (step === 4 && (
            <i>
              <b>CLICCA SUL LOGO PER VEDERE L'ESECUZIONE</b>
            </i>
          ))}
      </div>
      {step === 1 && (
        <>
          {/* <div className="col-12 row m-0 p-0 mt-3">
            <div className="col-6">
              <TextField
                className="col-11"
                label={userForm[0].question}
                size="small"
                onChange={(event) => {
                  handleSelectOption(userForm[0].question, event.target.value);
                }}
                value={userForm[0].answer}
              />
            </div>
            <div className="col-6">
              <TextField
                className="col-11"
                label={userForm[1].question}
                size="small"
                onChange={(event) => {
                  handleSelectOption(userForm[1].question, event.target.value);
                }}
                value={userForm[1].answer}
              />
            </div>
          </div>
          <div className="col-12 row m-0 p-0 mt-3">
            <div className="col-6 m-0 padding-page-field mt-2 text-align-center">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={(userForm[5].answer !== "")?"sign-card-field-title answered-question":"sign-card-field-title not-answered-question"}
              >
                {userForm[2].question}
              </FormLabel>
              <div className="col-12 row no-pm justify-content-center">
                <div className="col navbar-icon my-auto p-0">
                  <Tooltip title={userForm[2].question}>
                    <IconButton
                      onClick={() => {
                        handleSelectOption(userForm[2].question, "M");
                      }}
                      size={isMobile ? "small" : "medium"}
                    >
                      <img
                        alt="Male"
                        className="navbar-img-little"
                        src={
                          userForm[2].answer === "M" ? MaleIcon : MaleIconBlack
                        }
                      />
                    </IconButton>
                  </Tooltip>
                </div>
                <div className="col navbar-icon my-auto p-0">
                  <Tooltip title="Femmina">
                    <IconButton
                      onClick={() => {
                        handleSelectOption(userForm[2].question, "F");
                      }}
                      size={isMobile ? "small" : "medium"}
                    >
                      <img
                        alt="Female"
                        className="navbar-img-little"
                        src={
                          userForm[2].answer === "F"
                            ? FemaleIcon
                            : FemaleIconBlack
                        }
                      />
                    </IconButton>
                  </Tooltip>
                </div>

                <span className="m-auto sign-card-sign-label-size">
                  {getGenderName(userForm[2].answer)}
                </span>
              </div>
            </div>
            <div className="col-6">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="col-11"
                  label="Data di nascita"
                  onChange={handleChangeDate}
                  format={"DD/MM/YYYY"}
                />
              </LocalizationProvider>
            </div>
          </div> */}

          <div className="col-12 row m-0 p-0 mt-3 mb-3">
            <div className="col-12 col-md-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={
                  userForm[4].answer !== ""
                    ? "sign-card-field-title answered-question"
                    : "sign-card-field-title not-answered-question"
                }
              >
                {userForm[4].question}
              </FormLabel>
              <br />
              <TextField
                className="col-11"
                label={userForm[4].question}
                size="small"
                onChange={(event) => {
                  handleSelectOption(userForm[4].question, event.target.value);
                }}
                value={userForm[4].answer}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">cm</InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="col-12 col-md-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={
                  userForm[5].answer !== ""
                    ? "sign-card-field-title answered-question"
                    : "sign-card-field-title not-answered-question"
                }
              >
                {userForm[5].question}
              </FormLabel>
              <br />
              <TextField
                className="col-11"
                label={userForm[5].question}
                size="small"
                onChange={(event) => {
                  handleSelectOption(userForm[5].question, event.target.value);
                }}
                value={userForm[5].answer}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kg</InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          <div className="col-12 row m-0 p-0 mt-3">
            <div className="col-12 col-md-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={
                  formQuestions[6].obbligatory
                    ? userForm[6].answer !== ""
                      ? "sign-card-field-title answered-question"
                      : "sign-card-field-title not-answered-question"
                    : "sign-card-field-title"
                }
              >
                {userForm[6].question}
              </FormLabel>
              <Textarea
                size="sm"
                onChange={(event) => {
                  handleSelectOption(userForm[6].question, event.target.value);
                }}
                minRows={3}
                color="neutral"
                value={userForm[6].answer}
              />
            </div>
            <div className="col-12 col-md-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={
                  userForm[7].answer !== ""
                    ? "sign-card-field-title answered-question"
                    : "sign-card-field-title not-answered-question"
                }
              >
                {userForm[7].question}
              </FormLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={userForm[7].answer}
                size="small"
                className="col-10"
                onChange={(event) => {
                  handleSelectOption(userForm[7].question, event.target.value);
                }}
              >
                <MenuItem value="">
                  <em>-----</em>
                </MenuItem>
                {formQuestions[7].answer.map((answer, index) => (
                  <MenuItem value={answer} key={index}>
                    {answer.replaceAll(
                      "{sex}",
                      userForm[2].answer === "M"
                        ? "o"
                        : userForm[2].answer === "F"
                        ? "a"
                        : "a/o"
                    )}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="col-12 row m-0 p-0 mt-3">
            <div className="col-12 col-md-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={
                  userForm[9].answer !== ""
                    ? "sign-card-field-title answered-question"
                    : "sign-card-field-title not-answered-question"
                }
              >
                {userForm[9].question}
              </FormLabel>

              <div className="col-12 row no-pm justify-content-center">
                <div className="col navbar-icon my-auto p-0">
                  <Tooltip title={"Sì"}>
                    <IconButton
                      onClick={() => {
                        handleSelectOption(userForm[9].question, "si");
                      }}
                      size={isMobile ? "small" : "medium"}
                    >
                      <img
                        alt="si"
                        className="navbar-img-little"
                        src={
                          userForm[9].answer === "si"
                            ? AcceptIcon
                            : AcceptIconBW
                        }
                      />
                    </IconButton>
                  </Tooltip>
                </div>
                <div className="col navbar-icon my-auto p-0">
                  <Tooltip title="No">
                    <IconButton
                      onClick={() => {
                        handleSelectOption(userForm[9].question, "no");
                      }}
                      size={isMobile ? "small" : "medium"}
                    >
                      <img
                        alt="no"
                        className="navbar-img-little"
                        src={
                          userForm[9].answer === "no"
                            ? DisagreeIcon
                            : DisagreeIconBW
                        }
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={
                  userForm[8].answer !== ""
                    ? "sign-card-field-title answered-question"
                    : "sign-card-field-title not-answered-question"
                }
              >
                {userForm[8].question}
              </FormLabel>
              <Slider
                name="slider8"
                aria-label="Temperature"
                valueLabelDisplay="auto"
                step={1}
                marks
                value={Number(
                  userForm[8].answer !== "" ? userForm[8].answer : "1"
                )}
                onChange={handleSelectOptionSlider}
                min={1}
                max={5}
              />

              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={
                  userForm[17].answer !== ""
                    ? "sign-card-field-title answered-question"
                    : "sign-card-field-title not-answered-question"
                }
              >
                {" "}
                {userForm[17].question}
              </FormLabel>
              <Slider
                name="slider17"
                aria-label="Temperature"
                valueLabelDisplay="auto"
                step={1}
                marks
                value={Number(
                  userForm[17].answer !== "" ? userForm[17].answer : "1"
                )}
                onChange={handleSelectOptionSlider}
                min={1}
                max={12}
              />
            </div>
          </div>

          {userForm[9].answer === "si" ? (
            <div className="col-12 row m-0 p-0 mt-3 mb-3">
              {/* <div className="col-6">
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  className={(userForm[5].answer !== "")?"sign-card-field-title answered-question":"sign-card-field-title not-answered-question"}
                >
                  {userForm[12].question}
                </FormLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={userForm[12].answer}
                  size="small"
                  className="col-10"
                  onChange={(event) => {
                    handleSelectOption(
                      userForm[12].question,
                      event.target.value
                    );
                  }}
                >
                  <MenuItem value="">
                    <em>-----</em>
                  </MenuItem>
                  {formQuestions[12].answer.map((answer, index) => (
                    <MenuItem value={answer} key={index}>
                      {answer}
                    </MenuItem>
                  ))}
                </Select>
              </div> */}
              <div className="col-12 col-md-6">
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  className={
                    userForm[13].answer !== ""
                      ? "sign-card-field-title answered-question"
                      : "sign-card-field-title not-answered-question"
                  }
                >
                  {userForm[13].question.replaceAll(
                    "{sex}",
                    userForm[2].answer === "M"
                      ? "o"
                      : userForm[2].answer === "F"
                      ? "a"
                      : "a/o"
                  )}
                </FormLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={userForm[13].answer}
                  size="small"
                  className="col-10"
                  onChange={(event) => {
                    handleSelectOption(
                      userForm[13].question,
                      event.target.value
                    );
                  }}
                >
                  <MenuItem value="">
                    <em>-----</em>
                  </MenuItem>
                  {formQuestions[13].answer.map((answer, index) => (
                    <MenuItem value={answer} key={index}>
                      {answer}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <div className="col-12 col-md-6">
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  className={
                    userForm[11].answer !== ""
                      ? "sign-card-field-title answered-question"
                      : "sign-card-field-title not-answered-question"
                  }
                >
                  {" "}
                  {userForm[11].question}
                </FormLabel>
                <Textarea
                  size="sm"
                  onChange={(event) => {
                    handleSelectOption(
                      userForm[11].question,
                      event.target.value
                    );
                  }}
                  minRows={3}
                  color="neutral"
                  value={userForm[11].answer}
                />
              </div>
            </div>
          ) : (
            <div className="col-12 row m-0 p-0 mt-3 mb-3">
              <div className="col-12 col-md-6 row no-pm justify-content-center">
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  className={
                    userForm[10].answer !== ""
                      ? "sign-card-field-title answered-question"
                      : "sign-card-field-title not-answered-question"
                  }
                >
                  {" "}
                  {userForm[10].question.replaceAll(
                    "{sex}",
                    userForm[2].answer === "M"
                      ? "o"
                      : userForm[2].answer === "F"
                      ? "a"
                      : "a/o"
                  )}
                </FormLabel>
                <div className="col navbar-icon my-auto p-0">
                  <Tooltip title={"Sì"}>
                    <IconButton
                      onClick={() => {
                        handleSelectOption(userForm[10].question, "si");
                      }}
                      size={isMobile ? "small" : "medium"}
                    >
                      <img
                        alt="si"
                        className="navbar-img-little"
                        src={
                          userForm[10].answer === "si"
                            ? AcceptIcon
                            : AcceptIconBW
                        }
                      />
                    </IconButton>
                  </Tooltip>
                </div>
                <div className="col navbar-icon my-auto p-0">
                  <Tooltip title="No">
                    <IconButton
                      onClick={() => {
                        handleSelectOption(userForm[10].question, "no");
                      }}
                      size={isMobile ? "small" : "medium"}
                    >
                      <img
                        alt="no"
                        className="navbar-img-little"
                        src={
                          userForm[10].answer === "no"
                            ? DisagreeIcon
                            : DisagreeIconBW
                        }
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              {userForm[10].answer === "si" ? (
                <div className="col-12 col-md-6">
                  <FormLabel
                    id="demo-controlled-radio-buttons-group"
                    className={
                      userForm[11].answer !== ""
                        ? "sign-card-field-title answered-question"
                        : "sign-card-field-title not-answered-question"
                    }
                  >
                    {" "}
                    {userForm[11].question}
                  </FormLabel>
                  <Textarea
                    size="sm"
                    onChange={(event) => {
                      handleSelectOption(
                        userForm[11].question,
                        event.target.value
                      );
                    }}
                    minRows={3}
                    color="neutral"
                    value={userForm[11].answer}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
        </>
      )}

      {step === 2 && (
        <>
          <div className="col-12 row m-0 p-0 mt-3">
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={
                  userForm[14].answer !== ""
                    ? "sign-card-field-title answered-question"
                    : "sign-card-field-title not-answered-question"
                }
              >
                {" "}
                {userForm[14].question}
              </FormLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={userForm[14].answer}
                size="small"
                className="col-10"
                onChange={(event) => {
                  handleSelectOption(userForm[14].question, event.target.value);
                }}
              >
                <MenuItem value="">
                  <em>-----</em>
                </MenuItem>
                {formQuestions[14].answer.map((answer, index) => (
                  <MenuItem value={answer} key={index}>
                    {answer}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={
                  userForm[15].answer === ""
                    ? "sign-card-field-title not-answered-question"
                    : "sign-card-field-title answered-question"
                }
              >
                {" "}
                {userForm[15].question}
              </FormLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={userForm[15].answer}
                size="small"
                className="col-10"
                onChange={(event) => {
                  handleSelectOption(userForm[15].question, event.target.value);
                }}
              >
                <MenuItem value="">
                  <em>-----</em>
                </MenuItem>
                {formQuestions[15].answer.map((answer, index) => (
                  <MenuItem value={answer} key={index}>
                    {answer}
                  </MenuItem>
                ))}
              </Select>
              {/* <Slider
                value={[
                  Number(userForm[15].answer.split("-")[0]),
                  Number(userForm[15].answer.split("-")[1]),
                ]}
                onChange={handleChangeSliderRange}
                valueLabelDisplay="auto"
                min={
                  userForm[14].answer === "2" || userForm[14].answer === "3"
                    ? 45
                    : 30
                }
              /> */}
            </div>
          </div>
          <div className="col-12 row m-0 p-0 mt-3">
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={
                  userForm[16].answer !== ""
                    ? "sign-card-field-title answered-question"
                    : "sign-card-field-title not-answered-question"
                }
              >
                {" "}
                {userForm[16].question}
              </FormLabel>
              <Select
                className="col-12"
                id="demo-multiple-checkbox"
                multiple
                name="multi1"
                value={userForm[16].answer.split(", ")}
                onChange={handleChangeSelectMulti}
                input={<OutlinedInput />}
                renderValue={(selected) => selected.join(", ")}
              >
                {formQuestions[16].answer.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox
                      checked={userForm[16].answer.indexOf(name) > -1}
                    />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={
                  userForm[46].answer !== ""
                    ? "sign-card-field-title answered-question"
                    : "sign-card-field-title not-answered-question"
                }
              >
                {userForm[46].question}
              </FormLabel>
              <Textarea
                size="sm"
                onChange={(event) => {
                  handleSelectOption(userForm[46].question, event.target.value);
                }}
                minRows={3}
                color="neutral"
                value={userForm[46].answer}
              />
            </div>
          </div>
          <div className="col-12 row m-0 p-0 mt-3">
            {userForm[16].answer.split(", ").length >= 1 && (
              <div className="col-6">
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  // className={
                  //   userForm[25].answer !== ""
                  //     ? "sign-card-field-title answered-question"
                  //     : "sign-card-field-title not-answered-question"
                  // }
                  className={"sign-card-field-title"}
                >
                  {userForm[25].question}
                </FormLabel>
                <Textarea
                  size="sm"
                  onChange={(event) => {
                    handleSelectOption(
                      userForm[25].question,
                      event.target.value
                    );
                  }}
                  minRows={3}
                  color="neutral"
                  value={userForm[25].answer}
                />
              </div>
            )}
          </div>
        </>
      )}

      {step === 3 && (
        <div className="col-12 row m-0 p-0 mt-3">
          <div className="col-6">
            <FormLabel
              id="demo-controlled-radio-buttons-group"
              className={
                userForm[18].answer !== ""
                  ? "sign-card-field-title answered-question"
                  : "sign-card-field-title not-answered-question"
              }
            >
              {userForm[18].question}
            </FormLabel>
            <br />
            <Select
              className="col-12"
              id="demo-multiple-checkbox"
              multiple
              name="multi5"
              value={userForm[18].answer.split(", ")}
              onChange={handleChangeSelectMulti}
              input={<OutlinedInput />}
              renderValue={(selected) => selected.join(", ")}
            >
              {formQuestions[18].answer.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={userForm[18].answer.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className="col-6">
            <FormLabel
              id="demo-controlled-radio-buttons-group"
              className={"sign-card-field-title"}
            >
              {userForm[19].question}
            </FormLabel>
            <Select
              className="col-12"
              id="demo-multiple-checkbox"
              name="multi3"
              multiple
              value={userForm[19].answer.split(", ")}
              onChange={handleChangeSelectMulti}
              input={<OutlinedInput />}
              renderValue={(selected) => selected.join(", ")}
            >
              <MenuItem key={"Seleziona tutto"} value={"Seleziona tutto"}>
                <Checkbox
                  checked={userForm[19].answer.indexOf("Seleziona tutto") > -1}
                />
                <ListItemText primary={"Seleziona tutto"} />
              </MenuItem>
              {Array.from(
                new Set([
                  ...(userForm[18].answer.includes("Casa")
                    ? tools_to_use[0].tools
                    : []),
                  ...(userForm[18].answer.includes("HomeFitNexus")
                    ? tools_to_use[1].tools
                    : []),
                  ...(userForm[18].answer.includes("Palestra")
                    ? tools_to_use[2].tools
                    : []),
                  ...(userForm[18].answer.includes("Parco")
                    ? tools_to_use[3].tools
                    : []),
                ])
              )
                .sort()
                .map((name, index) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox
                      checked={userForm[19].answer.indexOf(name) > -1}
                    />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
            </Select>
          </div>
          <div className="col-6">
            {userForm[18].answer.split(",").length > 1 && (
              <>
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  className={
                    userForm[18].answer.split(",").length > 1
                      ? userForm[45].answer !== ""
                        ? "sign-card-field-title answered-question"
                        : "sign-card-field-title not-answered-question"
                      : "sign-card-field-title"
                  }
                >
                  {userForm[45].question}
                </FormLabel>
                <Textarea
                  size="sm"
                  onChange={(event) => {
                    handleSelectOption(
                      userForm[45].question,
                      event.target.value
                    );
                  }}
                  minRows={3}
                  color="neutral"
                  value={userForm[45].answer}
                />
              </>
            )}
          </div>
          {(userForm[18].answer.includes("HomeFitNexus") ||
            userForm[18].answer.includes("Palestra")) && (
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {userForm[20].question}
              </FormLabel>
              <Select
                className="col-12"
                id="demo-multiple-checkbox"
                name="multi4"
                multiple
                value={userForm[20].answer.split(", ")}
                onChange={handleChangeSelectMulti}
                input={<OutlinedInput />}
                renderValue={(selected) => selected.join(", ")}
              >
                <MenuItem key={"Seleziona tutto"} value={"Seleziona tutto"}>
                  <Checkbox
                    checked={
                      userForm[20].answer.indexOf("Seleziona tutto") > -1
                    }
                  />
                  <ListItemText primary={"Seleziona tutto"} />
                </MenuItem>

                {formQuestions[20].answer.sort().map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox
                      checked={userForm[20].answer.indexOf(name) > -1}
                    />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}
          {(userForm[19].answer.includes("kettlebell") ||
            userForm[19].answer.includes("manubri") ||
            userForm[19].answer.includes("bilanciere")) && (
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {userForm[28].question}
              </FormLabel>
              <Textarea
                size="sm"
                onChange={(event) => {
                  handleSelectOption(userForm[28].question, event.target.value);
                }}
                minRows={3}
                color="neutral"
                value={userForm[28].answer}
              />
            </div>
          )}
          {/* {(userForm[20].answer.includes("lat machine") ||
            userForm[20].answer.includes("pulley row")) && (
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {userForm[29].question}
              </FormLabel>
              <Textarea
                size="sm"
                onChange={(event) => {
                  handleSelectOption(userForm[29].question, event.target.value);
                }}
                minRows={3}
                color="neutral"
                value={userForm[29].answer}
              />
            </div>
          )} */}
          {/* {userForm[20].answer.includes("cable station") && (
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {userForm[30].question}
              </FormLabel>
              <Textarea
                size="sm"
                onChange={(event) => {
                  handleSelectOption(userForm[30].question, event.target.value);
                }}
                minRows={3}
                color="neutral"
                value={userForm[30].answer}
              />
            </div>
          )} */}
        </div>
      )}

      {step === 4 && (
        <>
          <div className="col-12 row m-0 p-0 mt-3">
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {" "}
                {userForm[22].question}
                <Tooltip title="Video">
                  <IconButton
                    onClick={() => {
                      showExercise("950377191");
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
              </FormLabel>
              <Textarea
                size="sm"
                onChange={(event) => {
                  handleSelectOption(userForm[22].question, event.target.value);
                }}
                minRows={3}
                color="neutral"
                value={userForm[22].answer}
              />
            </div>

            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {" "}
                {userForm[23].question}
                <Tooltip title="Video">
                  <IconButton
                    onClick={() => {
                      showExercise("950377023");
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
              </FormLabel>
              <Textarea
                size="sm"
                onChange={(event) => {
                  handleSelectOption(userForm[23].question, event.target.value);
                }}
                minRows={3}
                color="neutral"
                value={userForm[23].answer}
              />
            </div>
          </div>
          <div className="col-12 row m-0 p-0 mt-3">
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {" "}
                {userForm[24].question}
                <Tooltip title="Video">
                  <IconButton
                    onClick={() => {
                      showExercise("950377989");
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
              </FormLabel>
              <Textarea
                size="sm"
                onChange={(event) => {
                  handleSelectOption(userForm[24].question, event.target.value);
                }}
                minRows={3}
                color="neutral"
                value={userForm[24].answer}
              />
            </div>
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {" "}
                {userForm[31].question}
                <Tooltip title="Video">
                  <IconButton
                    onClick={() => {
                      showExercise("950378219");
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
                <Tooltip title="Video">
                  <IconButton
                    onClick={() => {
                      showExercise("950378120");
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
              </FormLabel>
              <Textarea
                size="sm"
                onChange={(event) => {
                  handleSelectOption(userForm[31].question, event.target.value);
                }}
                minRows={3}
                color="neutral"
                value={userForm[31].answer}
              />
            </div>
          </div>
          {(userForm[18].answer.includes("Palestra") ||
            userForm[18].answer.includes("HomeFitNexus")) && (
            <div className="col-12 row m-0 p-0 mt-3">
              <div className="col-6">
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  className={"sign-card-field-title"}
                >
                  {" "}
                  {userForm[32].question}
                  <Tooltip title="Video">
                    <IconButton
                      onClick={() => {
                        showExercise("950377328");
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
                </FormLabel>
                <Textarea
                  size="sm"
                  onChange={(event) => {
                    handleSelectOption(
                      userForm[32].question,
                      event.target.value
                    );
                  }}
                  minRows={3}
                  color="neutral"
                  value={userForm[32].answer}
                />
              </div>
              <div className="col-6">
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  className={"sign-card-field-title"}
                >
                  {" "}
                  {userForm[33].question}
                  <Tooltip title="Video">
                    <IconButton
                      onClick={() => {
                        showExercise("950377451");
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
                </FormLabel>
                <Textarea
                  size="sm"
                  onChange={(event) => {
                    handleSelectOption(
                      userForm[33].question,
                      event.target.value
                    );
                  }}
                  minRows={3}
                  color="neutral"
                  value={userForm[33].answer}
                />
              </div>
            </div>
          )}
          {(userForm[18].answer.includes("Palestra") ||
            userForm[18].answer.includes("HomeFitNexus")) && (
            <div className="col-12 row m-0 p-0 mt-3">
              <div className="col-6">
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  className={"sign-card-field-title"}
                >
                  {" "}
                  {userForm[34].question}
                  <Tooltip title="Video">
                    <IconButton
                      onClick={() => {
                        showExercise("950377553");
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
                  <Tooltip title="Video">
                    <IconButton
                      onClick={() => {
                        showExercise("950377652");
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
                </FormLabel>
                <Textarea
                  size="sm"
                  onChange={(event) => {
                    handleSelectOption(
                      userForm[34].question,
                      event.target.value
                    );
                  }}
                  minRows={3}
                  color="neutral"
                  value={userForm[34].answer}
                />
              </div>
            </div>
          )}
        </>
      )}
      {step === 5 && (
        <>
          <div className="col-12 row m-0 p-0 mt-3">
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {userForm[37].question}
                <Tooltip title="Video">
                  <IconButton
                    onClick={() => {
                      showExercise("1004055908");
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
              </FormLabel>
              <Slider
                name="slider-pag5-3"
                aria-label="Temperature"
                valueLabelDisplay="auto"
                step={1}
                marks
                value={Number(
                  userForm[37].answer !== "" ? userForm[37].answer : "1"
                )}
                onChange={handleSelectOptionSlider}
                min={1}
                max={5}
              />
            </div>

            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {userForm[36].question}
                <Tooltip title="Video">
                  <IconButton
                    onClick={() => {
                      showExercise("1004057837");
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
              </FormLabel>
              <Slider
                name="slider-pag5-2"
                aria-label="Temperature"
                valueLabelDisplay="auto"
                step={1}
                marks
                value={Number(
                  userForm[36].answer !== "" ? userForm[36].answer : "1"
                )}
                onChange={handleSelectOptionSlider}
                min={1}
                max={5}
              />
            </div>
          </div>
          <div className="col-12 row m-0 p-0 mt-3">
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {userForm[43].question}
                <Tooltip title="Video">
                  <IconButton
                    onClick={() => {
                      showExercise("1004057256");
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
              </FormLabel>
              <Slider
                name="slider-pag5-5"
                aria-label="Temperature"
                valueLabelDisplay="auto"
                step={1}
                marks
                value={Number(
                  userForm[43].answer !== "" ? userForm[43].answer : "1"
                )}
                onChange={handleSelectOptionSlider}
                min={1}
                max={5}
              />
            </div>

            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {userForm[44].question}
                <Tooltip title="Video">
                  <IconButton
                    onClick={() => {
                      showExercise("1004058437");
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
              </FormLabel>
              <Slider
                name="slider-pag5-6"
                aria-label="Temperature"
                valueLabelDisplay="auto"
                step={1}
                marks
                value={Number(
                  userForm[44].answer !== "" ? userForm[44].answer : "1"
                )}
                onChange={handleSelectOptionSlider}
                min={1}
                max={5}
              />
            </div>
          </div>
          <div className="col-12 row m-0 p-0 mt-3">
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {userForm[35].question}
                <Tooltip title="Video">
                  <IconButton
                    onClick={() => {
                      showExercise("950376048");
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
              </FormLabel>
              <Slider
                name="slider-pag5-1"
                aria-label="Temperature"
                valueLabelDisplay="auto"
                step={1}
                marks
                value={Number(
                  userForm[35].answer !== "" ? userForm[35].answer : "1"
                )}
                onChange={handleSelectOptionSlider}
                min={1}
                max={5}
              />
            </div>

            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {userForm[38].question}
                <Tooltip title="Video">
                  <IconButton
                    onClick={() => {
                      showExercise("964695343");
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
              </FormLabel>
              <Slider
                name="slider-pag5-4"
                aria-label="Temperature"
                valueLabelDisplay="auto"
                step={1}
                marks
                value={Number(
                  userForm[38].answer !== "" ? userForm[38].answer : "1"
                )}
                onChange={handleSelectOptionSlider}
                min={1}
                max={5}
              />
            </div>
          </div>
        </>
      )}
      {step === 6 && (
        <>
          <div className="col-12 row m-0 p-0 mt-3">
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {userForm[39].question}
              </FormLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={userForm[39].answer}
                size="small"
                className="col-10"
                onChange={(event) => {
                  handleSelectOption(userForm[39].question, event.target.value);
                }}
              >
                <MenuItem value="">
                  <em>-----</em>
                </MenuItem>
                {formQuestions[39].answer.map((answer, index) => (
                  <MenuItem value={answer} key={index}>
                    {answer}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {userForm[40].question}
              </FormLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={userForm[40].answer}
                size="small"
                className="col-10"
                onChange={(event) => {
                  handleSelectOption(userForm[40].question, event.target.value);
                }}
              >
                <MenuItem value="">
                  <em>-----</em>
                </MenuItem>
                {formQuestions[40].answer.map((answer, index) => (
                  <MenuItem value={answer} key={index}>
                    {answer}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="col-12 row m-0 p-0 mt-3">
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {userForm[41].question}
              </FormLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={userForm[41].answer}
                size="small"
                className="col-10"
                onChange={(event) => {
                  handleSelectOption(userForm[41].question, event.target.value);
                }}
              >
                <MenuItem value="">
                  <em>-----</em>
                </MenuItem>
                {formQuestions[41].answer.map((answer, index) => (
                  <MenuItem value={answer} key={index}>
                    {answer}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {userForm[42].question}
              </FormLabel>
              <Textarea
                size="sm"
                onChange={(event) => {
                  handleSelectOption(userForm[42].question, event.target.value);
                }}
                minRows={3}
                color="neutral"
                value={userForm[42].answer}
              />
            </div>
          </div>
          <div className="col-12 row m-0 p-0 mt-3">
            <div className="col-6">
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                className={"sign-card-field-title"}
              >
                {userForm[26].question}
              </FormLabel>
              <Textarea
                size="sm"
                onChange={(event) => {
                  handleSelectOption(userForm[26].question, event.target.value);
                }}
                minRows={3}
                color="neutral"
                value={userForm[26].answer}
              />
            </div>
          </div>
          <div className="col-6 m-0 padding-page-field mt-4">
            <FormLabel
              id="demo-controlled-radio-buttons-group"
              className="sign-card-field-title"
            >
              Immagine
            </FormLabel>

            {/* Pulsante per selezionare l'immagine */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{
                display: "block",
                padding: "20px",
                marginTop: "10px",
                textAlign: "center",
                border: "2px dashed #ccc",
              }}
            />

            {/* Anteprima dell'immagine caricata */}
            {userForm[47].answer !== ""  && (
              <div style={{ marginTop: "20px" }}>
                <img
                  src={userForm[47].answer}
                  alt="Preview"
                  style={{ width: "100%" }}
                />
              </div>
            )}
          </div>

          <div className="col-12 m-0 p-0 pt-4 text-align-center">
            <ColoredButton
              className="button-size ml-1 button-font-size"
              onClick={() => {
                sendForm();
              }}
            >
              Acquista
            </ColoredButton>
          </div>
        </>
      )}

      <div className="col-12 row m-0 p-0 mt-5 mb-3">
        <Stack spacing={2}>
          <Pagination
            className="m-auto"
            color="primary"
            count={6}
            variant="outlined"
            shape="rounded"
            onChange={handleChangeStep}
          />
        </Stack>
      </div>
    </div>
  );
};
