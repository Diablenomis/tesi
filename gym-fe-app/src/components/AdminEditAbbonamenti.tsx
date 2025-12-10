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
import { IProductStripeSer } from "../models/Cart";
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

const DeleteButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: "red",
  color: "#ffffff",
  fontWeight: 400,
  "&:hover": {
    color: "#ffffff",
    backgroundColor: "red",
  },
}));

const AdminEditAbbonamenti: React.FC = () => {
  const [idSelected, setIdSelected] = useState<string>("");
  const [abbonamentiList, setAbbonamentiList] = useState<any>([]);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(1);
  const [durationInMonths, setDurationInMonths] = useState<number>(0);
  const [productStripeSer, setProductStripeSer] = useState<IProductStripeSer>({
    nome: "",
    prezzo: 0,
    conto_mesi: 0,
  });

  const [message, setMessage] = useState<string>("");
  const [isMessageError, setIsMessageError] = useState<boolean>(false);

  useEffect(() => {
    getAllAbbonamenti()
  }, []);

  const getAllAbbonamenti = ()=>{
    CartService.getAllAbbonamenti()
      .then((response) => {
        setAbbonamentiList(response.data.products);
      })
      .catch((e) => {
      });
  }
  const resetValues = ()=>{
    setIdSelected("");
    setName("")
    getAllAbbonamenti()
  }
  const handleSelectCod = (e: any) => {
    if(e.target.value == "---")
      {
        resetValues()
      }
    let tempAbbonamento = abbonamentiList.find(
      (singleAbbonamento: any) => singleAbbonamento.name === e.target.value
    );

    setName(tempAbbonamento.name);
    setIdSelected(tempAbbonamento.id);
    setPrice(tempAbbonamento.prices[0].unit_amount/100);
    setDurationInMonths(tempAbbonamento.prices[0].interval_count);
  };

  const handleChangeName = (newName: string) => {
    setName(newName);
  };

  const handleChangePrice = (newPrice: number) => {
    setPrice(newPrice);
  };

  const handleChangeDurationInMonths = (newDurationInMonths: number) => {
    setDurationInMonths(newDurationInMonths);
  };

  const handleDelete = () => {
    if (idSelected !== "") {
      CartService.deleteAbbonamento(idSelected)
        .then((response) => {
          setMessage("Abbonamento cancellato con successo");
          setIsMessageError(false);
          resetValues()
        })
        .catch((e) => {
          setMessage("Non è stato possibile eliminare l'abbonamento");
          setIsMessageError(true);
        });
    }
  };
  const handleSave = () => {
    let tempAbbonamento = productStripeSer;
    tempAbbonamento.nome = name;
    tempAbbonamento.prezzo = price;
    tempAbbonamento.conto_mesi = durationInMonths;

    setProductStripeSer(tempAbbonamento);
    if (checkAbbonamentoInfo()) {
      CartService.editAbbonamento(idSelected, productStripeSer)

        .then((response) => {
          setMessage("Abbonamento modificato con successo");
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
        });
        
    }
  };
  const checkAbbonamentoInfo = () => {
    if (name == "") {
      setMessage("è necessario impostare un nome valido");
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
      <h3>Modifica un abbonamento</h3>
      <div className="col-6 m-0 p-4 text-align-left">
        <span className="text-font-big">Seleziona l'abbonamento</span>
        <br />
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={name}
          size="small"
          className="col-4"
          onChange={handleSelectCod}
        >
          <MenuItem value="">
            <em>----</em>
          </MenuItem>
          {abbonamentiList &&
            abbonamentiList.length > 0 &&
            abbonamentiList.map((singleAbbonamento: any) => {
              return (
                <MenuItem value={singleAbbonamento.name}>
                  <em>{singleAbbonamento.name}</em>
                </MenuItem>
              );
            })}
        </Select>
      </div>
      {abbonamentiList && abbonamentiList.length > 0 && idSelected !== "" && (
        <>
          <div className="col-12 row">
            <div className="col-6 m-0 p-4 text-align-left">
              <span className="text-font-big">Nome</span>
              <div className="col-6 m-0 p-0 text-align-left">
                <TextField
                  size="small"
                  onChange={(e) => {
                    handleChangeName(e.target.value);
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
                    handleChangePrice(parseFloat(e.target.value));
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
              <span className="text-font-big">Imposta la durata in mesi</span>
              <br />
              <TextField
                size="small"
                onChange={(e) => {
                  handleChangeDurationInMonths(parseInt(e.target.value));
                }}
                InputProps={{ inputProps: { min: 1 } }}
                name="number"
                type="number"
                value={durationInMonths}
              />
            </div>
          </div>

          <div className="col-12 m-0 p-0 mt-3">
            <ColoredButton
              className="button-size-delete button-font-size-delete m-2"
              onClick={() => {
                handleSave();
              }}
            >
              Salva
            </ColoredButton>
            <DeleteButton
              className="button-size-delete button-font-size-delete m-2"
              onClick={() => {
                handleDelete();
              }}
            >
              Elimina
            </DeleteButton>
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

export default AdminEditAbbonamenti;
