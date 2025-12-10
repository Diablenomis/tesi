import {
  Alert,
  Autocomplete,
  Box,
  Button,
  ButtonProps,
  FormLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  rgbToHex,
  Select,
  SelectChangeEvent,
  styled,
  TextField,
  Typography,
  Stack,
  Divider,
  Tooltip,
} from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState, useMemo } from "react";
import { isMobile } from "react-device-detect";
import {
  initialConnection,
  initialConnectionPers,
  initialDay,
  initialExercise,
  initialExerciseCreate,
  initialExerciseSS,
  initialSection,
  initialSuperSerie,
  initialWeek,
} from "../constants/InitialEntities";
import {
  IConnection,
  IConnectionPers,
  IDay,
  IExerciseConnection,
  ISection,
  ISuperSerie,
  IWeek,
} from "../models/Connection";
import MaleIcon from "../assets/images/gender-male-icon.png";
import FemaleIcon from "../assets/images/gender-female-icon.png";
import { IExercise, IPackLevelCreate, IPackPreview } from "../models/Pack";
import PackService from "../services/PackService";
import SchedaBaseIcon from "../assets/images/scheda-tutorial.png";
import SchedaPersIcon from "../assets/images/scheda-personalizzata.png";
import SchedaTutorialBlackIconUrl from "../assets/images/scheda-tutorial-black.png";
import SchedaPersonalizzataBlackIconUrl from "../assets/images/scheda-personalizzata-black.png";
import { WheelchairPickupOutlined } from "@mui/icons-material";
// TODO dettaglio scheda già acquistata vedere le settimane

