import {
  Alert,
  Autocomplete,
  Box,
  Button,
  ButtonProps,
  FormLabel,
  IconButton,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  styled,
  TextField,
  Tooltip,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { initialExerciseCreate } from "../constants/InitialEntities";
import { IExercise } from "../models/Pack";
import {
  getCoachIcon,
  getGenderName,
  getTypeName,
} from "../services/PackLevelService";
import CoachService from "../services/CoachService";
import { ICoach } from "../models/Coach";
import MaleIcon from "../assets/images/gender-male-icon.png";
import MaleIconBlack from "../assets/images/gender-male-icon-black.png";
import FemaleIcon from "../assets/images/gender-female-icon.png";
import FemaleIconBlack from "../assets/images/gender-female-icon-black.png";
import SchedaBaseIcon from "../assets/images/scheda-tutorial.png";
import SchedaBaseIconBlack from "../assets/images/scheda-tutorial-black.png";
import SchedaPersIcon from "../assets/images/scheda-personalizzata.png";
import SchedaPersIconBlack from "../assets/images/scheda-personalizzata-black.png";
import PackService from "../services/PackService";

import NeutralIcon from "../assets/images/gender-neutral-icon.png";
import NeutralIconBlack from "../assets/images/gender-neutral-icon-black.png";

export const AdminExerciseCreationPanel: React.FC = () => {
  const [exercise, setExercise] = useState<IExercise>(initialExerciseCreate);
  const [exerciseList, setExerciseList] = useState<IExercise[]>([]);
  const [exerciseEdited, setExerciseEdited] = useState<IExercise | null>(null);
  const [coachList, setCoachList] = useState<any>([]);
  const [message, setMessage] = useState<string>("");
  const [isMessageError, setIsMessageError] = useState<boolean>(false);
  const [isDeleteExercise, setIsDeleteExercise] = useState<boolean>(false);

  useEffect(() => {
    getExerciseList();
    getCoachList();
  }, []);

  const fetch = () => {
    getExerciseList();
  };

  const getExerciseList = () => {
    PackService.getExercises()
      .then((response) => {
        setExerciseList(response.data.data);
        setExerciseEdited(null);
        let ex: IExercise = {
          video: "",
          name: "",
          type: "",
          coaches: [],
          gender: "",
          id: 0,
        };
        setExercise(ex);
      })
      .catch((e: Error) => {
        setMessage(e.message);
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const getCoachList = () => {
    CoachService.getAllCoaches()
      .then((response) => {
        setCoachList(response.data.data);
      })
      .catch((e: Error) => {
        setMessage(e.message);
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setExercise({ ...exercise, [event.target.name]: event.target.value });
  };

  const handleChangeCoach = (coachSelected: ICoach) => {
    let coaches = exercise.coaches;
    let i = -1;
    coaches.forEach((coach, index) => {
      if (coach.email === coachSelected.email) {
        i = index;
      }
    });
    i === -1 ? coaches.push(coachSelected) : coaches.splice(i, 1);

    setExercise({ ...exercise, coaches });
  };

  const handleChangeSex = (sex: string) => {
    setExercise({ ...exercise, gender: sex });
  };

  const handleChangeType = (type: string) => {
    setExercise({ ...exercise, type });
  };

  const handleExerciseEditedChange = (exerciseSelected: IExercise | null) => {
    if (exerciseSelected !== null) {
      setExerciseEdited(exerciseSelected);
      setExercise(exerciseSelected);
    } else {
      setExerciseEdited(null);
      setExercise(initialExerciseCreate);
    }
  };

  const handleSave = () => {
    let isOkay = verifyValidationExercise();
    if (isOkay) {
      if (exerciseEdited !== null) {
        editExercise();
      } else {
        createNewExercise();
      }
    }
  };

  const createNewExercise = () => {
    PackService.createNewExercise(exercise)
      .then((response) => {
        setIsMessageError(false);
        setMessage("Esercizio creato con successo");
        fetch();
        setTimeout(() => {
          setMessage("");
        }, 4000);
      })
      .catch((e) => {
        setIsMessageError(true);
        setMessage("Errore creazione scheda");
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const editExercise = () => {
    if (exerciseEdited !== null) {
      PackService.editExercise(exercise)
        .then((response) => {
          setIsMessageError(false);
          setMessage("Esercizio modificato con successo");
          fetch();
          setTimeout(() => {
            setMessage("");
          }, 4000);
        })
        .catch((e) => {
          setIsMessageError(true);
          setMessage("Errore modificazione esercizio");
          setTimeout(() => {
            setMessage("");
          }, 4000);
        });
    }
  };

  const handleDeleteExercise = () => {
    setIsDeleteExercise(false);
    if (exerciseEdited !== null) {
      PackService.deleteExercise(exerciseEdited)
        .then((response) => {
          setIsMessageError(false);
          setMessage("Esercizio eliminato con successo");
          fetch();
          setTimeout(() => {
            setMessage("");
          }, 4000);
        })
        .catch((e) => {
          setIsMessageError(true);
          setMessage("Errore eliminazione esercizio");
          setTimeout(() => {
            setMessage("");
          }, 4000);
        });
    }
  };

  const verifyValidationExercise = () => {
    if (
      exercise.name.trim() === "" ||
      exercise.gender.trim() === "" ||
      exercise.video.trim() === "" ||
      exercise.type.trim() === "" 
      // exercise.coaches.length === 0
    ) {
      setIsMessageError(true);
      setMessage("Valorizzare i campi obbligatori");
      setTimeout(() => {
        setMessage("");
      }, 4000);
      return false;
    } else {
      return true;
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

  const ColoredButtonDelete = styled(Button)<ButtonProps>(({ theme }) => ({
    backgroundColor: "#f03",
    color: "#ffffff",
    fontWeight: 400,
    "&:hover": {
      color: "#ffffff",
      backgroundColor: "#cc0029",
    },
  }));

  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "16px",
    boxShadow: 24,
    textAlign: "center",
    p: 4,
  };

  return (
    <div className="col-12 no-pm">
      <div className="panel col-12 m-0 row padding-page-half justify-content-between pb-3 zoom-in">
        <div className="col-6 m-0 p-0 mt-3">
          <span className="text-font-big">Crea un esercizio</span>
        </div>

        <div className="col-6 m-0 p-0 mt-3 text-align-right">
          <span className="text-font-big">Modifica un esercizio</span>
          <Autocomplete
            size="small"
            className="col-12"
            value={exerciseEdited}
            onChange={(event: any, newValue: IExercise | null) => {
              handleExerciseEditedChange(newValue);
            }}
            getOptionLabel={(option) => option.name}
            options={exerciseList}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.name + " - "} {option.type === "T" ? "T" : "P"}
              </li>
            )}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>

        <div className="col-12 p-0 m-0 mt-2 text-align-center">
          <span className="sign-card-sign-label-size sign-card-color-field">
            Informazioni Generali
          </span>
        </div>
        <div className="col-11 m-auto p-0 mt-1">
          <hr className="col-12 no-pm" />
        </div>

        <div className="col-6 m-0 padding-page-field mt-4">
          <TextField
            label="Nome*"
            size="small"
            onChange={handleInput}
            name="name"
            className="col-12 no-pm"
            value={exercise.name}
          />
        </div>
        <div className="col-6 m-0 padding-page-field mt-4">
          <TextField
            label="Video*"
            size="small"
            onChange={handleInput}
            name="video"
            className="col-12 no-pm"
            value={exercise.video}
          />
        </div>

        <div className="col-12 col-md-6 m-0 padding-page-field mt-2 text-align-center">
          <FormLabel
            id="demo-controlled-radio-buttons-group"
            className="sign-card-field-title"
          >
            Sesso*
          </FormLabel>
          <div className="col-12 row no-pm justify-content-center">
            <div className="col navbar-icon my-auto p-0">
              <Tooltip title="Maschio">
                <IconButton
                  onClick={() => {
                    handleChangeSex("M");
                  }}
                  size={isMobile ? "small" : "medium"}
                >
                  <img
                    alt="Male"
                    className="navbar-img-little"
                    src={exercise.gender === "M" ? MaleIcon : MaleIconBlack}
                  />
                </IconButton>
              </Tooltip>
            </div>
            <div className="col navbar-icon my-auto p-0">
              <Tooltip title="Femmina">
                <IconButton
                  onClick={() => {
                    handleChangeSex("F");
                  }}
                  size={isMobile ? "small" : "medium"}
                >
                  <img
                    alt="Female"
                    className="navbar-img-little"
                    src={exercise.gender === "F" ? FemaleIcon : FemaleIconBlack}
                  />
                </IconButton>
              </Tooltip>
            </div>
            <div className="col navbar-icon my-auto p-0">
              <Tooltip title="Neutro">
                <IconButton
                  onClick={() => {
                    handleChangeSex("G");
                  }}
                  size={isMobile ? "small" : "medium"}
                >
                  <img
                    alt="Neutral"
                    className="navbar-img-little"
                    src={
                      exercise.gender === "G" ? NeutralIcon : NeutralIconBlack
                    }
                  />
                </IconButton>
              </Tooltip>
            </div>
            <span className="m-auto sign-card-sign-label-size">
              {getGenderName(exercise.gender)}
            </span>
          </div>
        </div>

        <div className="col-12 col-md-6 m-0 padding-page-field mt-2 text-align-center">
          <FormLabel
            id="demo-controlled-radio-buttons-group"
            className="sign-card-field-title"
          >
            Tipo*
          </FormLabel>
          <div className="col-12 row no-pm justify-content-center">
            <div className="col navbar-icon my-auto p-0">
              <Tooltip title="Tutorial">
                <IconButton
                  onClick={() => {
                    handleChangeType("T");
                  }}
                  size={isMobile ? "small" : "medium"}
                >
                  <img
                    alt="Tutorial"
                    className="navbar-img-little"
                    src={
                      exercise.type === "T"
                        ? SchedaBaseIcon
                        : SchedaBaseIconBlack
                    }
                  />
                </IconButton>
              </Tooltip>
            </div>
            <div className="col navbar-icon my-auto p-0">
              <Tooltip title="Personalizzata">
                <IconButton
                  onClick={() => {
                    handleChangeType("C");
                  }}
                  size={isMobile ? "small" : "medium"}
                >
                  <img
                    alt="Personalizzata"
                    className="navbar-img-little"
                    src={
                      exercise.type === "C"
                        ? SchedaPersIcon
                        : SchedaPersIconBlack
                    }
                  />
                </IconButton>
              </Tooltip>
            </div>
            <span className="m-auto sign-card-sign-label-size">
              {getTypeName(exercise.type)}
            </span>
          </div>
        </div>

        {/* <div className="col-12 col-md-12 m-0 padding-page-field mt-2 text-align-center">
          <FormLabel
            id="demo-controlled-radio-buttons-group"
            className="sign-card-field-title"
          >
            Coaches*
          </FormLabel>
          <div className="col-12 row no-pm justify-content-center">
            {coachList &&
              coachList.map((coach:any, index:) => (
                <div className="col navbar-icon my-auto p-0" key={index}>
                  <Tooltip title={coach.name}>
                    <IconButton
                      onClick={() => {
                        handleChangeCoach(coach);
                      }}
                      size={isMobile ? "small" : "medium"}
                    >
                      <img
                        alt={coach.name}
                        className="navbar-img"
                        src={getCoachIcon(exercise.coaches, coach)}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              ))}
          </div>
        </div> */}

        {exerciseEdited !== null && (
          <div className="col mt-4 mb-2 m-0 p-0 text-align-center">
            <ColoredButtonDelete
              className="button-size-delete button-font-size-delete"
              onClick={() => setIsDeleteExercise(true)}
            >
              Elimina
            </ColoredButtonDelete>
          </div>
        )}
        <div className="col mt-4 mb-2 m-0 p-0 text-align-center">
          <ColoredButton
            className="button-size-delete button-font-size-delete"
            onClick={() => handleSave()}
          >
            Salva
          </ColoredButton>
        </div>
      </div>
      {message !== "" && (
        <Alert
          className="alert-position-top"
          severity={isMessageError ? "error" : "success"}
        >
          {message}
        </Alert>
      )}
      <Modal open={isDeleteExercise} onClose={() => setIsDeleteExercise(false)}>
        <Box sx={modalStyle}>
          <span>Vuoi eliminare l'esercizio?</span>
          <div className="col-12 mt-4 m-0 p-0 text-align-center">
            <ColoredButtonDelete
              className="button-size-delete button-font-size-delete"
              onClick={() => handleDeleteExercise()}
            >
              Elimina
            </ColoredButtonDelete>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
