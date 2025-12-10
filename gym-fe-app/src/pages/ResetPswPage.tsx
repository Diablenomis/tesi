import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Button,
  ButtonProps,
  IconButton,
  InputAdornment,
  styled,
  TextField,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HOMEPAGE_PATH } from "../constants/PathConstants";
import UserService from "../services/UserService";

const ResetPswPage: React.FC = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const token = urlParams.get("token");
  const uidb64 = urlParams.get("uidb64");
  const [message, setMessage] = useState<string>("");
  const [isMessageError, setIsMessageError] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isPswShowed, setIsPswShowed] = useState<boolean>(false);
  const [passwordForm, setPasswordForm] = useState<{
    password: string;
    checkpsw: string;
  }>({ password: "", checkpsw: "" });
  const navigate = useNavigate();

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = () => {
    if (token !== null && uidb64 !== null) {
      UserService.verifyTokenResetPsw(uidb64, token)
        .then((response) => {
          setIsValid(true);
        })
        .catch((e: any) => {
          setIsMessageError(true);
          setMessage(e.response.data.error);
          setTimeout(() => {
            setMessage("");
            navigate(HOMEPAGE_PATH);
          }, 4000);
          setIsValid(false);
        });
    } else {
      setIsMessageError(true);
      setMessage("token non presente");
      setTimeout(() => {
        setMessage("");
        navigate(HOMEPAGE_PATH);
      }, 4000);
      setIsValid(false);
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const hadleSave = () => {
    let isOkay = verifyPsw();
    if (isOkay) {
      resetPswComplete();
    }
  };

  const resetPswComplete = () => {
    let dataForm = {
      password: passwordForm.password,
      token,
      uidb64,
    };
    UserService.resetPswComplete(dataForm)
      .then((response) => {
        setIsMessageError(false);
        setMessage("Password salvata");
        setTimeout(() => {
          setMessage("");
          navigate(HOMEPAGE_PATH);
        }, 4000);
      })
      .catch((e: any) => {
        setIsMessageError(true);
        setMessage(e.response.data.error);
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const verifyPsw = () => {
    if (
      passwordForm.password.trim() !== "" &&
      passwordForm.password.length > 5 &&
      passwordForm.checkpsw === passwordForm.password
    ) {
      return true;
    } else {
      return false;
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
    backgroundColor: "#ffffff",
    color: "#000000",
    fontWeight: 400,
    border: "1px solid black",
    "&:hover": {
      color: "#000000",
      backgroundColor: "#dee2e6",
    },
  }));

  return (
    <div className="col m-auto py-0 row mt-4 padding-page">
      <div className="panel col-12 m-0 row padding-page-half justify-content-between pb-3 zoom-in">
        <div className="col-12 m-0 p-0 mt-3 mb-3">
          <span className="text-font-big">Reset Password</span>
        </div>
        <div className="col-6 m-0 p-0">
          <TextField
            className="col-11"
            label="Nuova Password"
            size="small"
            onChange={handleInput}
            name="password"
            type={isPswShowed ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setIsPswShowed(!isPswShowed)}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {isPswShowed ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="col-6 m-0 p-0 text-align-right">
          <TextField
            className="col-11"
            label="Conferma Password"
            size="small"
            onChange={handleInput}
            name="checkpsw"
            type={isPswShowed ? "text" : "password"}
          />
        </div>
        <div className="col-12 mt-4 m-0 p-0 text-align-right">
          <ColoredButtonDelete
            className="button-size button-font-size margin-button-annulla"
            onClick={() => navigate(HOMEPAGE_PATH)}
          >
            Annulla
          </ColoredButtonDelete>
          <ColoredButton
            className="button-size button-font-size"
            onClick={() => hadleSave()}
            disabled={!verifyPsw()}
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

export default ResetPswPage;