export const AdminConnectionCreationPanel: React.FC = () => {
  const [weekList, setWeekList] = useState<IWeek[]>([
    JSON.parse(JSON.stringify(initialWeek)),
  ]);
  const [connectionId, setConnectionId] = useState("");
  const [connectionName, setConnectionName] = useState("");
  const [connectionEdited, setConnectionEdited] = useState<string>("");
  const [indexWeekShow, setIndexWeekShow] = useState<number>(0);
  const [indexSection, setIndexSection] = useState<number>(0);
  const [deleteWeek, setDeleteWeek] = useState<number>(-1);
  const [isDeleteConnection, setIsDeleteConnection] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isMessageError, setIsMessageError] = useState<boolean>(false);
  const [exerciseList, setExerciseList] = useState<IExercise[]>([]);
  const [packList, setPackList] = useState<IPackPreview[]>([]);
  const [packSelected, setPackSelected] = useState<string>("");
  const [packLevelList, setPackLevelList] = useState<IPackLevelCreate[]>([]);
  const [packLevelSelected, setPackLevelSelected] = useState<string>("");
  const [packLevelSexSelected, setPackLevelSexSelected] = useState<string>("");
  const [isPersonalizzata, setIsPersonalizzata] = useState<boolean>(false);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [formList, setFormList] = useState([
    { date: "", name: "", id: "", published: false },
  ]);
  const [userMailList, setUserMailList] = useState<string[]>([]);
  const [userMailSelected, setUserMailSelected] = useState<string>("");
  const [dateList, setDateList] = useState<string[]>(["Nuova scheda"]);
  const [nameList, setNameList] = useState<string[]>(["Nuova scheda"]);
  const [dateSelected, setDateSelected] = useState<string>("");
  const [nameSelected, setNameSelected] = useState<string>("");
  const [copySection, setCopySection] = useState<any>(null);
  const [weekCopied, setWeekCopied] = useState<IWeek>({
    name: "",
    number: 1,
    days: [],
  });
  const weeksCount = useMemo(() => weekList.length, [weekList]);
  const daysCount = useMemo(
    () =>
      weekList.reduce(
        (acc: number, week: IWeek) => acc + (week.days ? week.days.length : 0),
        0
      ),
    [weekList]
  );
  const exercisesCount = useMemo(
    () =>
      weekList.reduce((accWeek: number, week: IWeek) => {
        return (
          accWeek +
          week.days.reduce((accDay: number, day: IDay) => {
            return (
              accDay +
              day.sections.reduce((accSec: number, sec: ISection) => {
                return accSec + sec.exercises.length;
              }, 0)
            );
          }, 0)
        );
      }, 0),
    [weekList]
  );
  const places = ["casa", "palestra", "parco", "homefitNexus"];
  useEffect(() => {
    getConnectionList();
    getExerciseList();
    getCourseList();
    getEmailUsers();
  }, []);

  const fetch = () => {
    getConnectionList();
    getExerciseList();
    getCourseList();
    getEmailUsers();
  };

  const getConnectionList = () => {
    // PackService.getConnections()
    //   .then((response) => {
    //     setConnectionList(response.data.data);
    //     setConnectionEdited(null);
    //     let connection: IConnection = {
    //       id: "",
    //       weeks: [],
    //     };
    //     setConnection(connection);
    //   })
    //   .catch((e: Error) => {
    //     setMessage(e.message);
    //     setTimeout(() => {
    //       setMessage("");
    //     }, 4000);
    //   });
  };

  const getCourseList = () => {
    PackService.getPacksPreview("all")
      .then((response) => {
        setPackList(response.data.data);
      })
      .catch((e: Error) => {
        setMessage(e.message);
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const getPackDetail = (packTitle: string) => {
    PackService.getPackDetail(packTitle)
      .then((response) => {
        setPackLevelList(response.data.data.levels);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getExerciseList = () => {
    PackService.getExercises()
      .then((response) => {
        setExerciseList(response.data.data);
      })
      .catch((e: Error) => {
        setIsMessageError(true);
        setMessage(e.message);
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const getEmailUsers = () => {
    PackService.getUsersForSchedePers()
      .then((response) => {
        let userList: string[] = [];
        response.data.data.forEach((user: any) => {
          userList.push(user.email);
        });
        setUserMailList(userList);
      })
      .catch((e: Error) => {
        setIsMessageError(true);
        setMessage(e.message);
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const changeWeek = (indexWeek: number) => {
    setIndexWeekShow(indexWeek);
  };

  const handleNumberWeeks = (event: ChangeEvent<HTMLInputElement>) => {
    let weeks = [...weekList];
    let nWeeksToSet = Number(event.target.value);
    if (weeks.length > nWeeksToSet) {
      while (weeks.length > nWeeksToSet) {
        weeks.pop();
      }
      if (indexWeekShow > nWeeksToSet - 1) {
        setIndexWeekShow(nWeeksToSet - 1);
      }
    } else if (weeks.length < nWeeksToSet) {
      while (weeks.length < nWeeksToSet) {
        weeks.push(JSON.parse(JSON.stringify(initialWeek)));
      }
      setIndexWeekShow(nWeeksToSet - 1);
    }
    setWeekList(weeks);
  };

  const handleAddDay = (index: number) => {
    let weeks = [...weekList];
    let day = JSON.stringify(initialDay);
    let section = JSON.stringify(initialSection);

    weeks[index].days.push(JSON.parse(day));
    weeks[index].days[weeks[index].days.length - 1].sections.push(
      JSON.parse(section)
    );
    weeks[index].days[weeks[index].days.length - 1].sections.push(
      JSON.parse(section)
    );
    weeks[index].days[weeks[index].days.length - 1].sections.push(
      JSON.parse(section)
    );
    setWeekList(weeks);
  };

  const handleAddEsercizio = (
    indexWeek: number,
    indexDay: number,
    indexsec: number
  ) => {
    let weeks = [...weekList];
    let exercise = JSON.stringify(initialExercise);
    weeks[indexWeek].days[indexDay].sections[indexsec].exercises.push(
      JSON.parse(exercise)
    );
    let orderNumber =
      weeks[indexWeek].days[indexDay].sections[indexsec].exercises.length;
    weeks[indexWeek].days[indexDay].sections[indexsec].exercises[
      orderNumber - 1
    ].order = orderNumber;
    setWeekList(weeks);
  };

  const handleAddSerie = (
    indexWeek: number,
    indexDay: number,
    indexsec: number
  ) => {
    let weeks = [...weekList];
    let serie = JSON.stringify(initialExerciseSS);
    weeks[indexWeek].days[indexDay].sections[indexsec].exercises.push(
      JSON.parse(serie)
    );
    let orderNumber =
      weeks[indexWeek].days[indexDay].sections[indexsec].exercises.length;
    weeks[indexWeek].days[indexDay].sections[indexsec].exercises[
      orderNumber - 1
    ].order = orderNumber;

    weeks[indexWeek].days[indexDay].sections[indexsec].exercises[
      orderNumber - 1
    ].super_series![0].order = 1;
    weeks[indexWeek].days[indexDay].sections[indexsec].exercises[
      orderNumber - 1
    ].super_series![1].order = 2;

    setWeekList(weeks);
  };

  const handleAddSerieEx = (
    indexWeek: number,
    indexDay: number,
    indexExercise: number,
    indexSection: number
  ) => {
    let weeks = [...weekList];
    let superSerie = JSON.stringify(initialSuperSerie);
    weeks[indexWeek].days[indexDay].sections[indexSection].exercises[
      indexExercise
    ].super_series!.push(JSON.parse(superSerie));

    let ssIndex =
      weeks[indexWeek].days[indexDay].sections[indexSection].exercises[
        indexExercise
      ].super_series!.length;

    weeks[indexWeek].days[indexDay].sections[indexSection].exercises[
      indexExercise
    ].super_series![ssIndex - 1].order = ssIndex;
    setWeekList(weeks);
  };

  const handleInputWeek = (event: ChangeEvent<HTMLInputElement>) => {
    let index = Number(event.target.id);
    let weeks: IWeek[] = JSON.parse(JSON.stringify(weekList));
    if (event.target.name === "name") {
      weeks[index].name = event.target.value;
    }
    setWeekList(weeks);
  };

  const handleInputSection = (event: ChangeEvent<HTMLInputElement>) => {
    let indexes = event.target.id.split("_");
    let indexWeek = Number(indexes[0]);
    let indexDay = Number(indexes[1]);
    let weeks: IWeek[] = JSON.parse(JSON.stringify(weekList));
    if (event.target.name === "name") {
      weeks[indexWeek].days[indexDay].sections[indexSection].name =
        event.target.value;
    } else if (event.target.name === "order") {
      weeks[indexWeek].days[indexDay].sections[indexSection].order = Number(
        event.target.value
      );
    }
    setWeekList(weeks);
  };

  const handleExerciseSelected = (
    indexWeek: number,
    indexDay: number,
    indexExercise: number,
    indexSec: number,
    exerciseSelected: IExercise | null
  ) => {
    let weeks: IWeek[] = JSON.parse(JSON.stringify(weekList));
    weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
      indexExercise
    ].exe = exerciseSelected
      ? exerciseSelected
      : JSON.parse(JSON.stringify(initialExerciseCreate));
    setWeekList(weeks);
  };

  const handleInputExercise = (event: ChangeEvent<HTMLInputElement>) => {
    let indexes = event.target.id.split("_");
    let indexWeek = Number(indexes[0]);
    let indexDay = Number(indexes[1]);
    let indexExercise = Number(indexes[2]);
    let indexSec = Number(indexes[3]);
    let weeks: IWeek[] = JSON.parse(JSON.stringify(weekList));
    if (event.target.name === "repetitions") {
      weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
        indexExercise
      ].repetitions = event.target.value;
    } else if (event.target.name === "series") {
      weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
        indexExercise
      ].series = Number(event.target.value);
    } else if (event.target.name === "stopMin") {
      let tempPrev =
        weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
          indexExercise
        ].stop;
      weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
        indexExercise
      ].stop = Number((tempPrev % 60) + Number(event.target.value) * 60);
    } else if (event.target.name === "stopSec") {
      let tempPrev =
        weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
          indexExercise
        ].stop;
      weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
        indexExercise
      ].stop = Number(tempPrev - (tempPrev % 60) + Number(event.target.value));
    } else if (event.target.name === "load") {
      weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
        indexExercise
      ].load = event.target.value + "";
    } else if (event.target.name === "intensity") {
      weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
        indexExercise
      ].intensity = Number(event.target.value);
    } else if (event.target.name === "description") {
      weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
        indexExercise
      ].description = event.target.value;
    } else if (event.target.name === "order") {
      weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
        indexExercise
      ].order = Number(event.target.value);
    }
    setWeekList(weeks);
  };

  const handleExerciseSSelected = (
    indexWeek: number,
    indexDay: number,
    indexExercise: number,
    indexSS: number,
    indexSec: number,
    exerciseSelected: IExercise | null
  ) => {
    let weeks: IWeek[] = JSON.parse(JSON.stringify(weekList));
    weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
      indexExercise
    ].super_series![indexSS].exe = exerciseSelected
      ? exerciseSelected
      : JSON.parse(JSON.stringify(initialExerciseCreate));

    setWeekList(weeks);
  };

  const handleInputSerieEx = (event: ChangeEvent<HTMLInputElement>) => {
    let indexes = event.target.id.split("_");
    let indexWeek = Number(indexes[0]);
    let indexDay = Number(indexes[1]);
    let indexExercise = Number(indexes[2]);
    let indexExerciseSS = Number(indexes[3]);
    let indexSec = Number(indexes[4]);
    let weeks: IWeek[] = JSON.parse(JSON.stringify(weekList));

    if (event.target.name === "repetitions") {
      weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
        indexExercise
      ].super_series![indexExerciseSS].repetitions = event.target.value;
    } else if (event.target.name === "stopMin") {
      let tempPrev =
        weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
          indexExercise
        ].super_series![indexExerciseSS].stop;
      weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
        indexExercise
      ].super_series![indexExerciseSS].stop = Number(
        (tempPrev % 60) + Number(event.target.value) * 60
      );
    } else if (event.target.name === "stopSec") {
      let tempPrev =
        weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
          indexExercise
        ].super_series![indexExerciseSS].stop;
      weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
        indexExercise
      ].super_series![indexExerciseSS].stop = Number(
        tempPrev - (tempPrev % 60) + Number(event.target.value)
      );
    } else if (event.target.name === "load") {
      weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
        indexExercise
      ].super_series![indexExerciseSS].load = event.target.value + "";
    } else if (event.target.name === "intensity") {
      weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
        indexExercise
      ].super_series![indexExerciseSS].intensity = Number(event.target.value);
    } else if (event.target.name === "description") {
      weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
        indexExercise
      ].super_series![indexExerciseSS].description = event.target.value;
    } else if (event.target.name === "order") {
      weeks[indexWeek].days[indexDay].sections[indexSec].exercises[
        indexExercise
      ].super_series![indexExerciseSS].order = Number(event.target.value);
    }
    setWeekList(weeks);
  };

  const handleRemoveWeek = () => {
    let weeks: IWeek[] = JSON.parse(JSON.stringify(weekList));
    weeks.splice(deleteWeek, 1);
    setWeekList(weeks);
    setDeleteWeek(-1);
  };

  const handleDeleteSection = (indexWeek: number, indexDay: number) => {
    let weeks: IWeek[] = JSON.parse(JSON.stringify(weekList));
    weeks[indexWeek].days.splice(indexDay, 1);
    setWeekList(weeks);
  };

  const handleDeleteExercise = (
    indexWeek: number,
    indexDay: number,
    indexExercise: number,
    indexsec: number
  ) => {
    let weeks: IWeek[] = JSON.parse(JSON.stringify(weekList));
    weeks[indexWeek].days[indexDay].sections[indexsec].exercises.splice(
      indexExercise,
      1
    );
    setWeekList(weeks);
  };

  const handleCopy = (week: IWeek) => {
    setWeekCopied(week);
  };

  const handlePaste = (weekSelected: any) => {
    let weeks = [...weekList];
    weeks[weekSelected] = weekCopied;
    setWeekList(weeks);
  };

  const handleDeleteSerieEx = (
    indexWeek: number,
    indexDay: number,
    indexExercise: number,
    indexSS: number,
    indexsec: number
  ) => {
    let weeks: IWeek[] = JSON.parse(JSON.stringify(weekList));
    if (
      weeks[indexWeek].days[indexDay].sections[indexsec].exercises[
        indexExercise
      ].super_series!.length > 1
    ) {
      weeks[indexWeek].days[indexDay].sections[indexsec].exercises[
        indexExercise
      ].super_series!.splice(indexSS, 1);
    } else {
      weeks[indexWeek].days[indexDay].sections[indexsec].exercises.splice(
        indexExercise,
        1
      );
    }
    setWeekList(weeks);
  };

  const sortedArray = (objectArray: any) => {
    if (Array.isArray(objectArray)) {
      objectArray.sort((n1: { order: number }, n2: { order: number }) => {
        if (n1.order > n2.order) {
          return 1;
        }
        if (n1.order < n2.order) {
          return -1;
        }

        return 0;
      });
    }
  };

  const handleSave = () => {
    let hasError = false;
    if (isPersonalizzata) {
      let connection: IConnectionPers = JSON.parse(
        JSON.stringify(initialConnectionPers)
      );
      if (userMailSelected === "") {
        setIsMessageError(true);
        setMessage("Selezionare una email");
        setTimeout(() => {
          setMessage("");
        }, 4000);
      } else {
        connection.user_email = userMailSelected;
        connection.id = connectionId;
        connectionName !== ""
          ? (connection.name = connectionName)
          : (connection.name = "nome scheda da inserire");
      }
      let weeks: IWeek[] = JSON.parse(JSON.stringify(weekList));
      weeks.forEach((week: IWeek, indi: number) => {
        sortedArray(week.days);
        week.number = indi;
        week.days.forEach((day: IDay, indexDay: number) => {
          if (day.name === "") {
            day.name = "set the name";
          }
          day.number = indexDay;
          day.sections.forEach((sec: ISection, indiSec: number) => {
            sec.name =
              indiSec === 0
                ? "riscaldamento"
                : indiSec === 1
                ? "fase centrale"
                : "defaticamento";
            sec.order = indiSec === 0 ? 1 : indiSec === 1 ? 2 : 3;
            sortedArray(sec.exercises);
            //sec.order = indiSec;
            sec.exercises.forEach((ex: IExerciseConnection, indiEx: number) => {
              if (ex.super_series!.length > 0) {
                delete ex.exe;
                sortedArray(ex.super_series);
              }
              if (ex.super_series!.length === 0) {
                delete ex.super_series;
              }
              //SE NON METTONO IL NOME DELL'ESERCIZIO
              if (ex.exe && ex.exe.name === "") {
                let sezioneStringa =
                  indiSec === 0
                    ? "riscaldamento"
                    : indiSec === 1
                    ? "fase centrale"
                    : "defaticamento/tretching";
                setIsMessageError(true);
                setMessage(
                  "Un esercizio della settimana " +
                    (indi + 1) +
                    " giorno " +
                    (indexDay + 1) +
                    " della sezione " +
                    sezioneStringa +
                    " non ha il nome"
                );
                setTimeout(() => {
                  setMessage("");
                }, 4000);
                hasError = true;
              }

              ex.super_series &&
                ex.super_series.forEach((sup: ISuperSerie, indiSS: number) => {
                  //sup.order = indiSS;
                  if (sup.exe.name === "") {
                    let sezioneStringa =
                      indiSec === 0
                        ? "riscaldamento"
                        : indiSec === 1
                        ? "fase centrale"
                        : "defaticamento/tretching";
                    setIsMessageError(true);
                    setMessage(
                      "Un esercizio della settimana " +
                        (indi + 1) +
                        " giorno " +
                        (indexDay + 1) +
                        " della sezione " +
                        sezioneStringa +
                        " non ha il nome"
                    );
                    setTimeout(() => {
                      setMessage("");
                    }, 4000);
                    hasError = true;
                  }
                });
            });
          });
        });
      });

      if (hasError) {
        return;
      }

      connection.weeks = weeks;
      setWeekList(connection.weeks);
      PackService.saveConnectionPers(connection)
        .then((response) => {
          setWeekList(response.data.data.weeks);
          setConnectionId(response.data.data.id);
          setIsMessageError(false);
          setMessage("Scheda personalizzata salvata con successo");
          setTimeout(() => {
            setMessage("");
          }, 4000);
        })
        .catch((e: Error) => {
          setIsMessageError(true);
          setMessage(e.message);
          setTimeout(() => {
            setMessage("");
          }, 4000);
        });
    } else {
      let connection: IConnection = JSON.parse(
        JSON.stringify(initialConnection)
      );
      if (packLevelSelected === "") {
        setIsMessageError(true);
        setMessage("Selezionare una scheda e un livello");
        setTimeout(() => {
          setMessage("");
        }, 4000);
      } else {
        connection.scheda_tutorial.title = packSelected;
        connection.scheda_tutorial.level = packLevelSelected;
        connection.scheda_tutorial.gender = packLevelSexSelected;
      }
      let weeks: IWeek[] = JSON.parse(JSON.stringify(weekList));
      weeks.forEach((week: IWeek, indi: number) => {
        sortedArray(week.days);
        week.number = indi;
        week.days.forEach((day: IDay, indexDay: number) => {
          day.sections.forEach((sec: ISection, indiSec: number) => {
            sortedArray(sec.exercises);
            //sec.order = indiSec;
            sec.exercises.forEach((ex: IExerciseConnection, indiEx: number) => {
              //ex.order = indiEx;
              if (ex.super_series) {
                sortedArray(ex.super_series);
              }

              ex.super_series?.forEach((sup: ISuperSerie, indiSS: number) => {
                //sup.order = indiSS;
              });
              if (ex.super_series && ex.super_series.length > 0) {
                delete ex.exe;
              }
              if (ex.super_series && ex.super_series.length === 0) {
                delete ex.super_series;
              }
            });
          });
        });
      });
      connection.weeks = weeks;
      setWeekList(connection.weeks);

      if (connectionEdited === "") {
        PackService.createNewConnection(connection)
          .then((response) => {
            setIsMessageError(false);
            setMessage("Connessione creata con successo");
            fetch();
            setTimeout(() => {
              setMessage("");
            }, 4000);
          })
          .catch((e: Error) => {
            setIsMessageError(true);
            setMessage(e.message);
            setTimeout(() => {
              setMessage("");
            }, 4000);
          });
      } else {
        PackService.editConnection(connection, connectionEdited)
          .then((response) => {
            setIsMessageError(false);
            setMessage("Connessione creata con successo");
            fetch();
            setTimeout(() => {
              setMessage("");
            }, 4000);
          })
          .catch((e: Error) => {
            setIsMessageError(true);
            setMessage(e.message);
            setTimeout(() => {
              setMessage("");
            }, 4000);
          });
      }
    }
  };

  const handleChangeConnectionName = (event: ChangeEvent<HTMLInputElement>) => {
    setConnectionName(event.target.value);
  };

  const handleSend = () => {
    PackService.sendSchedaPersonalizzata(connectionId)
      .then((response) => {
        setIsMessageError(false);
        isPublished
          ? setMessage("Scheda ritirata con successo")
          : setMessage("Scheda pubblicata con successo");
        setIsPublished(!isPublished);
        fetch();
        setTimeout(() => {
          setMessage("");
        }, 4000);
      })
      .catch((e: Error) => {
        setIsMessageError(true);
        setMessage(e.message);
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const handleDelete = (id: string) => {
    if (connectionId === "") {
      setIsMessageError(true);
      setMessage("Nessuna scheda selezionata");
      setTimeout(() => {
        setMessage("");
      }, 4000);
    } else {
      PackService.deleteSchedulePerson(id)
        .then((response) => {
          setIsMessageError(false);
          setMessage("Scheda eliminata con successo");
          handleChangeUserMail(userMailSelected);
          setDateList(dateList);
          fetch();
          setTimeout(() => {
            setMessage("");
          }, 4000);
        })
        .catch((e: Error) => {
          setIsMessageError(true);
          setMessage(e.message);
          setTimeout(() => {
            setMessage("");
          }, 4000);
        });
    }
  };

  const handlePackEditedChange = (event: SelectChangeEvent) => {
    if (event.target.value !== "") {
      setPackSelected(event.target.value);
      getPackDetail(event.target.value);
    } else {
      setPackSelected("");
      setPackLevelList([]);
    }
  };

  const handlePackLevelChange = (event: SelectChangeEvent) => {
    if (event.target.value !== "") {
      setPackLevelSelected(event.target.value);
      packLevelList.forEach((packLevel) => {
        if (packLevel.level === event.target.value) {
          setPackLevelSexSelected(packLevel.gender);
        }
      });
      getConnectionEdit(event.target.value);
    } else {
      setPackLevelSelected("");
    }
  };

  const handlePackSectionDayChange = (event:any) => {
    let indexes = event.target.name.split("_");
    let indexWeek = Number(indexes[0]);
    let indexDay = Number(indexes[1]);
    let weeks: IWeek[] = JSON.parse(JSON.stringify(weekList));
    weeks[indexWeek].days[indexDay].name = event.target.value;
    setWeekList(weeks);
  };

  const getConnectionEdit = (targ: any) => {
    let p = packLevelList.find((oggetto) => oggetto.level === targ);
    if (p && p.id) {
      PackService.getPackDetailByIdLevelForCoach(packSelected, p.id)
        .then((response) => {
          if (response.data.data.form) {
            setWeekList(response.data.data.form.weeks);
            setConnectionEdited(response.data.data.form.id);
          } else {
            setWeekList([JSON.parse(JSON.stringify(initialWeek))]);
            setConnectionEdited("");
          }
        })
        .catch((e: Error) => {});
    }
  };

  const handleCopySection = (
    indexWeek: number,
    indexDay: number,
    indexSection: number
  ) => {
    setCopySection(weekList[indexWeek].days[indexDay].sections[indexSection]);
  };

  const handlePasteSection = (
    indexWeek: number,
    indexDay: number,
    indexSection: number
  ) => {
    let weeks = [...weekList];
    weeks[indexWeek].days[indexDay].sections[indexSection] = copySection;
    setWeekList(weeks);
  };

  const handleChangeName = (newName: any) => {
    if (newName === "Nuova scheda") {
      setConnectionId("");
      setWeekList([JSON.parse(JSON.stringify(initialWeek))]);
      setDateSelected("Nuova scheda");
      setIsPublished(false);
      setNameSelected("Nuova scheda");
      setConnectionName("");
    } else if (newName !== "" && newName !== null) {
      setDateSelected(newName);
      setNameSelected(newName);
      setConnectionName(newName);

      let formSelected = formList.filter((form) => form.name === newName)[0];
      setIsPublished(formSelected.published);
      PackService.getSchedulePerson(formSelected.id)
        .then((formData) => {
          setConnectionId(formData.data.data.id);
          setWeekList(formData.data.data.weeks);
        })
        .catch((e: Error) => {});
    }
  };

  const handleChangeUserMail = (newEmail: any) => {
    if (newEmail !== "" && newEmail !== null) {
      setUserMailSelected(newEmail);
      PackService.getConnectionPers(newEmail)
        .then((response) => {
          if (
            response &&
            response.data &&
            response.data.data &&
            response.data.data.length > 0
          ) {
            let dateList: string[] = ["Nuova scheda"];
            let nameList: string[] = ["Nuova scheda"];
            let formList: any = [];
            response.data.data.forEach((form: any) => {
              let dateString = new Date(form.update_at);
              nameList.push(form.name);
              dateList.push(
                dateString.getFullYear() +
                  "-" +
                  dateString.getMonth() +
                  "-" +
                  dateString.getDay()
              );
              formList.push({
                name: form.name,
                date:
                  dateString.getFullYear() +
                  "-" +
                  dateString.getMonth() +
                  "-" +
                  dateString.getDay(),
                id: form.id,
                published: form.published,
              });
            });
            setDateList(dateList);
            setNameList(nameList);
            setFormList(formList);
            setDateSelected(formList[0].date);
            setNameSelected(formList[0].name);
            setConnectionName(formList[0].name);
            setIsPublished(formList[0].published);
            PackService.getSchedulePerson(response.data.data[0].id)
              .then((formData) => {
                setConnectionId(formData.data.data.id);
                setConnectionName(formData.data.data.name);
                setWeekList(formData.data.data.weeks);
              })
              .catch((e: Error) => {});
          } else {
            setDateList(["Nuova scheda"]);
            setNameList(["Nuova scheda"]);
            setIsPublished(false);
            setFormList([]);
            setConnectionId("");
            setNameSelected("Nuova scheda");
            setConnectionName("");
            setDateSelected("Nuova scheda");
            setWeekList([JSON.parse(JSON.stringify(initialWeek))]);
          }
        })

        .catch((error) => {});
    } else {
      setUserMailSelected("");
      setDateSelected("");
      setNameSelected("");
      setConnectionName("");
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

  const PageWrapper = styled(Box)(() => ({
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f9fbff 0%, #f4f8ff 100%)",
    padding: isMobile ? "16px" : "28px",
  }));

  const Content = styled(Box)(() => ({
    maxWidth: 1200,
    margin: "0 auto",
  }));

  const Card = styled(Box)(() => ({
    background: "#ffffff",
    borderRadius: 18,
    boxShadow: "0 20px 46px rgba(0,0,0,0.1)",
    padding: isMobile ? 12 : 20,
  }));

  const HeaderBar = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    background: "#ffffff",
    boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
    padding: isMobile ? "12px 16px" : "18px 22px",
    marginBottom: isMobile ? 12 : 16,
  }));

  const InfoStrip = styled(Stack)(() => ({
    background: "#f6f9fb",
    border: "1px solid #e6ecf2",
    borderRadius: 14,
    padding: isMobile ? "10px 12px" : "12px 16px",
    marginBottom: isMobile ? 12 : 16,
    boxShadow: "0 12px 28px rgba(0,0,0,0.05)",
  }));

  const Pill = styled(Box)(() => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#ffffff",
    color: "#192b3f",
    border: "1px solid #e1e6ec",
    padding: "6px 12px",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 13,
    boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
  }));

  const DayCard = styled(Box)(() => ({
    background: "#f9fbff",
    borderRadius: 16,
    border: "1px solid #e6ecf2",
    boxShadow: "0 14px 32px rgba(0,0,0,0.08)",
    padding: isMobile ? 12 : 18,
    marginBottom: 16,
  }));

  const SectionShell = styled(Box)(() => ({
    background: "#ffffff",
    borderRadius: 14,
    border: "1px solid #e6ecf2",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
    padding: isMobile ? 10 : 14,
    marginBottom: 12,
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
    <PageWrapper>
      <Content>
        <Card className="col-12 m-0 row padding-page-half justify-content-between pb-3">
          <HeaderBar className="col-12 mb-2">
            <div className="col-6 m-0 p-0">
              <Typography variant="h6" fontWeight={800} color="#192b3f" className="m-0">
                Crea un collegamento
              </Typography>
            </div>
            <div className="col-6 m-0 text-align-center">
              <div className="col-12 row no-pm justify-content-center">
                <div className="col navbar-icon my-auto p-0">
                  <Tooltip title={"Tutorial"}>
                    <IconButton
                      onClick={() => {
                        setIsPersonalizzata(false);
                      }}
                      size={isMobile ? "small" : "medium"}
                    >
                      <img
                        alt="Male"
                        className="navbar-img-little"
                        src={
                          isPersonalizzata
                            ? SchedaTutorialBlackIconUrl
                            : SchedaBaseIcon
                        }
                      />
                    </IconButton>
                  </Tooltip>
                </div>
                <div className="col navbar-icon my-auto p-0">
                  <Tooltip title="Personalizzata">
                    <IconButton
                      onClick={() => {
                        setIsPersonalizzata(true);
                      }}
                      size={isMobile ? "small" : "medium"}
                    >
                      <img
                        alt="personalizzata"
                        className="navbar-img-little"
                        src={
                          isPersonalizzata
                            ? SchedaPersIcon
                            : SchedaPersonalizzataBlackIconUrl
                        }
                      />
                    </IconButton>
                  </Tooltip>
                </div>

                <span className="m-auto sign-card-sign-label-size">
                  {isPersonalizzata ? "Personalizzata" : "Tutorial"}
                </span>
              </div>
            </div>
          </HeaderBar>
          <InfoStrip
            direction={isMobile ? "column" : "row"}
            spacing={isMobile ? 1 : 2}
            justifyContent="space-between"
            alignItems={isMobile ? "flex-start" : "center"}
            className="col-12"
          >
            <Pill>Tipo: {isPersonalizzata ? "Personalizzata" : "Tutorial"}</Pill>
            <Pill>Volume: {weeksCount} sett. · {daysCount} giorni</Pill>
            <Pill>Totale esercizi: {exercisesCount}</Pill>
            <Pill>Stato: {isPublished ? "Pubblicata" : "Bozza"}</Pill>
          </InfoStrip>
        {isPersonalizzata ? (
          <div className="row col-12 m-0 p-0 mt-3">
            <div className="col-6 m-0 p-0 text-align-left">
              <span className="text-font-big">Seleziona una email</span>
              <Autocomplete
                id="demo-autocomplete"
                value={userMailSelected}
                onChange={(event, newValue) => handleChangeUserMail(newValue)}
                options={userMailList}
                getOptionLabel={(option) => option}
                size="small"
                className="col-10"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select User Mail"
                    variant="outlined"
                  />
                )}
              />
            </div>

            {userMailSelected && (
              <>
                <div className="col-6 m-0 p-0 text-align-left">
                  <span className="text-font-big">Seleziona una scheda</span>
                  <Autocomplete
                    id="demo-autocomplete"
                    value={nameSelected}
                    onChange={(event, newValue) => handleChangeName(newValue)}
                    options={nameList}
                    getOptionLabel={(option) => option}
                    size="small"
                    className="col-6"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select date"
                        variant="outlined"
                      />
                    )}
                  />
                </div>
                <div className="col-6 m-0 p-0 mt-4 text-align-left">
                  <span className="text-font-big">Nome scheda</span>
                  <TextField
                    label="Nome scheda"
                    size="small"
                    onChange={handleChangeConnectionName}
                    name="nameConnection"
                    type="text"
                    className="col-6"
                    value={connectionName}
                  />
                </div>
              </>
            )}
            <div className="col-6 m-0 p-0 mt-4 text-align-left">
              <TextField
                label="N.Settimane"
                size="small"
                onChange={handleNumberWeeks}
                name="number"
                type="number"
                value={weekList.length}
                className="number-week-input"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="col-6 m-0 p-0 mt-3 text-align-left">
              <span className="text-font-big">Seleziona una scheda</span>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={packSelected}
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
            <div className="col-6 m-0 p-0 mt-3 text-align-left">
              <span className="text-font-big">Seleziona un livello</span>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={packLevelSelected}
                size="small"
                className="col-10"
                onChange={handlePackLevelChange}
              >
                <MenuItem value="">
                  <em>-----</em>
                </MenuItem>
                {packLevelList.map((packLevelItem, index) => (
                  <MenuItem value={packLevelItem.level} key={index}>
                    {packLevelItem.level}
                    {packLevelItem.gender === "F" ? (
                      <IconButton
                        onClick={() => {}}
                        size={isMobile ? "small" : "medium"}
                        disabled
                      >
                        <img
                          alt="Female"
                          className="dropdown-img-little"
                          src={FemaleIcon}
                        />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() => {}}
                        size={isMobile ? "small" : "medium"}
                        disabled
                      >
                        <img
                          alt="Male"
                          className="dropdown-img-little"
                          src={MaleIcon}
                        />
                      </IconButton>
                    )}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="col-6 m-0 p-0 mt-3 text-align-left">
              <TextField
                label="N.Settimane"
                size="small"
                onChange={handleNumberWeeks}
                name="number"
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
                value={weekList.length}
                className="number-week-input"
              />
            </div>
          </>
        )}

        {/* <div className="col-6 m-0 p-0 mt-3 text-align-right">
          <span className="text-font-big">Modifica un collegamento</span>
          <Autocomplete
            size="small"
            className="col-12"
            value={connectionEdited}
            onChange={(event: any, newValue: IConnection | null) => {
              handleConnectionEditedChange(newValue);
            }}
            getOptionLabel={(option) => option.id}
            options={connectionList}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.id}
              </li>
            )}
            renderInput={(params) => <TextField {...params} />}
          />
        </div> */}
        <div className="col-12 p-0 m-0 mt-2 text-align-center">
          {userMailSelected && (
            <ColoredButton
              className="button-size-delete button-font-size-delete"
              onClick={() => handleCopy(weekList[indexWeekShow])}
            >
              Copy week
            </ColoredButton>
          )}
          <span className="sign-card-sign-label-size sign-card-color-field m-2">
            Settimane
          </span>

          {userMailSelected && weekCopied && (
            <ColoredButton
              className="button-size-delete button-font-size-delete"
              onClick={() => handlePaste(indexWeekShow)}
            >
              Paste week
            </ColoredButton>
          )}
        </div>
        <div className="col-11 m-auto p-0 mt-1">
          <hr className="col-12 no-pm" />
        </div>

        <div className="col-12 row mt-2 mb-2 m-0 p-0 justify-content-center">
          {weekList &&
            weekList.map((week, indexWeek) => (
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
                      indexWeekShow == indexWeek
                        ? "rgb(200, 200, 200)"
                        : "white",
                  }}
                >
                  <span className="navbar-img number-button-style">
                    {indexWeek + 1}
                  </span>
                </IconButton>
              </div>
            ))}
        </div>

        {weekList &&
          weekList.map(
            (connectionWeek, indexWeek) =>
              indexWeekShow === indexWeek && (
                <div className="col-12 row m-0 p-0" key={indexWeek}>
                  {/* <div className="col-6 m-0 padding-page-field mt-4">
                    <TextField
                      label="Luogo"
                      size="small"
                      onChange={handleInputWeek}
                      key={indexWeek}
                      id={indexWeek + ""}
                      name="name"
                      className="col-12 no-pm"
                      value={connectionWeek.name}
                    />
                  </div> */}

                  <div className="col-12 d-flex justify-content-center mt-4 mb-2 m-0 p-0 text-align-center">
                    <ColoredButton
                      className="button-size-delete-2 button-font-size-delete"
                      onClick={() => handleAddDay(indexWeek)}
                    >
                      + Training day
                    </ColoredButton>
                  </div>

                  {connectionWeek &&
                    connectionWeek.days &&
                    connectionWeek.days.map((day, indexDay) => (
                      <DayCard
                        key={indexDay}
                        className="row padding-page-field col-12 m-0 mt-2 mb-2"
                      >
                        <div className="col-6 m-0 padding-page-field mt-4">
                          <span className="text-font-big">
                            Seleziona il giorno
                          </span>
                          <TextField
                            label="Nome giorno + luogo"
                            size="small"
                            onChange={handlePackSectionDayChange}
                            key={indexDay}
                            id={indexWeek + "_" + indexDay}
                            name={indexWeek + "_" + indexDay}
                            className="col-12 no-pm"
                            type="text"
                            value={day.name}
                          />
                          
                        </div>

                       
                        <div className="col-12 row mt-4 mb-2 m-0 p-0 text-align-center">
                          <div className="col-4 m-0 p-0">
                            <div className="col-12">
                              <h2>Riscaldamento </h2>
                            </div>
                            <div className="col-12 d-flex justify-content-between">
                              <div className="col-4 m-0 p-0">
                                <ColoredButton
                                  className="button-size-delete-2 button-font-size-delete"
                                  onClick={() =>
                                    handleCopySection(indexWeek, indexDay, 0)
                                  }
                                >
                                  Copia sezione
                                </ColoredButton>
                              </div>
                              <div className="col-4 m-0 p-0">
                                <ColoredButton
                                  className="button-size-delete-2 button-font-size-delete"
                                  onClick={() =>
                                    handlePasteSection(indexWeek, indexDay, 0)
                                  }
                                >
                                  Incolla sezione
                                </ColoredButton>
                              </div>
                            </div>
                          </div>

                          <div className="col-4 m-0 p-0">
                            <ColoredButton
                              className="button-size-delete-2 button-font-size-delete"
                              onClick={() =>
                                handleAddEsercizio(indexWeek, indexDay, 0)
                              }
                            >
                              + Esercizio
                            </ColoredButton>
                          </div>
                          <div className="col-4 m-0 p-0">
                            <ColoredButton
                              className="button-size-delete-2 button-font-size-delete"
                              onClick={() =>
                                handleAddSerie(indexWeek, indexDay, 0)
                              }
                            >
                              + Super set
                            </ColoredButton>
                          </div>
                        </div>

                        {day.sections[0] &&
                          day.sections[0].exercises.map(
                            (exercise, indexExercise) => (
                              <SectionShell className="col-12 mb-2" key={indexExercise}>
                                {exercise &&
                                exercise.super_series &&
                                exercise.super_series.length === 0 ? (
                                  <div className="row col-12 padding-page-field">
                                    <div className="col-6 m-0 padding-page-field mt-2">
                                      <span className="text-font-big">
                                        Esercizio singolo
                                      </span>
                                    </div>
                                    <div className="col-6 m-0 padding-page-field mt-2">
                                      <Autocomplete
                                        size="small"
                                        className="col-12"
                                        value={exercise.exe}
                                        onChange={(
                                          event: any,
                                          newValue: IExercise | null
                                        ) => {
                                          handleExerciseSelected(
                                            indexWeek,
                                            indexDay,
                                            indexExercise,
                                            0,
                                            newValue
                                          );
                                        }}
                                        getOptionLabel={(option) => option.name}
                                        options={exerciseList}
                                        renderOption={(props, option) => (
                                          <li {...props} key={option.id}>
                                            {option.name + " - "}{" "}
                                            {option.type === "T" ? "T" : "P"}
                                          </li>
                                        )}
                                        renderInput={(params) => (
                                          <TextField {...params} />
                                        )}
                                      />
                                    </div>

                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Order"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          0
                                        }
                                        name="order"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.order}
                                      />
                                    </div>

                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Serie"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          0
                                        }
                                        name="series"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.series}
                                      />
                                    </div>

                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Ripetizioni"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          0
                                        }
                                        name="repetitions"
                                        className="col-12 no-pm"
                                        type="text"
                                        value={exercise.repetitions}
                                      />
                                    </div>

                                    <div className="col-4 m-0 padding-page-field mt-2 mb-2 d-flex justify-content-between">
                                      <TextField
                                        label="Rest minutes"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          0
                                        }
                                        name="stopMin"
                                        className="col-5 mr-5"
                                        type="number"
                                        value={Math.floor(exercise.stop / 60)}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              m
                                            </InputAdornment>
                                          ),
                                        }}
                                      />

                                      <TextField
                                        label="Rest"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          0
                                        }
                                        name="stopSec"
                                        className="col-5 no-pm"
                                        type="number"
                                        value={exercise.stop % 60}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              s
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </div>

                                    <div className="col-6 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Descrizione"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          0
                                        }
                                        name="description"
                                        className="col-12 no-pm"
                                        value={exercise.description}
                                      />
                                    </div>

                                    <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Carico"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          0
                                        }
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              kg
                                            </InputAdornment>
                                          ),
                                        }}
                                        name="load"
                                        className="col-12 no-pm"
                                        value={exercise.load}
                                      />
                                    </div>

                                    <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Intensità"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          0
                                        }
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              %
                                            </InputAdornment>
                                          ),
                                        }}
                                        name="intensity"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.intensity}
                                      />
                                    </div>

                                    <div className="m-0 padding-page-field mt-2 mb-2">
                                      <ColoredButtonDelete
                                        className="button-size-plus button-font-size-delete float-right"
                                        onClick={() =>
                                          handleDeleteExercise(
                                            indexWeek,
                                            indexDay,
                                            indexExercise,
                                            0
                                          )
                                        }
                                      >
                                        -
                                      </ColoredButtonDelete>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="row col-12 padding-page-field">
                                    <div className="col-3 m-0 padding-page-field mt-2">
                                      <span className="text-font-big">
                                        Super set
                                      </span>
                                    </div>
                                    <div className="col-9 m-0 padding-page-field mt-2">
                                      <ColoredButton
                                        className="button-size-plus button-font-size-delete"
                                        onClick={() =>
                                          handleAddSerieEx(
                                            indexWeek,
                                            indexDay,
                                            indexExercise,
                                            0
                                          )
                                        }
                                      >
                                        +
                                      </ColoredButton>
                                    </div>
                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Order"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          0
                                        }
                                        name="order"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.order}
                                      />
                                    </div>
                                    {/* <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Order"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        name="order"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.order}
                                      />
                                    </div>
  
                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Serie"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        name="series"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.series}
                                      />
                                    </div>
  
                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Ripetizioni"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        name="repetitions"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.repetitions}
                                      />
                                    </div>
  
                                    <div className="col-4 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Rest"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        name="stop"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.stop}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              s
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </div>
  
                                    <div className="col-6 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Descrizione"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        name="description"
                                        className="col-12 no-pm"
                                        value={
                                          exercise.description
                                            ? exercise.description
                                            : ""
                                        }
                                      />
                                    </div>
  
                                    <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Carico"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              kg
                                            </InputAdornment>
                                          ),
                                        }}
                                        name="load"
                                        className="col-12 no-pm"
                                        value={exercise.load}
                                      />
                                    </div>
  
                                    <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Intensità"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              %
                                            </InputAdornment>
                                          ),
                                        }}
                                        name="intensity"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.intensity}
                                      />
                                      </div> */}

                                    {exercise &&
                                      exercise.super_series &&
                                      exercise.super_series.map(
                                        (serie, indexSS) => (
                                          <div
                                            className="col-12 row m-0 padding-page-field mt-2"
                                            key={indexSS}
                                          >
                                            <Autocomplete
                                              size="small"
                                              className="col-12 mb-1 mt-3"
                                              value={serie.exe}
                                              onChange={(
                                                event: any,
                                                newValue: IExercise | null
                                              ) => {
                                                handleExerciseSSelected(
                                                  indexWeek,
                                                  indexDay,
                                                  indexExercise,
                                                  indexSS,
                                                  0,
                                                  newValue
                                                );
                                              }}
                                              getOptionLabel={(option) =>
                                                option.name
                                              }
                                              options={exerciseList}
                                              renderOption={(props, option) => (
                                                <li {...props} key={option.id}>
                                                  {option.name + " - "}{" "}
                                                  {option.type === "T"
                                                    ? "T"
                                                    : "P"}
                                                </li>
                                              )}
                                              renderInput={(params) => (
                                                <TextField {...params} />
                                              )}
                                            />

                                            <div className="col-4 padding-page-field mt-2">
                                              <TextField
                                                label="Order"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  0
                                                }
                                                name="order"
                                                className="col-12 no-pm"
                                                type="number"
                                                value={serie.order}
                                              />
                                            </div>

                                            <div className="col-4 m-0 padding-page-field mt-2">
                                              <TextField
                                                label="Ripetizioni"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  0
                                                }
                                                name="repetitions"
                                                className="col-12 no-pm"
                                                type="text"
                                                value={serie.repetitions}
                                              />
                                            </div>

                                            <div className="col-4 m-0 padding-page-field mt-2 mb-2 d-flex justify-content-between">
                                              <TextField
                                                label="Rest minutes"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  0
                                                }
                                                name="stopMin"
                                                className="col-5 mr-5"
                                                type="number"
                                                value={Math.floor(
                                                  serie.stop / 60
                                                )}
                                                InputProps={{
                                                  endAdornment: (
                                                    <InputAdornment position="end">
                                                      m
                                                    </InputAdornment>
                                                  ),
                                                }}
                                              />

                                              <TextField
                                                label="Rest"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  0
                                                }
                                                name="stopSec"
                                                className="col-5 no-pm"
                                                type="number"
                                                value={serie.stop % 60}
                                                InputProps={{
                                                  endAdornment: (
                                                    <InputAdornment position="end">
                                                      s
                                                    </InputAdornment>
                                                  ),
                                                }}
                                              />
                                            </div>

                                            <div className="col-6 m-0 padding-page-field mt-2 mb-2">
                                              <TextField
                                                label="Descrizione"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  0
                                                }
                                                name="description"
                                                className="col-12 no-pm"
                                                value={serie.description}
                                              />
                                            </div>

                                            <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                              <TextField
                                                label="Carico"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  0
                                                }
                                                InputProps={{
                                                  endAdornment: (
                                                    <InputAdornment position="end">
                                                      kg
                                                    </InputAdornment>
                                                  ),
                                                }}
                                                name="load"
                                                className="col-12 no-pm"
                                                value={serie.load}
                                              />
                                            </div>

                                            <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                              <TextField
                                                label="Intensità"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  0
                                                }
                                                InputProps={{
                                                  endAdornment: (
                                                    <InputAdornment position="end">
                                                      %
                                                    </InputAdornment>
                                                  ),
                                                }}
                                                name="intensity"
                                                className="col-12 no-pm"
                                                type="number"
                                                value={serie.intensity}
                                              />
                                            </div>

                                            <div className="col-4 m-0 padding-page-field mt-2 mb-2">
                                              <ColoredButtonDelete
                                                className="button-size-plus button-font-size-delete"
                                                onClick={() =>
                                                  handleDeleteSerieEx(
                                                    indexWeek,
                                                    indexDay,
                                                    indexExercise,
                                                    indexSS,
                                                    0
                                                  )
                                                }
                                              >
                                                -
                                              </ColoredButtonDelete>
                                            </div>
                                          </div>
                                        )
                                      )}
                                  </div>
                                )}
                              </SectionShell>
                            )
                          )}
                        <div className="col-12  row mt-4 mb-2 m-0 p-0 text-align-center">
                          <div className="col-4  m-0 p-0">
                            <div className="col-12">
                              <h2>Fase centrale </h2>
                            </div>
                            <div className="col-12 d-flex justify-content-between">
                              <div className="col-4 m-0 p-0">
                                <ColoredButton
                                  className="button-size-delete-2 button-font-size-delete"
                                  onClick={() =>
                                    handleCopySection(indexWeek, indexDay, 1)
                                  }
                                >
                                  Copia sezione
                                </ColoredButton>
                              </div>
                              <div className="col-4 m-0 p-0">
                                <ColoredButton
                                  className="button-size-delete-2 button-font-size-delete"
                                  onClick={() =>
                                    handlePasteSection(indexWeek, indexDay, 1)
                                  }
                                >
                                  Incolla sezione
                                </ColoredButton>
                              </div>
                            </div>
                          </div>
                          <div className="col-4 m-0 p-0">
                            <ColoredButton
                              className="button-size-delete-2 button-font-size-delete"
                              onClick={() =>
                                handleAddEsercizio(indexWeek, indexDay, 1)
                              }
                            >
                              + Esercizio
                            </ColoredButton>
                          </div>
                          <div className="col-4 m-0 p-0 ">
                            <ColoredButton
                              className="button-size-delete-2 button-font-size-delete"
                              onClick={() =>
                                handleAddSerie(indexWeek, indexDay, 1)
                              }
                            >
                              + Super set
                            </ColoredButton>
                          </div>
                        </div>

                        {day.sections[1] &&
                          day.sections[1].exercises.map(
                            (exercise, indexExercise) => (
                              <SectionShell className="col-12 mb-2" key={indexExercise}>
                                {exercise &&
                                exercise.super_series &&
                                exercise.super_series.length === 0 ? (
                                  <div className="row col-12 padding-page-field">
                                    <div className="col-6 m-0 padding-page-field mt-2">
                                      <span className="text-font-big">
                                        Esercizio singolo
                                      </span>
                                    </div>
                                    <div className="col-6 m-0 padding-page-field mt-2">
                                      <Autocomplete
                                        size="small"
                                        className="col-12"
                                        value={exercise.exe}
                                        onChange={(
                                          event: any,
                                          newValue: IExercise | null
                                        ) => {
                                          handleExerciseSelected(
                                            indexWeek,
                                            indexDay,
                                            indexExercise,
                                            1,
                                            newValue
                                          );
                                        }}
                                        getOptionLabel={(option) => option.name}
                                        options={exerciseList}
                                        renderOption={(props, option) => (
                                          <li {...props} key={option.id}>
                                            {option.name + " - "}{" "}
                                            {option.type === "T" ? "T" : "P"}
                                          </li>
                                        )}
                                        renderInput={(params) => (
                                          <TextField {...params} />
                                        )}
                                      />
                                    </div>

                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Order"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          1
                                        }
                                        name="order"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.order}
                                      />
                                    </div>

                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Serie"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          1
                                        }
                                        name="series"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.series}
                                      />
                                    </div>

                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Ripetizioni"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          1
                                        }
                                        name="repetitions"
                                        className="col-12 no-pm"
                                        type="text"
                                        value={exercise.repetitions}
                                      />
                                    </div>

                                    <div className="col-4 m-0 padding-page-field mt-2 mb-2 d-flex justify-content-between">
                                      <TextField
                                        label="Rest minutes"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          1
                                        }
                                        name="stopMin"
                                        className="col-5 mr-5"
                                        type="number"
                                        value={Math.floor(exercise.stop / 60)}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              m
                                            </InputAdornment>
                                          ),
                                        }}
                                      />

                                      <TextField
                                        label="Rest"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          1
                                        }
                                        name="stopSec"
                                        className="col-5 no-pm"
                                        type="number"
                                        value={exercise.stop % 60}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              s
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </div>
                                    <div className="col-6 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Descrizione"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          1
                                        }
                                        name="description"
                                        className="col-12 no-pm"
                                        value={exercise.description}
                                      />
                                    </div>

                                    <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Carico"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          1
                                        }
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              kg
                                            </InputAdornment>
                                          ),
                                        }}
                                        name="load"
                                        className="col-12 no-pm"
                                        value={exercise.load}
                                      />
                                    </div>

                                    <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Intensità"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          1
                                        }
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              %
                                            </InputAdornment>
                                          ),
                                        }}
                                        name="intensity"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.intensity}
                                      />
                                    </div>

                                    <div className="m-0 padding-page-field mt-2 mb-2">
                                      <ColoredButtonDelete
                                        className="button-size-plus button-font-size-delete float-right"
                                        onClick={() =>
                                          handleDeleteExercise(
                                            indexWeek,
                                            indexDay,
                                            indexExercise,
                                            1
                                          )
                                        }
                                      >
                                        -
                                      </ColoredButtonDelete>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="row col-12 padding-page-field">
                                    <div className="col-3 m-0 padding-page-field mt-2">
                                      <span className="text-font-big">
                                        Super set
                                      </span>
                                    </div>
                                    <div className="col-9 m-0 padding-page-field mt-2">
                                      <ColoredButton
                                        className="button-size-plus button-font-size-delete"
                                        onClick={() =>
                                          handleAddSerieEx(
                                            indexWeek,
                                            indexDay,
                                            indexExercise,
                                            1
                                          )
                                        }
                                      >
                                        +
                                      </ColoredButton>
                                    </div>
                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Order"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          1
                                        }
                                        name="order"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.order}
                                      />
                                    </div>
                                    {/* <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Order"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        name="order"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.order}
                                      />
                                    </div>
  
                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Serie"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        name="series"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.series}
                                      />
                                    </div>
  
                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Ripetizioni"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        name="repetitions"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.repetitions}
                                      />
                                    </div>
  
                                    <div className="col-4 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Rest"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        name="stop"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.stop}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              s
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </div>
  
                                    <div className="col-6 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Descrizione"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        name="description"
                                        className="col-12 no-pm"
                                        value={
                                          exercise.description
                                            ? exercise.description
                                            : ""
                                        }
                                      />
                                    </div>
  
                                    <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Carico"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              kg
                                            </InputAdornment>
                                          ),
                                        }}
                                        name="load"
                                        className="col-12 no-pm"
                                        value={exercise.load}
                                      />
                                    </div>
  
                                    <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Intensità"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              %
                                            </InputAdornment>
                                          ),
                                        }}
                                        name="intensity"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.intensity}
                                      />
                                      </div> */}

                                    {exercise &&
                                      exercise.super_series &&
                                      exercise.super_series.map(
                                        (serie, indexSS) => (
                                          <div
                                            className="col-12 row m-0 padding-page-field mt-2"
                                            key={indexSS}
                                          >
                                            <Autocomplete
                                              size="small"
                                              className="col-12 mb-1 mt-3"
                                              value={serie.exe}
                                              onChange={(
                                                event: any,
                                                newValue: IExercise | null
                                              ) => {
                                                handleExerciseSSelected(
                                                  indexWeek,
                                                  indexDay,
                                                  indexExercise,
                                                  indexSS,
                                                  1,
                                                  newValue
                                                );
                                              }}
                                              getOptionLabel={(option) =>
                                                option.name
                                              }
                                              options={exerciseList}
                                              renderOption={(props, option) => (
                                                <li {...props} key={option.id}>
                                                  {option.name + " - "}{" "}
                                                  {option.type === "T"
                                                    ? "T"
                                                    : "P"}
                                                </li>
                                              )}
                                              renderInput={(params) => (
                                                <TextField {...params} />
                                              )}
                                            />

                                            <div className="col-4 padding-page-field mt-2">
                                              <TextField
                                                label="Order"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  1
                                                }
                                                name="order"
                                                className="col-12 no-pm"
                                                type="number"
                                                value={serie.order}
                                              />
                                            </div>

                                            <div className="col-4 m-0 padding-page-field mt-2">
                                              <TextField
                                                label="Ripetizioni"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  1
                                                }
                                                name="repetitions"
                                                className="col-12 no-pm"
                                                type="text"
                                                value={serie.repetitions}
                                              />
                                            </div>

                                            <div className="col-4 m-0 padding-page-field mt-2 mb-2 d-flex justify-content-between">
                                              <TextField
                                                label="Rest minutes"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  1
                                                }
                                                name="stopMin"
                                                className="col-5 mr-5"
                                                type="number"
                                                value={Math.floor(
                                                  serie.stop / 60
                                                )}
                                                InputProps={{
                                                  endAdornment: (
                                                    <InputAdornment position="end">
                                                      m
                                                    </InputAdornment>
                                                  ),
                                                }}
                                              />

                                              <TextField
                                                label="Rest"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  1
                                                }
                                                name="stopSec"
                                                className="col-5 no-pm"
                                                type="number"
                                                value={serie.stop % 60}
                                                InputProps={{
                                                  endAdornment: (
                                                    <InputAdornment position="end">
                                                      s
                                                    </InputAdornment>
                                                  ),
                                                }}
                                              />
                                            </div>

                                            <div className="col-6 m-0 padding-page-field mt-2 mb-2">
                                              <TextField
                                                label="Descrizione"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  1
                                                }
                                                name="description"
                                                className="col-12 no-pm"
                                                value={serie.description}
                                              />
                                            </div>

                                            <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                              <TextField
                                                label="Carico"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  1
                                                }
                                                InputProps={{
                                                  endAdornment: (
                                                    <InputAdornment position="end">
                                                      kg
                                                    </InputAdornment>
                                                  ),
                                                }}
                                                name="load"
                                                className="col-12 no-pm"
                                                value={serie.load}
                                              />
                                            </div>

                                            <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                              <TextField
                                                label="Intensità"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  1
                                                }
                                                InputProps={{
                                                  endAdornment: (
                                                    <InputAdornment position="end">
                                                      %
                                                    </InputAdornment>
                                                  ),
                                                }}
                                                name="intensity"
                                                className="col-12 no-pm"
                                                type="number"
                                                value={serie.intensity}
                                              />
                                            </div>

                                            <div className="col-4 m-0 padding-page-field mt-2 mb-2">
                                              <ColoredButtonDelete
                                                className="button-size-plus button-font-size-delete"
                                                onClick={() =>
                                                  handleDeleteSerieEx(
                                                    indexWeek,
                                                    indexDay,
                                                    indexExercise,
                                                    indexSS,
                                                    1
                                                  )
                                                }
                                              >
                                                -
                                              </ColoredButtonDelete>
                                            </div>
                                          </div>
                                        )
                                      )}
                                  </div>
                                )}
                              </SectionShell>
                            )
                          )}

                        <div className="col-12 row  mt-4 mb-2 m-0 p-0 text-align-center">
                          <div className="col-4 m-0 p-0">
                            <div className="col-12">
                              <h2>Defaticamento </h2>
                            </div>
                            <div className="col-12 d-flex justify-content-between">
                              <div className="col-4 m-0 p-0">
                                <ColoredButton
                                  className="button-size-delete-2 button-font-size-delete"
                                  onClick={() =>
                                    handleCopySection(indexWeek, indexDay, 2)
                                  }
                                >
                                  Copia sezione
                                </ColoredButton>
                              </div>
                              <div className="col-4 m-0 p-0">
                                <ColoredButton
                                  className="button-size-delete-2 button-font-size-delete"
                                  onClick={() =>
                                    handlePasteSection(indexWeek, indexDay, 2)
                                  }
                                >
                                  Incolla sezione
                                </ColoredButton>
                              </div>
                            </div>
                          </div>
                          <div className="col-4 m-0 p-0">
                            <ColoredButton
                              className="button-size-delete-2 button-font-size-delete"
                              onClick={() =>
                                handleAddEsercizio(indexWeek, indexDay, 2)
                              }
                            >
                              + Esercizio
                            </ColoredButton>
                          </div>
                          <div className="col-4 m-0 p-0 ">
                            <ColoredButton
                              className="button-size-delete-2 button-font-size-delete"
                              onClick={() =>
                                handleAddSerie(indexWeek, indexDay, 2)
                              }
                            >
                              + Super set
                            </ColoredButton>
                          </div>
                        </div>
                        {day.sections[2] &&
                          day.sections[2].exercises.map(
                            (exercise, indexExercise) => (
                              <SectionShell className="col-12 mb-2" key={indexExercise}>
                                {exercise &&
                                exercise.super_series &&
                                exercise.super_series.length === 0 ? (
                                  <div className="row col-12 padding-page-field">
                                    <div className="col-6 m-0 padding-page-field mt-2">
                                      <span className="text-font-big">
                                        Esercizio singolo
                                      </span>
                                    </div>
                                    <div className="col-6 m-0 padding-page-field mt-2">
                                      <Autocomplete
                                        size="small"
                                        className="col-12"
                                        value={exercise.exe}
                                        onChange={(
                                          event: any,
                                          newValue: IExercise | null
                                        ) => {
                                          handleExerciseSelected(
                                            indexWeek,
                                            indexDay,
                                            indexExercise,
                                            2,
                                            newValue
                                          );
                                        }}
                                        getOptionLabel={(option) => option.name}
                                        options={exerciseList}
                                        renderOption={(props, option) => (
                                          <li {...props} key={option.id}>
                                            {option.name + " - "}{" "}
                                            {option.type === "T" ? "T" : "P"}
                                          </li>
                                        )}
                                        renderInput={(params) => (
                                          <TextField {...params} />
                                        )}
                                      />
                                    </div>

                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Order"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          2
                                        }
                                        name="order"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.order}
                                      />
                                    </div>

                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Serie"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          2
                                        }
                                        name="series"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.series}
                                      />
                                    </div>

                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Ripetizioni"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          2
                                        }
                                        name="repetitions"
                                        className="col-12 no-pm"
                                        type="text"
                                        value={exercise.repetitions}
                                      />
                                    </div>

                                    <div className="col-4 m-0 padding-page-field mt-2 mb-2 d-flex justify-content-between">
                                      <TextField
                                        label="Rest minutes"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          2
                                        }
                                        name="stopMin"
                                        className="col-5 mr-5"
                                        type="number"
                                        value={Math.floor(exercise.stop / 60)}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              m
                                            </InputAdornment>
                                          ),
                                        }}
                                      />

                                      <TextField
                                        label="Rest"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          2
                                        }
                                        name="stopSec"
                                        className="col-5 no-pm"
                                        type="number"
                                        value={exercise.stop % 60}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              s
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </div>
                                    <div className="col-6 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Descrizione"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          2
                                        }
                                        name="description"
                                        className="col-12 no-pm"
                                        value={exercise.description}
                                      />
                                    </div>

                                    <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Carico"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          2
                                        }
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              kg
                                            </InputAdornment>
                                          ),
                                        }}
                                        name="load"
                                        className="col-12 no-pm"
                                        value={exercise.load}
                                      />
                                    </div>

                                    <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Intensità"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          2
                                        }
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              %
                                            </InputAdornment>
                                          ),
                                        }}
                                        name="intensity"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.intensity}
                                      />
                                    </div>

                                    <div className="m-0 padding-page-field mt-2 mb-2">
                                      <ColoredButtonDelete
                                        className="button-size-plus button-font-size-delete float-right"
                                        onClick={() =>
                                          handleDeleteExercise(
                                            indexWeek,
                                            indexDay,
                                            indexExercise,
                                            2
                                          )
                                        }
                                      >
                                        -
                                      </ColoredButtonDelete>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="row col-12 padding-page-field">
                                    <div className="col-3 m-0 padding-page-field mt-2">
                                      <span className="text-font-big">
                                        Super set
                                      </span>
                                    </div>
                                    <div className="col-9 m-0 padding-page-field mt-2">
                                      <ColoredButton
                                        className="button-size-plus button-font-size-delete"
                                        onClick={() =>
                                          handleAddSerieEx(
                                            indexWeek,
                                            indexDay,
                                            indexExercise,
                                            2
                                          )
                                        }
                                      >
                                        +
                                      </ColoredButton>
                                    </div>
                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Order"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise +
                                          "_" +
                                          2
                                        }
                                        name="order"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.order}
                                      />
                                    </div>
                                    {/* <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Order"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        name="order"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.order}
                                      />
                                    </div>
  
                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Serie"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        name="series"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.series}
                                      />
                                    </div>
  
                                    <div className="col-4 m-0 padding-page-field mt-2">
                                      <TextField
                                        label="Ripetizioni"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        name="repetitions"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.repetitions}
                                      />
                                    </div>
  
                                    <div className="col-4 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Rest"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        name="stop"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.stop}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              s
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                    </div>
  
                                    <div className="col-6 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Descrizione"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        name="description"
                                        className="col-12 no-pm"
                                        value={
                                          exercise.description
                                            ? exercise.description
                                            : ""
                                        }
                                      />
                                    </div>
  
                                    <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Carico"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              kg
                                            </InputAdornment>
                                          ),
                                        }}
                                        name="load"
                                        className="col-12 no-pm"
                                        value={exercise.load}
                                      />
                                    </div>
  
                                    <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                      <TextField
                                        label="Intensità"
                                        size="small"
                                        onChange={handleInputExercise}
                                        key={indexExercise}
                                        id={
                                          indexWeek +
                                          "_" +
                                          indexDay +
                                          "_" +
                                          indexExercise
                                        }
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              %
                                            </InputAdornment>
                                          ),
                                        }}
                                        name="intensity"
                                        className="col-12 no-pm"
                                        type="number"
                                        value={exercise.intensity}
                                      />
                                      </div> */}

                                    {exercise &&
                                      exercise.super_series &&
                                      exercise.super_series.map(
                                        (serie, indexSS) => (
                                          <div
                                            className="col-12 row m-0 padding-page-field mt-2"
                                            key={indexSS}
                                          >
                                            <Autocomplete
                                              size="small"
                                              className="col-12 mb-1 mt-3"
                                              value={serie.exe}
                                              onChange={(
                                                event: any,
                                                newValue: IExercise | null
                                              ) => {
                                                handleExerciseSSelected(
                                                  indexWeek,
                                                  indexDay,
                                                  indexExercise,
                                                  indexSS,
                                                  2,
                                                  newValue
                                                );
                                              }}
                                              getOptionLabel={(option) =>
                                                option.name
                                              }
                                              options={exerciseList}
                                              renderOption={(props, option) => (
                                                <li {...props} key={option.id}>
                                                  {option.name + " - "}{" "}
                                                  {option.type === "T"
                                                    ? "T"
                                                    : "P"}
                                                </li>
                                              )}
                                              renderInput={(params) => (
                                                <TextField {...params} />
                                              )}
                                            />

                                            <div className="col-4 padding-page-field mt-2">
                                              <TextField
                                                label="Order"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  2
                                                }
                                                name="order"
                                                className="col-12 no-pm"
                                                type="number"
                                                value={serie.order}
                                              />
                                            </div>

                                            <div className="col-4 m-0 padding-page-field mt-2">
                                              <TextField
                                                label="Ripetizioni"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  2
                                                }
                                                name="repetitions"
                                                className="col-12 no-pm"
                                                type="text"
                                                value={serie.repetitions}
                                              />
                                            </div>

                                            <div className="col-4 m-0 padding-page-field mt-2 mb-2 d-flex justify-content-between">
                                              <TextField
                                                label="Rest minutes"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  2
                                                }
                                                name="stopMin"
                                                className="col-5 mr-5"
                                                type="number"
                                                value={Math.floor(
                                                  serie.stop / 60
                                                )}
                                                InputProps={{
                                                  endAdornment: (
                                                    <InputAdornment position="end">
                                                      m
                                                    </InputAdornment>
                                                  ),
                                                }}
                                              />

                                              <TextField
                                                label="Rest"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  2
                                                }
                                                name="stopSec"
                                                className="col-5 no-pm"
                                                type="number"
                                                value={serie.stop % 60}
                                                InputProps={{
                                                  endAdornment: (
                                                    <InputAdornment position="end">
                                                      s
                                                    </InputAdornment>
                                                  ),
                                                }}
                                              />
                                            </div>

                                            <div className="col-6 m-0 padding-page-field mt-2 mb-2">
                                              <TextField
                                                label="Descrizione"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  2
                                                }
                                                name="description"
                                                className="col-12 no-pm"
                                                value={serie.description}
                                              />
                                            </div>

                                            <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                              <TextField
                                                label="Carico"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  2
                                                }
                                                InputProps={{
                                                  endAdornment: (
                                                    <InputAdornment position="end">
                                                      kg
                                                    </InputAdornment>
                                                  ),
                                                }}
                                                name="load"
                                                className="col-12 no-pm"
                                                value={serie.load}
                                              />
                                            </div>

                                            <div className="col-3 m-0 padding-page-field mt-2 mb-2">
                                              <TextField
                                                label="Intensità"
                                                size="small"
                                                onChange={handleInputSerieEx}
                                                key={indexExercise}
                                                id={
                                                  indexWeek +
                                                  "_" +
                                                  indexDay +
                                                  "_" +
                                                  indexExercise +
                                                  "_" +
                                                  indexSS +
                                                  "_" +
                                                  2
                                                }
                                                InputProps={{
                                                  endAdornment: (
                                                    <InputAdornment position="end">
                                                      %
                                                    </InputAdornment>
                                                  ),
                                                }}
                                                name="intensity"
                                                className="col-12 no-pm"
                                                type="number"
                                                value={serie.intensity}
                                              />
                                            </div>

                                            <div className="col-4 m-0 padding-page-field mt-2 mb-2">
                                              <ColoredButtonDelete
                                                className="button-size-plus button-font-size-delete"
                                                onClick={() =>
                                                  handleDeleteSerieEx(
                                                    indexWeek,
                                                    indexDay,
                                                    indexExercise,
                                                    indexSS,
                                                    2
                                                  )
                                                }
                                              >
                                                -
                                              </ColoredButtonDelete>
                                            </div>
                                          </div>
                                        )
                                      )}
                                  </div>
                                )}
                              </SectionShell>
                            )
                          )}
                        <div className="col-12 mt-4 mb-2 m-0 p-0 text-align-center">
                          <ColoredButtonDelete
                            className="button-size-delete-2 button-font-size-delete"
                            onClick={() =>
                              handleDeleteSection(indexWeek, indexDay)
                            }
                          >
                            - Training day
                          </ColoredButtonDelete>
                        </div>
                      </DayCard>
                    ))}

                  {/* <div className="col-12 mt-4 mb-2 m-0 p-0 text-align-center">
                    <ColoredButtonDelete
                      className="button-size-delete-2 button-font-size-delete"
                      onClick={() => setDeleteWeek(indexWeek)}
                    >
                      Elimina week
                    </ColoredButtonDelete>
                  </div> */}

                  <div className="col-11 m-auto p-0 mt-4">
                    <hr className="col-12 no-pm" />
                  </div>
                </div>
              )
          )}
        {connectionEdited !== null && (
          <div className="col mt-4 mb-2 m-0 p-0 text-align-center">
            <ColoredButtonDelete
              className="button-size-delete button-font-size-delete"
              onClick={() => {
                handleDelete(connectionId);
                setIsDeleteConnection(true);
              }}
            >
              Elimina
            </ColoredButtonDelete>
          </div>
        )}
        {weekList.length > 0 && (
          <div className="col mt-4 mb-2 m-0 p-0 text-align-center">
            <ColoredButton
              className="button-size-delete button-font-size-delete"
              id="saveButton"
              onClick={() => handleSave()}
            >
              Salva
            </ColoredButton>
            {weekList[indexWeekShow].days.length > 2 && (
              <ColoredButton
                style={{ position: "fixed", right: 50, bottom: 50, zIndex: 10 }}
                onClick={() => handleSave()}
              >
                Salva
              </ColoredButton>
            )}
            <ColoredButton
              className="button-size-delete button-font-size-delete submitButton"
              onClick={() => handleSend()}
            >
              {!isPublished ? "Pubblica" : "Ritira"}
            </ColoredButton>
          </div>
        )}
        </Card>
      </Content>
      <Modal open={deleteWeek !== -1} onClose={() => setDeleteWeek(-1)}>
        <Box sx={modalStyle}>
          <span>Vuoi eliminare la settimana?</span>
          <div className="col-12 mt-4 m-0 p-0 text-align-center">
            <ColoredButtonDelete
              className="button-size-delete button-font-size-delete"
              onClick={() => handleRemoveWeek()}
            >
              Elimina
            </ColoredButtonDelete>
          </div>
        </Box>
      </Modal>
      {message !== "" && (
        <Alert
          className="alert-position-top"
          severity={isMessageError ? "error" : "success"}
        >
          {message}
        </Alert>
      )}
    </PageWrapper>
  );
};
