import React, { useEffect, useState } from "react";
import UserService from "../services/UserService";
import { NavBar } from "../components/NavBar";
import { Alert, Button, ButtonProps, TextField, styled } from "@mui/material";
import { IRecivedFeedback } from "../models/User";
import { initialRecivedFeedback } from "../constants/InitialEntities";
import DefaulHeader from "../components/DefaultHeader";
import { Seo } from "../components/Seo";
import { Footer } from "../components/Footer";

const ColoredButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: "#a6ce24",
  color: "#ffffff",
  fontWeight: 400,
  "&:hover": {
    color: "#ffffff",
    backgroundColor: "#192b3f",
  },
}));

const FeedbackPage: React.FC = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const token = urlParams.get("token") ?? "";
  const [message, setMessage] = React.useState<string>("");
  const [isMessageError, setIsMessageError] = React.useState<boolean>(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [feedbackQuestions, setFeedbackQuestions] = useState({
    critici: "Quali sono gli esercizi dove hai riscontrato più difficoltà?",
    forti:
      "Ritieni che l'intensità della scheda sia adeguata? Se la risposta è no, indicaci quali esercizi ritieni poco allenanti",
    ese_differenti: "Ci sono esercizi che vorresti modificare/sostituire?",
    tempistiche_ok: "La durata dell'allenamento è adeguata?",
    altro:
      "Reputi la scheda adatta ai tuoi obiettivi?",
  });

  const [feedbackObject, setFeedbackObject] = useState<IRecivedFeedback>({
    token: "",
    critici: "",
    forti: "",
    ese_differenti: "",
    tempistiche_ok: "",
    altro: "",
  });

  React.useEffect(() => {
    setFeedbackObject({ ...feedbackObject, token: token });
    UserService.verifyFeedbackToken(token)

      .then((response) => {
        setIsTokenValid(true);
      })

      .catch((e) => {
        setIsTokenValid(false);
      });
  }, []);

  const hadleSend = () => {
    if (token !== "") {
      UserService.feedbackWithToken(feedbackObject)
        .then((response) => {
          setIsMessageError(false);
          setMessage("Feedback inviato");
          setTimeout(() => {
            setMessage("");
          }, 4000);
        })
        .catch((e: any) => {
          setIsMessageError(true);
          setMessage(e.response.data.error || "Si è verificato un errore");
          setTimeout(() => {
            setMessage("");
          }, 4000);
          console.log(e);
        });
    }
  };

  return (
    <>
      <Seo pageTitle="Feedback" />
      <DefaulHeader></DefaulHeader>
      <div className="col-12 m-100 pt-200 pb-200">
        {isTokenValid ? (
          <div className="panel big-card col-10 m-auto p-4 relative zoom-in">
            <div className="col-12 p-1 mt-3 text-align-center">
              <div className="col-lg-7 col-md-9 col-sm-10 col-10 m-auto text-align-center info-card-title mt-3 default-info-title">
                {feedbackQuestions.critici}
              </div>
              <div className="col-12 col-md-6 m-auto text-align-center p-2">
                <TextField
                  className="col-11"
                  label={"Dacci il tuo feedback"}
                  size="small"
                  multiline
                  minRows={3}
                  onChange={(event) => {
                    setFeedbackObject({
                      ...feedbackObject,
                      critici: event.target.value,
                    });
                  }}
                  value={feedbackObject.critici}
                />
              </div>

              <div className="col-lg-7 col-md-9 col-sm-10 col-10 m-auto text-align-center info-card-title mt-3 default-info-title">
                {feedbackQuestions.forti}
              </div>
              <div className="col-12 col-md-6 m-auto text-align-center p-2">
                <TextField
                  className="col-11"
                  label={"Dacci il tuo feedback"}
                  size="small"
                  multiline
                  minRows={3}
                  onChange={(event) => {
                    setFeedbackObject({
                      ...feedbackObject,
                      forti: event.target.value,
                    });
                  }}
                  value={feedbackObject.forti}
                />
              </div>

              <div className="col-lg-7 col-md-9 col-sm-10 col-10 m-auto text-align-center info-card-title mt-3 default-info-title">
                {feedbackQuestions.ese_differenti}
              </div>
              <div className="col-12 col-md-6 m-auto text-align-center p-2">
                <TextField
                  className="col-11"
                  label={"Dacci il tuo feedback"}
                  size="small"
                  multiline
                  minRows={3}
                  onChange={(event) => {
                    setFeedbackObject({
                      ...feedbackObject,
                      ese_differenti: event.target.value,
                    });
                  }}
                  value={feedbackObject.ese_differenti}
                />
              </div>

              <div className="col-lg-7 col-md-9 col-sm-10 col-10 m-auto text-align-center info-card-title mt-3 default-info-title">
                {feedbackQuestions.tempistiche_ok}
              </div>
              <div className="col-12 col-md-6 m-auto text-align-center p-2">
                <TextField
                  className="col-11"
                  label={"Dacci il tuo feedback"}
                  size="small"
                  multiline
                  minRows={3}
                  onChange={(event) => {
                    setFeedbackObject({
                      ...feedbackObject,
                      tempistiche_ok: event.target.value,
                    });
                  }}
                  value={feedbackObject.tempistiche_ok}
                />
              </div>

              <div className="col-lg-7 col-md-9 col-sm-10 col-10 m-auto text-align-center info-card-title mt-3 default-info-title">
                {feedbackQuestions.altro}
              </div>
              <div className="col-12 col-md-6 m-auto text-align-center p-2">
                <TextField
                  className="col-11"
                  label={"Dacci il tuo feedback"}
                  size="small"
                  multiline
                  minRows={3}
                  onChange={(event) => {
                    setFeedbackObject({
                      ...feedbackObject,
                      altro: event.target.value,
                    });
                  }}
                  value={feedbackObject.altro}
                />
              </div>
              <ColoredButton
                className="button-size-delete button-font-size-delete"
                onClick={hadleSend}
              >
                Invia
              </ColoredButton>
            </div>
          </div>
        ) : (
          <h2 className="text-align-center">Token non valido</h2>
        )}
      </div>
      <Footer></Footer>
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

export default FeedbackPage;
