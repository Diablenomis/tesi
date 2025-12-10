import styled from "@emotion/styled";
import { Button, ButtonProps } from "react-bootstrap";
import {
  Alert,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CartService from "../services/CartService";
import { ICodScontoSer } from "../models/Cart";
import { stringify } from "querystring";
import dayjs from "dayjs";

const ColoredButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: "#a6ce24",
  color: "#ffffff",
  fontWeight: 400,
  "&:hover": {
    color: "#ffffff",
    backgroundColor: "#192b3f",
  },
}));

const AdminEditCodes: React.FC = () => {
  const [initialName,setInitialName] = useState<string>("");
  const [codList, setCodList] = useState<any>([]);
  const [codice, setCodice] = useState<string>("");
  const [sconto, setSconto] = useState<number>(1);
  const [isScontoPercentuale, setIsScontoPercentuale] =
    useState<boolean>(false);
  const [inizioValidita, setInizioValidita] = useState<string>("");
  const [fineValidita, setFineValidita] = useState<string>("");
  const [utilizziMassimi, setUtilizziMassimi] = useState<number>(1);

  const [codScontoSer, setCodScontoSer] = useState<ICodScontoSer>({
    codice: "",
    sconto: "",
    percentuale: false,
    inizioValidita: "",
    fineValidita: "",
    massimoUsi: 0,
  });

  const [message, setMessage] = useState<string>("");
  const [isMessageError, setIsMessageError] = useState<boolean>(false);

  useEffect(() => {
    CartService.getAllCodes()
      .then((response) => {
        setCodList(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleSelectCod = (e: any) => {
    let tempCod = codList.find(
      (singleCode: any) => singleCode.codice === e.target.value
    );

    setCodice(tempCod.codice);
    setInitialName(tempCod.codice)
    setSconto(parseFloat(tempCod.sconto));
    setIsScontoPercentuale(tempCod.percentuale);
    setInizioValidita(tempCod.inizioValidita);
    setFineValidita(tempCod.fineValidita);
    setUtilizziMassimi(parseInt(tempCod.massimoUsi));
    
  };

  const handleChangeScontoType = (e: any) => {
    setIsScontoPercentuale(e.target.value === "Euro" ? false : true);
  };

  const handleInizioValidita = (event: any) => {
    setInizioValidita(event.format("YYYY-MM-DD"));
  };

  const handleFineValidita = (event: any) => {
    setFineValidita(event.format("YYYY-MM-DD"));
  };

  const handleChangeCode = (newCode: string) => {
    setCodice(newCode);
  };

  const handleChangeUtilizzi = (newUtilizziMassimi: number) => {
    setUtilizziMassimi(newUtilizziMassimi);
  };

  const handleChangeSconto = (newSconto: string) => {
    setSconto(parseFloat(newSconto));
  };

  const handleSave = () => {
    let tempCodScontoSer = codScontoSer;
    tempCodScontoSer.codice = codice;
    tempCodScontoSer.sconto = sconto.toString();
    tempCodScontoSer.percentuale = isScontoPercentuale;

    tempCodScontoSer.fineValidita = fineValidita;
    tempCodScontoSer.massimoUsi = utilizziMassimi;
    const now = new Date();

    tempCodScontoSer.inizioValidita =
      inizioValidita !== ""
        ? inizioValidita
        : now.getFullYear() +
          "-" +
          String(now.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(now.getDate()).padStart(2, "0");

    setCodScontoSer(tempCodScontoSer);
    if (checkCodeInfo()) {
      CartService.editCode(
        initialName,
        codScontoSer
      )

        .then((response) => {
          setMessage("Codice modificato con successo");
          setIsMessageError(false);

          setTimeout(() => {
            setMessage("");
          }, 4000);
        })

        .catch((error) => {
          setMessage("C'è stato un errore nel salvataggio");
          setIsMessageError(true);

          setTimeout(() => {
            setMessage("");
          }, 4000);
          console.log(error);
        });
    }
  };
  const checkCodeInfo = () => {
    if (fineValidita == "") {
      setMessage("fine validità è obbligatorio da impostare");
      setIsMessageError(true);

      setTimeout(() => {
        setMessage("");
      }, 4000);
      return false;
    }
    return true;
  };
  return (
    <div className="col-12 no-pm m-0 p-0 content-container">
      <h3>Modifica un codice sconto</h3>
      <div className="col-6 m-0 p-4 text-align-left">
        <span className="text-font-big">Seleziona il codice</span>
        <br />
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={codice}
          size="small"
          className="col-4"
          onChange={handleSelectCod}
        >
          <MenuItem value="">
            <em>----</em>
          </MenuItem>
          {codList &&
            codList.length > 0 &&
            codList.map((singleCode: any) => {
              return (
                <MenuItem value={singleCode.codice}>
                  <em>{singleCode.codice}</em>
                </MenuItem>
              );
            })}
        </Select>
      </div>
      {codList && codList.length > 0 && codice !== "" && (
        <>
          <div className="col-12 row">
            <div className="col-6 m-0 p-4 text-align-left">
              <span className="text-font-big">Codice</span>
              <div className="col-6 m-0 p-0 text-align-left">
                <TextField
                  label="Non obbligatorio"
                  size="small"
                  onChange={(e) => {
                    handleChangeCode(e.target.value);
                  }}
                  name="text"
                  type="text"
                  value={codice}
                  className="codice-sconto"
                />
              </div>
            </div>
            <div className="col-6 m-0 p-4 text-align-left">
              <span className="text-font-big">Sconto</span>
              <div className="col-6 m-0 p-0 text-align-left">
                <TextField
                  label="Codice in euro o percentuale"
                  size="small"
                  onChange={(e) => {
                    handleChangeSconto(e.target.value);
                  }}
                  InputProps={{ inputProps: { min: 1 } }}
                  name="number"
                  type="number"
                  value={sconto}
                  className="codice-sconto"
                />
              </div>
            </div>
          </div>
          <div className="col-12 row">
            <div className="col-6 m-0 p-4 text-align-left">
              <span className="text-font-big">Seleziona la tipologia</span>
              <br />
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={isScontoPercentuale ? "Percentuale" : "Euro"}
                size="small"
                className="col-4"
                onChange={handleChangeScontoType}
              >
                <MenuItem value="Euro">
                  <em>Euro</em>
                </MenuItem>
                <MenuItem value="Percentuale">
                  <em>Percentuale</em>
                </MenuItem>
              </Select>
            </div>
            <div className="col-6 m-0 p-4 text-align-left">
              <span className="text-font-big">Utilizzi massimi</span>
              <div className="col-6 m-0 p-0 text-align-left">
                <TextField
                  label="Utilizzi massimi"
                  size="small"
                  onChange={(e) => {
                    handleChangeUtilizzi(parseInt(e.target.value));
                  }}
                  InputProps={{ inputProps: { min: 0 } }}
                  name="number"
                  type="number"
                  value={utilizziMassimi}
                  className="codice-sconto"
                />
              </div>
            </div>
          </div>
          <div className="col-12 row">
            <div className="col-6 m-0 p-4 text-align-left">
              <span className="text-font-big">Inizio validita</span>
              <div className="col-6 m-0 p-0 text-align-left">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="col-11"
                    label="Inizio validità"
                    onChange={handleInizioValidita}
                    format={"YYYY/MM/DD"}
                    value={dayjs(inizioValidita)}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="col-6 m-0 p-4 text-align-left">
              <span className="text-font-big">Fine validita</span>
              <div className="col-6 m-0 p-0 text-align-left">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="col-11"
                    label="Fine validità"
                    onChange={handleFineValidita}
                    format={"YYYY/MM/DD"}
                    value={dayjs(fineValidita)}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>
          <div className="col-6 m-0 p-0 mt-3">
            <ColoredButton
              className="button-size-delete button-font-size-delete m-2"
              onClick={() => {
                handleSave();
              }}
            >
              Salva
            </ColoredButton>
          </div>
        </>
      )}
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

export default AdminEditCodes;
