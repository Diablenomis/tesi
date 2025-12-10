import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import {
  formQuestions,
  LS_USER,
  PAGE_TYPE_SCHEDA_PERSONALIZZATA,
  SUB_TYPES,
} from "../constants/TypeConstants";
import { Footer } from "../components/Footer";
import { getStorageValue } from "../services/LocalStorage";
import { AlertSignCard } from "../components/AlertSignCard";
import { DefaultInfoCard } from "../components/DefaultInfoCard";
import {
  PAYMENT_PATH,
  SCHEDA_PERSONALIZZATA_PATH,
} from "../constants/PathConstants";
import { FormUserCard } from "../components/FormUserCard";
import { Alert, Pagination } from "@mui/material";
import PackService from "../services/PackService";
import { useLocation, useNavigate } from "react-router-dom";
import DefaultHeader from "../components/DefaultHeader";
import { Seo } from "../components/Seo";
import Hero from "../components/Hero_homePage";

const SchedaPersonalizzataPage: React.FC = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [isMessageError, setIsMessageError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userForm, setUserForm] = useState<
    { question: string; answer: string; order: number }[]
  >([]);
  const [step, setStep] = useState<number>(1);
  const location = useLocation();
  const subType =
    (location.state as { subType?: string })?.subType ??
    SUB_TYPES.scheda_personalizzata;

  useEffect(() => {
    getUserFromLS();
    buildUserForm();
  }, []);

  const getUserFromLS = () => {
    setIsUserLoggedIn(false);
    const user = getStorageValue(LS_USER);
    user ? setIsUserLoggedIn(true) : setIsUserLoggedIn(false);
  };

  const buildUserForm = () => {
    let userFormList: { question: string; answer: string; order: number }[] =
      [];
    formQuestions.forEach((qa, index) => {
      // if (index === 15) {
      //   userFormList.push({ question: qa.question, answer: "30-60" });
      // } else {
      userFormList.push({ question: qa.question, answer: "", order: qa.order });
      // }
    });
    setUserForm(userFormList);
  };

  const handleSelectOption = (question: string, answer: string) => {
    let userFormUpdated: { question: string; answer: string; order: number }[] =
      JSON.parse(JSON.stringify(userForm));
    userFormUpdated.forEach((element) => {
      if (element.question === question) {
        element.answer = answer;
      }
    });
    setUserForm(userFormUpdated);
  };

  const handleChangeStep = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setStep(value);
  };

  const navigate = useNavigate();

  const sendForm = () => {
    let isOkay = verifyUserForm();
    if (isOkay) {
      userForm.sort((a, b) => a.order - b.order);

      console.log(userForm);
      PackService.sendSurvey(userForm)
        .then((response) => {
          setIsMessageError(false);
          setMessage("Form inviata");
          navigate(PAYMENT_PATH, { state: { subType } });
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

  const verifyUserForm = () => {
    let isOkay = true;
    if (
      (userForm[9].answer === "si" &&
        (userForm[11].answer === "" || userForm[13].answer === "")) ||
      (userForm[18].answer.split(",").length > 1 && userForm[45].answer === "")
    ) {
      return false;
    } else if (
      userForm[9].answer === "no" &&
      (userForm[10].answer === "" ||
        (userForm[10].answer === "si" && userForm[11].answer === ""))
    ) {
      return false;
    }
    userForm.forEach((quest, index) => {
      if (formQuestions[index].obbligatory && quest.answer === "") {
        setIsMessageError(true);
        setMessage("Domanda '" + formQuestions[index].question + "' non data");
        setTimeout(() => {
          setMessage("");
        }, 4000);
        isOkay = false;
        return;
      }
    });
    return isOkay;
  };

  return (
    <>
      <Seo pageTitle="Schede personalizzate" />
      <DefaultHeader />
      <div style={{ height: "200px" }}></div>
      <div className="content-container">
        {isUserLoggedIn ? (
          <div className="col m-auto py-0 row mt-4 padding-page">
            <FormUserCard
              step={step}
              userForm={userForm}
              handleSelectOption={handleSelectOption}
              handleChangeStep={handleChangeStep}
              sendForm={sendForm}
            ></FormUserCard>
          </div>
        ) : (
          <div className="col m-auto py-0 row mt-4 padding-page">
            <AlertSignCard></AlertSignCard>
          </div>
        )}
      </div>
      <div className="col m-auto py-0 row mt-5">
        <Footer></Footer>
      </div>
      {message !== "" && (
        <Alert
          className="alert-position-top"
          severity={isMessageError ? "error" : "success"}
        >
          {message}
        </Alert>
      )}
    </>
  );
};

export default SchedaPersonalizzataPage;
