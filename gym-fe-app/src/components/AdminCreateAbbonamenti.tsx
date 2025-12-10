import styled from "@emotion/styled";
import { Button, ButtonProps } from "react-bootstrap";
import {
  Alert,
  IconButton,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CartService from "../services/CartService";
import { ICodScontoSer, IProductStripeSer } from "../models/Cart";
import { stringify } from "querystring";
import { SUB_TYPES } from "../constants/TypeConstants";

const ColoredButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: "#a6ce24",
  color: "#ffffff",
  fontWeight: 400,
  "&:hover": {
    color: "#ffffff",
    backgroundColor: "#192b3f",
  },
}));

const AdminCreateAbbonamenti: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(1);
  const [durationInMonths, setDurationInMonths] = useState<number>(0);
  const [tipoAbbonamento, setTipoAbbonamento] = useState<string>(
    SUB_TYPES.scheda_personalizzata
  );
  const [message, setMessage] = useState<string>("");
  const [isMessageError, setIsMessageError] = useState<boolean>(false);
  const [productStripeSer, setProductStripeSer] = useState<IProductStripeSer>({
    nome: "",
    prezzo: 0,
    conto_mesi: 0,
  });
  const createAbbonamento = () => {
    if (checkAbbonamentoInfo()) {
      let tempIProductStripeSer = productStripeSer;
      tempIProductStripeSer.nome = tipoAbbonamento + name;
      tempIProductStripeSer.prezzo = price;
      tempIProductStripeSer.conto_mesi = durationInMonths;
      setProductStripeSer(tempIProductStripeSer);
      CartService.createAbbonamento(tempIProductStripeSer)

        .then((response) => {
          setMessage("Abbonamento creato con successo");
          setIsMessageError(false);

          setTimeout(() => {
            setMessage("");
          }, 4000);
        })
        .catch((error) => {
          setMessage("C'è stato un errore nella creazione dell'abbonamento'");
          setIsMessageError(true);

          setTimeout(() => {
            setMessage("");
          }, 4000);
        });
    }
  };
  const checkAbbonamentoInfo = () => {
    if (name == "") {
      setMessage("nome obbligatorio");
      setIsMessageError(true);

      setTimeout(() => {
        setMessage("");
      }, 4000);
      return false;
    }
    return true;
  };
  return (
    <div className="col-12 no-pm m-0 p-0 ">
      <div className="col-6 m-0 p-0 mt-3">
        <h3>Crea un abbonamento</h3>
        <ColoredButton
          className="button-size-delete button-font-size-delete m-2"
          onClick={() => {
            createAbbonamento();
          }}
        >
          Crea ora
        </ColoredButton>
      </div>
      <div className="col-12 row">
        <div className="col-6 m-0 p-4 text-align-left">
          <span className="text-font-big">Nome</span>
          <div className="col-6 m-0 p-0 text-align-left">
            <TextField
              size="small"
              onChange={(e) => {
                setName(e.target.value);
              }}
              name="text"
              type="text"
              value={name}
            />
          </div>
        </div>
        <div className="col-6 m-0 p-4 text-align-left">
          <span className="text-font-big">Prezzo</span>
          <div className="col-6 m-0 p-0 text-align-left">
            <TextField
              size="small"
              onChange={(e) => {
                setPrice(parseFloat(e.target.value));
              }}
              InputProps={{ inputProps: { min: 1 } }}
              name="number"
              type="number"
              value={price}
            />
          </div>
        </div>
      </div>
      <div className="col-12 row">
        <div className="col-6 m-0 p-4 text-align-left">
          <span className="text-font-big">Durata in mesi</span>
          <div className="col-6 m-0 p-0 text-align-left">
            <TextField
              size="small"
              onChange={(e) => {
                setDurationInMonths(parseInt(e.target.value));
              }}
              InputProps={{ inputProps: { min: 1 } }}
              name="number"
              type="number"
              value={durationInMonths}
            />
          </div>
        </div>
        <div className="col-6 m-0 p-4 text-align-left">
          <span className="text-font-big">Tipo di abbonamento</span>
          <div className="col-6 m-0 p-0 text-align-left">
            <Select
              className="col-12"
              // id="demo-multiple-checkbox"
              value={tipoAbbonamento}
              onChange={(e) => {
                setTipoAbbonamento(e.target.value);
              }}
              input={<OutlinedInput />}
              // renderValue={(selected) => selected.join(", ")}
            >
              <MenuItem
                key={SUB_TYPES.scheda_personalizzata}
                value={SUB_TYPES.scheda_personalizzata}
              >
                <ListItemText primary={SUB_TYPES.scheda_personalizzata} />
              </MenuItem>

              <MenuItem
                key={SUB_TYPES.coaching_online}
                value={SUB_TYPES.coaching_online}
              >
                <ListItemText primary={SUB_TYPES.coaching_online} />
              </MenuItem>
            </Select>
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

export default AdminCreateAbbonamenti;
