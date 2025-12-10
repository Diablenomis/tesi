import { Textarea } from "@mui/joy";
import {
  Alert,
  Button,
  ButtonProps,
  FormLabel,
  IconButton,
  styled,
  TextField,
  Tooltip,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { initialCoach } from "../constants/InitialEntities";
import { PACK_DISCIPLINE_TYPE } from "../constants/TypeConstants";
import {
  getCoachIcon,
  getDisciplinaIcon,
  getDisciplineName,
  getGenderName,
} from "../services/PackLevelService";
import CoachService from "../services/CoachService";
import { ICoach } from "../models/Coach";
import MaleIcon from "../assets/images/gender-male-icon.png";
import MaleIconBlack from "../assets/images/gender-male-icon-black.png";
import FemaleIcon from "../assets/images/gender-female-icon.png";
import FemaleIconBlack from "../assets/images/gender-female-icon-black.png";

export const AdminCoachCreationPanel: React.FC = () => {
  const [coach, setCoach] = useState<ICoach>(initialCoach);
  const [coachEdited, setCoachEdited] = useState<string>("");
  const [coachList, setCoachList] = useState<any>([]);
  const [message, setMessage] = useState<string>("");
  const [isMessageError, setIsMessageError] = useState<boolean>(false);

  const handleDrop = (event: any) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file: any) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      if (typeof base64String === "string") {
        setCoach({ ...coach, image: base64String });
      }
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (event: any) => {
    event.preventDefault(); // Previene il comportamento di default del browser
  };

  useEffect(() => {
    getCoachList();
  }, []);

  const fetch = () => {
    getCoachList();
  };

  const getCoachList = () => {
    CoachService.getAllCoaches()
      .then((response) => {
        setCoachList(response.data.data);
        setCoach(initialCoach);
      })
      .catch((e: Error) => {
        setIsMessageError(true);
        setMessage(e.message);
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setCoach({ ...coach, [event.target.name]: event.target.value });
  };

  const handleChangeSex = (genderSelected: string) => {
    setCoach({ ...coach, gender: genderSelected });
  };

  const handleChangeDiscipline = (disciplineSelected: string) => {
    setCoach({ ...coach, top_discipline_name: disciplineSelected });
  };

  const handleInputArea = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCoach({ ...coach, [event.target.name]: event.target.value });
  };

  const handleChangeCoach = (coachItem: ICoach) => {
    if (coachItem.email === coach.email) {
      setCoach(initialCoach);
      setCoachEdited("");
    } else {
      setCoach(coachItem);
      setCoachEdited(coachItem.email);
    }
  };

  const verifyValidation = () => {
    if (
      coach.name.trim() === "" ||
      coach.surname.trim() === "" ||
      coach.email.trim() === "" ||
      coach.number.trim() === "" ||
      coach.height.trim() === "" ||
      coach.weight.trim() === "" ||
      coach.bday.trim() === "" ||
      coach.gender.trim() === "" ||
      coach.top_discipline_name.trim() === "" ||
      coach.coach_exp.trim() === "" ||
      coach.training_exp.trim() === "" ||
      coach.skills.trim() === ""
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

  const handleSave = () => {
    let isOkay = verifyValidation();
    if (isOkay) {
      if (coachEdited === "") {
        saveNewCoach();
      } else {
        modifyNewCoach();
      }
    }
  };

  const saveNewCoach = () => {
    CoachService.createNewCoach(coach)
      .then((response) => {
        setIsMessageError(false);
        setMessage("Coach creato con successo");
        fetch();
        setTimeout(() => {
          setMessage("");
        }, 4000);
      })
      .catch((e) => {
        setIsMessageError(true);
        setMessage("Errore creazione coach");
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const modifyNewCoach = () => {
    CoachService.modifyNewCoach(coachEdited, coach)
      .then((response) => {
        setIsMessageError(false);
        setMessage("Coach modificato con successo");
        fetch();
        setTimeout(() => {
          setMessage("");
        }, 4000);
      })
      .catch((e) => {
        setIsMessageError(true);
        setMessage("Errore modificazione coach");
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const handleDelete = () => {
    CoachService.deleteCoach(coachEdited)
      .then((response) => {
        setIsMessageError(false);
        setMessage("Coach eliminato con successo");
        fetch();
        setTimeout(() => {
          setMessage("");
        }, 4000);
      })
      .catch((e) => {
        setIsMessageError(true);
        setMessage("Errore eliminazione coach");
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
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

  return (
    <div className="col-12 no-pm">
      <div className="panel col-12 m-0 row padding-page-half justify-content-between pb-3 zoom-in">
        <div className="col-6 m-0 p-0 mt-3">
          <span className="text-font-big">Aggiungi un coach/nutrizionista</span>
        </div>
        <div className="col-6 row no-pm justify-content-end">
          {coachList &&
            coachList.map((coachItem: any, index: any) => (
              <div className="col navbar-icon my-auto p-0" key={index}>
                <Tooltip title={coachItem.name}>
                  <IconButton
                    onClick={() => {
                      handleChangeCoach(coachItem);
                    }}
                    size={isMobile ? "small" : "medium"}
                  >
                    <img
                      alt={coach.name}
                      className="navbar-img"
                      src={getCoachIcon([coach], coachItem)}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            ))}
        </div>
        <div className="col-12 p-0 m-0 mt-2 text-align-center">
          <span className="sign-card-sign-label-size sign-card-color-field">
            Informazioni Personali
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
            value={coach.name}
          />
        </div>
        <div className="col-6 m-0 padding-page-field mt-4">
          <TextField
            label="Cognome*"
            size="small"
            onChange={handleInput}
            name="surname"
            className="col-12 no-pm"
            value={coach.surname}
          />
        </div>
        <div className="col-6 m-0 padding-page-field mt-4">
          <TextField
            label="Email*"
            size="small"
            onChange={handleInput}
            name="email"
            className="col-12 no-pm"
            value={coach.email}
          />
        </div>
        <div className="col-6 m-0 padding-page-field mt-4">
          <TextField
            label="Numero telefonico*"
            size="small"
            onChange={handleInput}
            name="number"
            className="col-12 no-pm"
            value={coach.number}
          />
        </div>
        <div className="col-6 m-0 padding-page-field mt-4">
          <TextField
            label="Altezza*"
            size="small"
            onChange={handleInput}
            name="height"
            className="col-12 no-pm"
            value={coach.height}
          />
        </div>
        <div className="col-6 m-0 padding-page-field mt-4">
          <TextField
            label="Peso*"
            size="small"
            onChange={handleInput}
            name="weight"
            className="col-12 no-pm"
            value={coach.weight}
          />
        </div>

        <div className="col-6 m-0 padding-page-field mt-4">
          <TextField
            label="Data di nascita*"
            size="small"
            onChange={handleInput}
            name="bday"
            placeholder="YYYY-MM-DD"
            className="col-12 no-pm"
            value={coach.bday}
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
                    src={coach.gender === "M" ? MaleIcon : MaleIconBlack}
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
                    src={coach.gender === "F" ? FemaleIcon : FemaleIconBlack}
                  />
                </IconButton>
              </Tooltip>
            </div>
            <span className="m-auto sign-card-sign-label-size">
              {getGenderName(coach.gender)}
            </span>
          </div>
        </div>

        <div className="col-12 p-0 m-0 mt-2 text-align-center">
          <span className="sign-card-sign-label-size sign-card-color-field">
            Informazioni Lavorative
          </span>
        </div>
        <div className="col-11 m-auto p-0 mt-1">
          <hr className="col-12 no-pm" />
        </div>

        <div className="col-12 col-md-6 m-0 padding-page-field mt-2 text-align-center">
          <FormLabel
            id="demo-controlled-radio-buttons-group"
            className="sign-card-field-title"
          >
            Disciplina*
          </FormLabel>
          <div className="col-12 row no-pm justify-content-center">
            {PACK_DISCIPLINE_TYPE.map((disciplina, index) => (
              <div className="col navbar-icon my-auto p-0" key={index}>
                <Tooltip title={disciplina.name}>
                  <IconButton
                    size={isMobile ? "small" : "medium"}
                    onClick={() => handleChangeDiscipline(disciplina.key)}
                  >
                    <img
                      alt={disciplina.name}
                      className="navbar-img"
                      src={getDisciplinaIcon(
                        coach.top_discipline_name,
                        disciplina.key
                      )}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            ))}
            <div className="col navbar-icon my-auto p-0">
              <Tooltip title={"nutruzionista"}>
                <IconButton
                  size={isMobile ? "small" : "medium"}
                  onClick={() => handleChangeDiscipline("nutrizionista")}
                >
                  {/* <img
                      alt={disciplina.name}
                      className="navbar-img"
                      src={getDisciplinaIcon(
                        coach.top_discipline_name,
                        disciplina.key
                      )}
                    /> */}
                  <span
                    style={
                      coach.top_discipline_name === "nutrizionista"
                        ? { color: "#000000" }
                        : {}
                    }
                  >
                    N
                  </span>
                </IconButton>
              </Tooltip>
            </div>
            <span className="m-auto sign-card-sign-label-size">
              {getDisciplineName(coach.top_discipline_name)}
            </span>
          </div>
        </div>

        <div className="col-12 col-md-6 padding-page-field m-0 mt-4">
          <FormLabel
            id="demo-controlled-radio-buttons-group"
            className="sign-card-field-title"
          >
            Descrizione/Esperienza*
            (comparirà in pagina Team)
          </FormLabel>
          <Textarea
            size="sm"
            onChange={handleInputArea}
            minRows={3}
            color="neutral"
            name="coach_exp"
            value={coach.coach_exp}
          />
        </div>
        <div className="col-12 col-md-6 padding-page-field m-0 mt-4">
          <FormLabel
            id="demo-controlled-radio-buttons-group"
            className="sign-card-field-title"
          >
            Esperienza di allenamento*
          </FormLabel>
          <Textarea
            size="sm"
            onChange={handleInputArea}
            minRows={3}
            color="neutral"
            name="training_exp"
            value={coach.training_exp}
          />
        </div>
        <div className="col-12 col-md-6 padding-page-field m-0 mt-4">
          <FormLabel
            id="demo-controlled-radio-buttons-group"
            className="sign-card-field-title"
          >
            Abilità*
          </FormLabel>
          <Textarea
            size="sm"
            onChange={handleInputArea}
            minRows={3}
            color="neutral"
            name="skills"
            value={coach.skills}
          />
        </div>
        <div className="col-6 m-0 padding-page-field mt-4">
          <FormLabel
            id="demo-controlled-radio-buttons-group"
            className="sign-card-field-title"
          >
            Immagine
          </FormLabel>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
              border: "2px dashed #ccc",
              padding: "20px",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            Trascina qui un'immagine
          </div>

          {/* Anteprima dell'immagine caricata */}
          {coach.image !== "" && coach.image !== "default" && (
            <div style={{ marginTop: "20px" }}>
              <img src={coach.image} alt="Preview" style={{ width: "100%" }} />
            </div>
          )}
        </div>
        <div className="col-6 m-0 padding-page-field mt-4">
          <TextField
            label="Video Id"
            size="small"
            onChange={handleInput}
            name="video"
            className="col-12 no-pm"
            value={coach.video}
          />
        </div>
        {coachEdited !== "" && (
          <div className="col mt-4 mb-2 m-0 p-0 text-align-center">
            <ColoredButtonDelete
              className="button-size-delete button-font-size-delete"
              onClick={() => handleDelete()}
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
    </div>
  );
};
