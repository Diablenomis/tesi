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
import { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CartService from "../services/CartService";
import { ICodScontoSer } from "../models/Cart";
import { stringify } from "querystring";

const ColoredButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: "#a6ce24",
  color: "#ffffff",
  fontWeight: 400,
  "&:hover": {
    color: "#ffffff",
    backgroundColor: "#192b3f",
  },
}));

const AdminCreateCode: React.FC = () => {
  const [pageSelected, setPageSelected] = useState<string>("connection");
  const [codice, setCodice] = useState<string>("");
  const [sconto, setSconto] = useState<number>(1);
  const [isScontoPercentuale, setIsScontoPercentuale] =
    useState<boolean>(false);
  const [inizioValidita, setInizioValidita] = useState<string>("");
  const [fineValidita, setFineValidita] = useState<string>("");
  const [utilizziMassimi, setUtilizziMassimi] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [isMessageError, setIsMessageError] = useState<boolean>(false);
  const [codScontoSer, setCodScontoSer] = useState<ICodScontoSer>({
    codice: "",
    sconto: "",
    percentuale: false,
    inizioValidita: "",
    fineValidita: "",
    massimoUsi: 0,
  });
  const handleChangeScontoType = (e: any) => {
    e.target.value === "Euro"
      ? setIsScontoPercentuale(false)
      : setIsScontoPercentuale(true);
  };

  const handleInizioValidita = (event: any) => {
    const dataFormattata = event.format("YYYY-MM-DD");
    setInizioValidita(dataFormattata);
  };
  const handleFineValidita = (event: any) => {
    const dataFormattata = event.format("YYYY-MM-DD");
    setFineValidita(dataFormattata);
  };

  const createCode = () => {
    if (checkCodeInfo()) {
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
      if (tempCodScontoSer.codice === "") {
        delete tempCodScontoSer.codice;
      }

      setCodScontoSer(tempCodScontoSer);
      CartService.createCode(codScontoSer)

        .then((response) => {
          setMessage("Codice creato con successo");
          setIsMessageError(false);

          setTimeout(() => {
            setMessage("");
          }, 4000);
        })
        .catch((error) => {
          setMessage("C'è stato un errore nella creazione del  codice'");
          setIsMessageError(false);

          setTimeout(() => {
            setMessage("");
          }, 4000);
        });
    }
  };
  const checkCodeInfo = () => {
    if (!fineValidita) {
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
    <div className="col-12 no-pm m-0 p-0">
      <div className="col-6 m-0 p-0 mt-3">
        <h3>Crea un codice sconto</h3>
        <ColoredButton
          className="button-size-delete button-font-size-delete m-2"
          onClick={() => {
            createCode();
          }}
        >
          Crea ora
        </ColoredButton>
      </div>
      <div className="col-12 row">
        <div className="col-6 m-0 p-4 text-align-left">
          <span className="text-font-big">Codice</span>
          <div className="col-6 m-0 p-0 text-align-left">
            <TextField
              label="Non obbligatorio"
              size="small"
              onChange={(e) => {
                setCodice(e.target.value);
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
                setSconto(parseFloat(e.target.value));
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
                setUtilizziMassimi(parseInt(e.target.value));
              }}
              InputProps={{ inputProps: { min: 1 } }}
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
              />
            </LocalizationProvider>
          </div>
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

export default AdminCreateCode;
