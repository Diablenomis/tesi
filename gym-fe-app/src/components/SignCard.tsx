import {
  Alert,
  Button,
  ButtonProps,
  FormLabel,
  IconButton,
  InputAdornment,
  styled,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { Modal } from "react-bootstrap";
import {
  initialLoginEmail,
  initialLoginUser,
  initialLoginUsername,
  initialSignUser,
} from "../constants/InitialEntities";
import { ISignCard } from "../models/ComponentInterface";
import {
  ILoginEmail,
  ILoginUser,
  ILoginUsername,
  ISignUser,
} from "../models/User";
import { setLoginLS } from "../services/LocalStorage";
import { isMobile } from "react-device-detect";
import MaleIcon from "../assets/images/gender-male-icon.png";
import MaleIconBlack from "../assets/images/gender-male-icon-black.png";
import FemaleIcon from "../assets/images/gender-female-icon.png";
import FemaleIconBlack from "../assets/images/gender-female-icon-black.png";
import NeutralIcon from "../assets/images/gender-neutral-icon.png";
import NeutralIconBlack from "../assets/images/gender-neutral-icon-black.png";
import { getGenderName } from "../services/PackLevelService";
import UserService from "../services/UserService";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";
import { HOMEPAGE_PATH } from "../constants/PathConstants";
import dayjs from "dayjs";

export const SignCard: React.FC<ISignCard> = ({ show, onHide, onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isResetPsw, setIsResetPsw] = useState<boolean>(false);
  const [loginUser, setLoginUser] = useState<ILoginUser>(initialLoginUser);
  const [loginUsername, setLoginUsername] =
    useState<ILoginUsername>(initialLoginUsername);
  const [loginEmail, setLoginEmail] = useState<ILoginEmail>(initialLoginEmail);
  const [signUser, setSignUser] = useState<ISignUser>(initialSignUser);
  const [message, setMessage] = useState<string>("");
  const [isMessageError, setIsMessageError] = useState<boolean>(false);
  const [isPswShowed, setIsPswShowed] = useState<boolean>(false);
  const [nonSenseError, setNonSenseError] = useState<number>(3);
  const [isError, setIsError] = useState<boolean>(false);
  const [formerLength, setFormerLength] = useState<number>(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    let tempObj = {
      password: loginUser.password,
      email: loginUser.email,
    };
    setLoginEmail(tempObj);
    let tempObj2 = {
      password: loginUser.password,
      username: loginUser.username,
    };
    setLoginUsername(tempObj2);
  }, [loginUser]);

  const handleInputLogin = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.name != "email/username") {
      setLoginUser({ ...loginUser, [event.target.name]: event.target.value });
    } else {
      if (event.target.value.match("@")) {
        setLoginUser({
          ...loginUser,
          ["email"]: event.target.value,
          ["username"]: "",
        });
      } else {
        setLoginUser({
          ...loginUser,
          ["username"]: event.target.value,
          ["email"]: "",
        });
      }
    }
  };

  const handleInputSignUp = (event: ChangeEvent<HTMLInputElement>) => {
    setSignUser({ ...signUser, [event.target.name]: event.target.value });
  };

  const handleChangeSex = (sexSelected: string) => {
    setSignUser({ ...signUser, gender: sexSelected });
  };

  // const handleChangeDate = (event: any) => {
  //   const dataFormattata = event.format("YYYY-MM-DD");
  //   setSignUser({ ...signUser, bday: dataFormattata });
  // };

  const handleChangeDate = (event: any) => {
    const inputValue = event.target.value;
    if (inputValue.length === 10) {
      const formattedDate = dayjs(inputValue, "YYYY-MM-DD", true); // Formato rigido
      if (!formattedDate.isValid()) {
        setIsError(true);
      } else {
        setIsError(false);
        setSignUser({ ...signUser, bday: formattedDate.format("YYYY-MM-DD") });
      }
    } else {
      if (
        (inputValue.length === 4 || inputValue.length === 7) &&
        inputValue.length > formerLength
      ) {
        setSignUser({ ...signUser, bday: event.target.value + "-" });
      } else {
        setSignUser({ ...signUser, bday: event.target.value });
      }
      setFormerLength(inputValue.length);
    }
  };

  const handleLoginSubmit = () => {
    let isOkay = verifyLogin();
    if (isOkay) {
      logInUser();
    }
  };

  const handleSignUpSubmit = () => {
    let isOkay = verifySignUp();
    if (isOkay) {
      signUpUser();
    }
  };

  const logInUser = () => {
    if (loginUser.username == "") {
      UserService.logInEmail(loginEmail)
        .then((response) => {
          setLoginLS(response.data, !onAuthenticated);
          onAuthenticated?.(response.data.email);
        })
        .catch((e: any) => {
          setIsMessageError(true);
          if (nonSenseError - 1 === 0) {
            setMessage("Errore, contatta l'assistenza");

            setTimeout(() => {
              setMessage("");
              navigate(HOMEPAGE_PATH + "#contact-us");
            }, 7000);
          } else {
            setMessage(e?.response?.data?.detail);
            setTimeout(() => {
              setMessage("");
            }, 4000);
          }
          setNonSenseError(nonSenseError - 1);
        });
    } else {
      UserService.logInUsername(loginUsername)
        .then((response) => {
          setLoginLS(response.data, !onAuthenticated);
          onAuthenticated?.(response.data.email);
        })
        .catch((e: any) => {
          setIsMessageError(true);
          // TODO Error message to fixs
          setMessage(e?.response.data.detail);
          // console.log(e)
          setTimeout(() => {
            setMessage("");
          }, 4000);
        });
    }
  };

  const signUpUser = () => {
    UserService.signUpUser(signUser)
      .then((response) => {
        // setLoginLS(response.data);
        changeSign();
        setIsMessageError(false);
        setMessage(
          "Riceverai un email per la conferma (controlla anche lo spam)"
        );
        setTimeout(() => {
          setMessage("");
        }, 4000);
      })
      .catch((e: Error) => {
        setIsMessageError(true);
        setMessage("errore");
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const verifyLogin = () => {
    if (loginUser.password.length < 6) {
      setIsMessageError(true);
      setMessage("La password deve essere lunga almeno 6 caratteri");
      setTimeout(() => {
        setMessage("");
      }, 4000);
      return false;
    } else if (
      loginUser.password === "" ||
      // (
      (loginUser.email === "" && loginUser.username === "")
      // && loginUser.username === "")
    ) {
      setIsMessageError(true);
      setMessage("Inserire tutte le credenziali");
      setTimeout(() => {
        setMessage("");
      }, 4000);
      return false;
    } else {
      return true;
    }
  };

  const hasSpecialCharacters = (str: string) => /[^a-zA-Z0-9]/.test(str);

  const verifySignUp = () => {
    checkIfAlreadyExisting();
    if (
      signUser.name === "" ||
      signUser.surname === "" ||
      signUser.bday === "" ||
      signUser.gender === "" ||
      signUser.password === "" ||
      signUser.email === "" ||
      signUser.username === ""
    ) {
      setIsMessageError(true);
      setMessage("Tutti i campi sono obbligatori");
      setTimeout(() => {
        setMessage("");
      }, 4000);
      return false;
    } else if (signUser.password.length < 6) {
      setIsMessageError(true);
      setMessage("La password deve essere lunga almeno 6 caratteri");
      setTimeout(() => {
        setMessage("");
      }, 4000);
      return false;
    } else if (hasSpecialCharacters(signUser.username)) {
      setMessage("Non puoi usare caratteri speciali");
      return false;
    } else {
      return true;
    }
  };

  const checkIfAlreadyExisting = () => {
    UserService.signUpUserVerify(signUser.email, signUser.username)
      .then((response) => {
        return true;
      })
      .catch((e: any) => {
        let error = e?.response.data.data;
        console.log(error);
        setIsMessageError(true);
        setMessage(error);
        setTimeout(() => {
          setMessage("");
        }, 4000);
        return false;
      });
  };

  const changeSign = () => {
    setIsLogin(!isLogin);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleForgotPsw = () => {
    if (loginUser.email.trim() !== "") {
      UserService.resetPsw(loginUser.email)
        .then((response) => {
          setIsMessageError(false);
          setMessage(response.data.success);
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

  const ColoredButton = styled(Button)<ButtonProps>(({ theme }) => ({
    backgroundColor: "#a6ce24",
    color: "#ffffff",
    fontWeight: 400,
    "&:hover": {
      color: "#ffffff",
      backgroundColor: "#192b3f",
    },
  }));

  return (
    <Modal show={show} onHide={onHide} centered size={isLogin ? "sm" : "lg"}>
      <Modal.Body>
        <div className="row col-12 text-align-center m-0 p-0 pb-4">
          <div className="col-12 mt-4 sign-card-img"></div>
          {isResetPsw ? (
            <div className="row col-12 text-align-center no-pm">
              <div className="col-12 mt-2 m-0 p-0">
                <span className="sign-card-title">Reset Password</span>
              </div>
              <div className="col-12 mt-4 m-0 p-0">
                <TextField
                  label="Email"
                  size="small"
                  onChange={handleInputLogin}
                  name="email"
                  className="col-10"
                />
              </div>
              <div className="mt-1">
                <span
                  className="sign-card-sign-label sign-card-sign-label-size"
                  onClick={() => setIsResetPsw(false)}
                >
                  Annulla
                </span>
              </div>
              <div className="col-12 mt-4 m-0 p-0">
                <ColoredButton
                  className="button-size button-font-size"
                  onClick={handleForgotPsw}
                >
                  Invia email
                </ColoredButton>
              </div>
            </div>
          ) : isLogin ? (
            <div className="row col-12 text-align-center no-pm">
              <div className="col-12 mt-2 m-0 p-0">
                <span className="sign-card-title">Accedi</span>
              </div>
              <div className="col-12 mt-4 m-0 p-0">
                <TextField
                  label="Email/Username"
                  size="small"
                  onChange={handleInputLogin}
                  name="email/username"
                  className="col-10"
                />
              </div>
              <div className="col-12 mt-3 m-0 p-0">
                <TextField
                  label="Password"
                  className="col-10"
                  size="small"
                  type={isPswShowed ? "text" : "password"}
                  onChange={handleInputLogin}
                  name="password"
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
              <div className="mt-1">
                <span
                  className="sign-card-sign-label sign-card-sign-label-size fs-6"
                  onClick={() => setIsResetPsw(true)}
                >
                  Hai dimenticato la password?
                </span>
              </div>
              <div className="col-12 mt-4 m-0 p-0">
                <ColoredButton
                  className="button-size button-font-size"
                  onClick={() => handleLoginSubmit()}
                >
                  Continua
                </ColoredButton>
              </div>
              <div className="col-12 mt-1 m-0 p-0">
                <span
                  className="sign-card-sign-label sign-card-sign-label-size"
                  onClick={() => changeSign()}
                >
                  Registrati
                </span>
              </div>
            </div>
          ) : (
            <div className="row col-12 text-align-center no-pm">
              <div className="col-12 mt-2 m-0 p-0">
                <span className="sign-card-title">Registrati</span>
              </div>

              <div className="col-12 row m-0 p-0 mt-4">
                <div className="col-12 no-pm">
                  <span className="sign-card-sign-label-size sign-card-color-field">
                    Informazioni Personali
                  </span>
                </div>
                <div className="col-9 m-auto p-0 mt-1">
                  <hr className="col-12 no-pm" />
                </div>
              </div>
              <div className="col-10 row m-auto p-0 mt-4">
                <div className="col-6 m-0 p-0">
                  <TextField
                    className="col-11"
                    label="Nome"
                    size="small"
                    onChange={handleInputSignUp}
                    name="name"
                  />
                </div>
                <div className="col-6 m-0 p-0">
                  <TextField
                    className="col-11"
                    label="Cognome"
                    size="small"
                    onChange={handleInputSignUp}
                    name="surname"
                  />
                </div>
              </div>
              <div className="col-10 row m-auto p-0 mt-4">
                <div className="col-6 m-0 p-0">
                  {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className="col-11"
                      label="Data di nascita"
                      onChange={handleChangeDate}
                      format={"DD/MM/YYYY"}
                      disableOpenPicker={true}
                    />
                  </LocalizationProvider> */}
                  <TextField
                    label="Data di nascita"
                    value={signUser.bday}
                    onChange={handleChangeDate}
                    placeholder="AAAA/MM/GG"
                    inputMode="numeric" // Forza tastiera numerica su mobile
                    error={isError} // Se la data è invalida, visualizza un errore
                    helperText={isError ? "Data non valida" : ""}
                  />
                </div>
                <div className="col-6 m-0 p-0 text-align-center">
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
                            src={
                              signUser.gender === "M" ? MaleIcon : MaleIconBlack
                            }
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
                            src={
                              signUser.gender === "F"
                                ? FemaleIcon
                                : FemaleIconBlack
                            }
                          />
                        </IconButton>
                      </Tooltip>
                    </div>
                    {/* <div className="col navbar-icon my-auto p-0">
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
                              signUser.gender === "G"
                                ? NeutralIcon
                                : NeutralIconBlack
                            }
                          />
                        </IconButton>
                      </Tooltip>
                    </div> */}
                    <span className="m-auto sign-card-sign-label-size">
                      {getGenderName(signUser.gender)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-10 row m-auto p-0 mt-4">
                <div className="col-12 m-0 p-0">
                  <TextField
                    className="col-11"
                    label="Email"
                    size="small"
                    onChange={handleInputSignUp}
                    name="email"
                    onBlur={checkIfAlreadyExisting}
                  />
                </div>
              </div>

              <div className="col-12 row m-0 p-0 mt-4">
                <div className="col-12 no-pm">
                  <span className="sign-card-sign-label-size sign-card-color-field">
                    Informazioni Utenza
                  </span>
                </div>
                <div className="col-9 m-auto p-0 mt-1">
                  <hr className="col-12 no-pm" />
                </div>
              </div>
              <div className="col-10 row m-auto p-0 mt-4">
                <div className="col-6 m-0 p-0">
                  <TextField
                    className="col-11"
                    label="Username"
                    size="small"
                    onChange={handleInputSignUp}
                    name="username"
                    onBlur={checkIfAlreadyExisting}
                  />
                </div>
                <div className="col-6 m-0 p-0">
                  <TextField
                    className="col-11"
                    label="Password"
                    size="small"
                    onChange={handleInputSignUp}
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
              </div>

              <div className="col-12 mt-4 m-0 p-0">
                <ColoredButton
                  className="button-size button-font-size"
                  onClick={() => handleSignUpSubmit()}
                >
                  Continua
                </ColoredButton>
              </div>
              <div className="col-12 mt-1 m-0 p-0">
                <span
                  className="sign-card-sign-label sign-card-sign-label-size"
                  onClick={() => changeSign()}
                >
                  Accedi
                </span>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      {message !== "" && (
        <Alert
          className="alert-position-top"
          severity={isMessageError ? "error" : "success"}
        >
          {message}
        </Alert>
      )}
    </Modal>
  );
};
