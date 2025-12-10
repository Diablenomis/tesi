import { Textarea } from "@mui/joy";
import {
  Alert,
  Box,
  Button,
  ButtonProps,
  FormLabel,
  IconButton,
  InputAdornment,
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
import {
  initialPackDetailCreate,
  initialPackLevelCreate,
} from "../constants/InitialEntities";
import {
  IPackDetailCreate,
  IPackLevelCreate,
  IPackPreview,
} from "../models/Pack";
import {
  PACK_BODY_PART_TYPE,
  PACK_DISCIPLINE_TYPE,
  PACK_LEVEL_TYPE,
} from "../constants/TypeConstants";
import {
  getBodyPartIcon,
  getBodyPartName,
  getCoachIcon,
  getDisciplinaIcon,
  getDisciplineName,
  getGenderName,
  getLevelIcon,
  getLevelName,
} from "../services/PackLevelService";
import CoachService from "../services/CoachService";
import { ICoach } from "../models/Coach";
import MaleIcon from "../assets/images/gender-male-icon.png";
import MaleIconBlack from "../assets/images/gender-male-icon-black.png";
import FemaleIcon from "../assets/images/gender-female-icon.png";
import FemaleIconBlack from "../assets/images/gender-female-icon-black.png";
import LinkIcon from "../assets/images/link-icon.png";
import PackService from "../services/PackService";

export const AdminSchedaCreationPanel: React.FC = () => {
  const [scheda, setScheda] = useState<IPackDetailCreate>(
    initialPackDetailCreate
  );
  const [packList, setPackList] = useState<IPackPreview[]>([]);
  const [packEdited, setPackEdited] = useState<string>("");
  const [packLevelList, setPackLevelList] = useState<IPackLevelCreate[]>([]);
  const [coachList, setCoachList] = useState<any>([]);
  const [message, setMessage] = useState<string>("");
  const [isMessageError, setIsMessageError] = useState<boolean>(false);
  const [isDeletePack, setIsDeletePack] = useState<boolean>(false);
  const [deleteLevel, setDeleteLevel] = useState<number>(-1);

  useEffect(() => {
    getCourseList();
    getCoachList();
  }, []);

  const fetch = () => {
    getCourseList();
  };

  const getCourseList = () => {
    PackService.getPacksPreview("all")
      .then((response) => {
        setPackList(response.data.data);
        setPackEdited("");
        setScheda(initialPackDetailCreate);
        setPackLevelList([]);
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
    setScheda({ ...scheda, [event.target.name]: event.target.value });
  };

  const handleInputLevel = (event: ChangeEvent<HTMLInputElement>) => {
    let index = Number(event.target.id);
    const levels = packLevelList.map((packLevel, indexLevel) => {
      if (index !== indexLevel) {
        return packLevel;
      } else {
        return {
          ...packLevel,
          [event.target.name]: event.target.value,
        };
      }
    });
    setPackLevelList(levels);
  };

  const handleInputArea = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setScheda({ ...scheda, [event.target.name]: event.target.value });
  };

  const handleInputAreaLevel = (event: ChangeEvent<HTMLTextAreaElement>) => {
    let name = event.target.name.split(" ")[0];
    let index = Number(event.target.name.split(" ")[1]);

    const levels = packLevelList.map((packLevel, indexLevel) => {
      if (index !== indexLevel) {
        return packLevel;
      } else {
        return {
          ...packLevel,
          [name]: event.target.value,
        };
      }
    });
    setPackLevelList(levels);
  };

  const handleChangeDiscipline = (disciplineSelected: string) => {
    disciplineSelected === scheda.discipline
      ? setScheda({ ...scheda, discipline: "" })
      : setScheda({ ...scheda, discipline: disciplineSelected });
  };

  const handleChangeBodyPart = (bodyPartSelected: string) => {
    bodyPartSelected === scheda.icon
      ? setScheda({ ...scheda, icon: "" })
      : setScheda({ ...scheda, icon: bodyPartSelected });
  };

  const handleChangeLevel = (index: number, levelSelected: string) => {
    const levels = packLevelList.map((packLevel, indexLevel) => {
      if (index !== indexLevel) {
        return packLevel;
      } else {
        if (packLevel.level === levelSelected) {
          return {
            ...packLevel,
            level: "",
          };
        } else {
          return {
            ...packLevel,
            level: levelSelected,
          };
        }
      }
    });
    setPackLevelList(levels);
  };

  const handleChangeCoach = (index: number, coachSelected: ICoach) => {
    let newState = [...packLevelList];
    let i = -1;
    newState[index].coaches.forEach((coach, index) => {
      if (coach.email === coachSelected.email) {
        i = index;
      }
    });
    i === -1
      ? newState[index].coaches.push({ email: coachSelected.email })
      : newState[index].coaches.splice(i, 1);

    setPackLevelList(newState);
  };

  const handleChangeSex = (index: number, sex: string) => {
    const levels = packLevelList.map((packLevel, indexLevel) => {
      if (index !== indexLevel) {
        return packLevel;
      } else {
        if (packLevel.gender === sex) {
          return {
            ...packLevel,
            gender: "",
          };
        } else {
          return {
            ...packLevel,
            gender: sex,
          };
        }
      }
    });
    setPackLevelList(levels);
  };

  const handleAddPackLevel = () => {
    let s = JSON.stringify(initialPackLevelCreate);
    setPackLevelList([...packLevelList, JSON.parse(s)]);
  };

  const handleRemovePackLevel = () => {
    if (packEdited !== "") {
      let levelToDelete = {
        level: packLevelList[deleteLevel].level,
        gender: packLevelList[deleteLevel].gender,
        title_course: packEdited,
      };
      PackService.deleteLevel(levelToDelete)
        .then((response) => {
          fetch();
        })
        .catch((e) => {
          setIsMessageError(true);
          setMessage("Errore eliminazione livello");
          setTimeout(() => {
            setMessage("");
          }, 4000);
        });
    } else {
      var array = [...packLevelList];
      array.splice(deleteLevel, 1);
      setPackLevelList(array);
    }
    setDeleteLevel(-1);
  };

  const handlePackEditedChange = (event: SelectChangeEvent) => {
    if (event.target.value !== "") {
      setPackEdited(event.target.value);
      getPackDetail(event.target.value);
    } else {
      setPackEdited("");
      setPackLevelList([]);
      setScheda(initialPackDetailCreate);
    }
  };

  const getPackDetail = (packTitle: string) => {
    PackService.getPackDetail(packTitle)
      .then((response) => {
        setScheda(response.data.data);
        setPackLevelList(response.data.data.levels);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleSave = () => {
    let isOkay = verifyValidationPack();
    if (isOkay) {
      isOkay = verifyValidationLevel(packLevelList);
    }
    if (isOkay) {
      if (packEdited !== "") {
        editPackDetail();
        packLevelList.forEach((level) => {
          editLevel(level);
        });
      } else {
        let obj = scheda;
        obj.levels = packLevelList;
        createNewPack(obj);
      }
    }
  };

  const createNewPack = (obj: IPackDetailCreate) => {
    PackService.createNewPack(obj)
      .then((response) => {
        setIsMessageError(false);
        setMessage("Scheda creata con successo");
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

  const editPackDetail = () => {
    PackService.editPack(packEdited, scheda)
      .then((response) => {
        setIsMessageError(false);
        setMessage("Scheda modificata con successo");
        fetch();
        setTimeout(() => {
          setMessage("");
        }, 4000);
      })
      .catch((e) => {
        setIsMessageError(true);
        setMessage("Errore modificazione scheda");
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const editLevel = (level: any) => {
    let levelCreate = level;
    levelCreate["title_course"] = packEdited;
    PackService.editLevel(levelCreate)
      .then((response) => {})
      .catch((e) => {
        try {
          if (e.response.data.data.error) {
            createNewLevel(levelCreate);
          }
        } catch (e) {
          setIsMessageError(true);
          setMessage("Errore modificazione scheda");
          setTimeout(() => {
            setMessage("");
          }, 4000);
        }
      });
  };

  const createNewLevel = (levelCreate: any) => {
    PackService.createNewLevel(levelCreate)
      .then((response) => {})
      .catch((e) => {
        setIsMessageError(true);
        setMessage("Errore modificazione scheda");
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const handleDeletePack = () => {
    setIsDeletePack(false);
    PackService.deletePack(packEdited)
      .then((response) => {
        setIsMessageError(false);
        setMessage("Scheda eliminata con successo");
        fetch();
        setTimeout(() => {
          setMessage("");
        }, 4000);
      })
      .catch((e) => {
        setIsMessageError(true);
        setMessage("Errore eliminazione scheda");
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const verifyValidationPack = () => {
    if (
      scheda.title.trim() === "" ||
      scheda.title_description.trim() === "" ||
      scheda.description.trim() === "" ||
      scheda.discipline.trim() === "" ||
      scheda.icon.trim() === ""
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

  const verifyValidationLevel = (levels: IPackLevelCreate[]) => {
    let isOkay = true;
    levels.forEach((level: IPackLevelCreate) => {
      if (
        level.level.trim() === "" ||
        level.duration.trim() === "" ||
        level.frequency.trim() === "" ||
        level.gender.trim() === "" ||
        level.goals.trim() === "" ||
        level.price.trim() === "" ||
        level.required_items.trim() === "" ||
        level.requirements.trim() === "" ||
        level.description.trim() === ""
      ) {
        setIsMessageError(true);
        setMessage("Valorizzare i campi obbligatori");
        setTimeout(() => {
          setMessage("");
        }, 4000);
        isOkay = false;
      }
    });
    return isOkay;
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
          <span className="text-font-big">Crea la tua scheda</span>
        </div>
        <div className="col-6 m-0 p-0 mt-3 text-align-right">
          <span className="text-font-big">Modifica una scheda</span>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={packEdited}
            size="small"
            className="col-10"
            onChange={handlePackEditedChange}
          >
            <MenuItem value="">
              <em>-----</em>
            </MenuItem>
            {packList.map((packItem, index) => (
              <MenuItem value={packItem.title} key={index}>
                {packItem.title}
              </MenuItem>
            ))}
          </Select>
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
            label="Titolo*"
            size="small"
            onChange={handleInput}
            name="title"
            className="col-12 no-pm"
            value={scheda.title}
          />
        </div>
        <div className="col-6 m-0 padding-page-field mt-4">
          <TextField
            label="ID Immagine anteprima"
            size="small"
            onChange={handleInput}
            name="image"
            className="col-12 no-pm"
            value={scheda.image}
          />
        </div>
        <div className="col-12 m-0 padding-page-field mt-4">
          <TextField
            label="Sottotitolo*"
            size="small"
            onChange={handleInput}
            name="title_description"
            className="col-12 no-pm"
            value={scheda.title_description}
          />
        </div>
        <div className="col-12 padding-page-field m-0 mt-4">
          <FormLabel
            id="demo-controlled-radio-buttons-group"
            className="sign-card-field-title"
          >
            Descrizione*
          </FormLabel>
          <Textarea
            size="sm"
            onChange={handleInputArea}
            minRows={3}
            color="neutral"
            name="description"
            value={scheda.description}
          />
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
                      src={getDisciplinaIcon(scheda.discipline, disciplina.key)}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            ))}
            <span className="m-auto sign-card-sign-label-size">
              {getDisciplineName(scheda.discipline)}
            </span>
          </div>
        </div>

        <div className="col-12 col-md-6 m-0 padding-page-field mt-2 text-align-center">
          <FormLabel
            id="demo-controlled-radio-buttons-group"
            className="sign-card-field-title"
          >
            Parte del corpo*
          </FormLabel>
          <div className="col-12 row no-pm justify-content-center">
            {PACK_BODY_PART_TYPE.map((bodyPart, index) => (
              <div className="col navbar-icon my-auto p-0" key={index}>
                <Tooltip title={bodyPart.name}>
                  <IconButton
                    size={isMobile ? "small" : "medium"}
                    onClick={() => handleChangeBodyPart(bodyPart.key)}
                  >
                    <img
                      className="navbar-img"
                      alt={bodyPart.name}
                      src={getBodyPartIcon(scheda.icon, bodyPart.key)}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            ))}
            <span className="m-auto sign-card-sign-label-size">
              {getBodyPartName(scheda.icon)}
            </span>
          </div>
        </div>

        <div className="col-12 p-0 m-0 mt-2 text-align-center">
          <span className="sign-card-sign-label-size sign-card-color-field">
            Informazioni Livelli
          </span>
        </div>
        <div className="col-11 m-auto p-0 mt-1">
          <hr className="col-12 no-pm" />
        </div>

        <div className="col mt-4 mb-2 m-0 p-0 text-align-center">
          <ColoredButton
            className="button-size-delete button-font-size-delete"
            onClick={() => handleAddPackLevel()}
          >
            Aggiungi
          </ColoredButton>
        </div>

        {packLevelList.length > 0 &&
          packLevelList &&
          packLevelList.map((packLevel, indexLevel) => (
            <div className="col-12 row m-0 p-0" key={indexLevel}>
              <div className="col-12 m-0 padding-page-field mt-2 text-align-center">
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  className="sign-card-field-title"
                >
                  Livello*
                </FormLabel>
                <div className="col-12 row no-pm justify-content-center">
                  {PACK_LEVEL_TYPE.map((level, index) => (
                    <div className="col navbar-icon my-auto p-0" key={index}>
                      <Tooltip title={level.name}>
                        <IconButton
                          size={isMobile ? "small" : "medium"}
                          onClick={() =>
                            handleChangeLevel(indexLevel, level.key)
                          }
                        >
                          <img
                            alt={level.name}
                            className="navbar-img"
                            src={getLevelIcon(
                              packLevelList[indexLevel].level,
                              level.key
                            )}
                          />
                        </IconButton>
                      </Tooltip>
                    </div>
                  ))}
                  <span className="m-auto sign-card-sign-label-size">
                    {getLevelName(packLevelList[indexLevel].level)}
                  </span>
                </div>
              </div>

              <div className="col-12 col-md-6 m-0 padding-page-field mt-2 text-align-center">
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  className="sign-card-field-title"
                >
                  Coaches
                </FormLabel>
                <div className="col-12 row no-pm justify-content-center">
                  {coachList &&
                    coachList.map((coach:any, index:number) => (
                      <div className="col navbar-icon my-auto p-0" key={index}>
                        <Tooltip title={coach.name}>
                          <IconButton
                            onClick={() => {
                              handleChangeCoach(indexLevel, coach);
                            }}
                            size={isMobile ? "small" : "medium"}
                          >
                            <img
                              alt={coach.name}
                              className="navbar-img"
                              src={getCoachIcon(
                                packLevelList[indexLevel].coaches,
                                coach
                              )}
                            />
                          </IconButton>
                        </Tooltip>
                      </div>
                    ))}
                  {/* <span className="m-auto sign-card-sign-label-size">
                    {packLevelList[indexLevel].coaches.map(
                      (coach) => coach.name
                    )}
                  </span> */}
                </div>
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
                          handleChangeSex(indexLevel, "M");
                        }}
                        size={isMobile ? "small" : "medium"}
                      >
                        <img
                          alt="Male"
                          className="navbar-img-little"
                          src={
                            packLevelList[indexLevel].gender === "M"
                              ? MaleIcon
                              : MaleIconBlack
                          }
                        />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div className="col navbar-icon my-auto p-0">
                    <Tooltip title="Femmina">
                      <IconButton
                        onClick={() => {
                          handleChangeSex(indexLevel, "F");
                        }}
                        size={isMobile ? "small" : "medium"}
                      >
                        <img
                          alt="Female"
                          className="navbar-img-little"
                          src={
                            packLevelList[indexLevel].gender === "F"
                              ? FemaleIcon
                              : FemaleIconBlack
                          }
                        />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <span className="m-auto sign-card-sign-label-size">
                    {getGenderName(packLevelList[indexLevel].gender)}
                  </span>
                </div>
              </div>

              <div className="col-12 padding-page-field m-0 mt-4">
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  className="sign-card-field-title"
                >
                  Descrizione*
                </FormLabel>
                <Textarea
                  size="sm"
                  onChange={handleInputAreaLevel}
                  key={indexLevel}
                  minRows={3}
                  color="neutral"
                  name={"description " + indexLevel}
                  value={packLevelList[indexLevel].description}
                />
              </div>

              <div className="col-6 m-0 padding-page-field mt-4">
                <TextField
                  label="Video Obiettivo Id"
                  size="small"
                  onChange={handleInputLevel}
                  key={indexLevel}
                  id={indexLevel + ""}
                  name="goals_video"
                  className="col-12 no-pm"
                  value={packLevelList[indexLevel].goals_video}
                />
              </div>

              <div className="col-6 m-0 padding-page-field mt-4">
                <TextField
                  label="Video Requisiti Id"
                  size="small"
                  onChange={handleInputLevel}
                  key={indexLevel}
                  id={indexLevel + ""}
                  name="requirements_video"
                  className="col-12 no-pm"
                  value={packLevelList[indexLevel].requirements_video}
                />
              </div>

              <div className="col-12 col-md-6 padding-page-field m-0 mt-4">
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  className="sign-card-field-title"
                >
                  Obiettivi*
                </FormLabel>
                <Textarea
                  size="sm"
                  onChange={handleInputAreaLevel}
                  key={indexLevel}
                  minRows={3}
                  color="neutral"
                  name={"goals " + indexLevel}
                  value={packLevelList[indexLevel].goals}
                />
              </div>

              <div className="col-12 col-md-6 padding-page-field m-0 mt-4">
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  className="sign-card-field-title"
                >
                  Requisiti*
                </FormLabel>
                <Textarea
                  size="sm"
                  onChange={handleInputAreaLevel}
                  key={indexLevel}
                  id={indexLevel + ""}
                  minRows={3}
                  color="neutral"
                  name={"requirements " + indexLevel}
                  value={packLevelList[indexLevel].requirements}
                />
              </div>

              <div className="col-12 col-md-6 padding-page-field m-0 mt-4">
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  className="sign-card-field-title"
                >
                  Frequenza*
                </FormLabel>
                <Textarea
                  size="sm"
                  onChange={handleInputAreaLevel}
                  key={indexLevel}
                  id={indexLevel + ""}
                  minRows={3}
                  color="neutral"
                  name={"frequency " + indexLevel}
                  value={packLevelList[indexLevel].frequency}
                />
              </div>

              <div className="col-12 col-md-6 padding-page-field m-0 mt-4">
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  className="sign-card-field-title"
                >
                  Durata*
                </FormLabel>
                <Textarea
                  size="sm"
                  onChange={handleInputAreaLevel}
                  key={indexLevel}
                  id={indexLevel + ""}
                  minRows={3}
                  color="neutral"
                  name={"duration " + indexLevel}
                  value={packLevelList[indexLevel].duration}
                />
              </div>

              <div className="col-12 col-md-6 padding-page-field m-0 mt-4">
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  className="sign-card-field-title"
                >
                  Attrezzatura essenziale*
                </FormLabel>
                <Tooltip title="{{link}}">
                  <IconButton
                  >
                    <img
                      alt={"Link icon"}
                      className="navbar-img"
                      src={LinkIcon}
                    />
                  </IconButton>
                </Tooltip>
                <Textarea
                  size="sm"
                  onChange={handleInputAreaLevel}
                  key={indexLevel}
                  id={indexLevel + ""}
                  minRows={3}
                  color="neutral"
                  name={"required_items " + indexLevel}
                  value={packLevelList[indexLevel].required_items}
                />
              </div>

              <div className="col-6 m-0 padding-page-field mt-5">
                <TextField
                  label="Prezzo*"
                  size="small"
                  onChange={handleInputLevel}
                  key={indexLevel}
                  id={indexLevel + ""}
                  name="price"
                  className="col-12 no-pm"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    ),
                  }}
                  value={packLevelList[indexLevel].price}
                />
              </div>

              <div className="col-12 mt-4 mb-2 m-0 p-0 text-align-center">
                <ColoredButtonDelete
                  className="button-size-delete button-font-size-delete"
                  onClick={() => setDeleteLevel(indexLevel)}
                >
                  Elimina
                </ColoredButtonDelete>
              </div>

              <div className="col-11 m-auto p-0 mt-4">
                <hr className="col-12 no-pm" />
              </div>
            </div>
          ))}

        {packEdited !== "" && (
          <div className="col mt-4 mb-2 m-0 p-0 text-align-center">
            <ColoredButtonDelete
              className="button-size-delete button-font-size-delete"
              onClick={() => setIsDeletePack(true)}
            >
              Elimina
            </ColoredButtonDelete>
          </div>
        )}
        {packLevelList.length > 0 && (
          <div className="col mt-4 mb-2 m-0 p-0 text-align-center">
            <ColoredButton
              className="button-size-delete button-font-size-delete"
              onClick={() => handleSave()}
            >
              Salva
            </ColoredButton>
          </div>
        )}
      </div>
      {message !== "" && (
        <Alert
          className="alert-position-top"
          severity={isMessageError ? "error" : "success"}
        >
          {message}
        </Alert>
      )}
      <Modal open={isDeletePack} onClose={() => setIsDeletePack(false)}>
        <Box sx={modalStyle}>
          <span>Vuoi eliminare la scheda?</span>
          <div className="col-12 mt-4 m-0 p-0 text-align-center">
            <ColoredButtonDelete
              className="button-size-delete button-font-size-delete"
              onClick={() => handleDeletePack()}
            >
              Elimina
            </ColoredButtonDelete>
          </div>
        </Box>
      </Modal>

      <Modal open={deleteLevel !== -1} onClose={() => setDeleteLevel(-1)}>
        <Box sx={modalStyle}>
          <span>Vuoi eliminare il livello?</span>
          <div className="col-12 mt-4 m-0 p-0 text-align-center">
            <ColoredButtonDelete
              className="button-size-delete button-font-size-delete"
              onClick={() => handleRemovePackLevel()}
            >
              Elimina
            </ColoredButtonDelete>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
