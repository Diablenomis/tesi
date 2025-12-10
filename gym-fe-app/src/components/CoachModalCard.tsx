import { Avatar, Chip, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { initialCoach } from "../constants/InitialEntities";
import { ICoachModalCard } from "../models/ComponentInterface";
import { ILoginUser, ISignUser } from "../models/User";
import { isMobile } from "react-device-detect";
import { ICoach } from "../models/Coach";
import {
  getDisciplinaIcon,
  getDisciplineName,
} from "../services/PackLevelService";

export const CoachModalCard: React.FC<ICoachModalCard> = ({
  show,
  coachEmail,
  onHide,
}) => {
  const [coach, setCoach] = useState<ICoach>(initialCoach);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    getCoachById();
  }, []);

  const getCoachById = () => {
    setIsLoading(true);
    // CoachService.getCoachById()
    //   .then((response: any) => {
    //     setCoach(response.data);
    //     setIsLoading(false);
    //   })
    //   .catch((e: Error) => {
    //     console.log(e);
    //     setMessage(e.message);
    //     setIsLoading(false);
    //     setTimeout(() => {
    //       setMessage("");
    //     }, 4000);
    //   });
    setIsLoading(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered size={isMobile ? "lg" : "sm"}>
      <Modal.Body className="gray-bg">
        <div className="row col-12 text-align-center no-pm gray-bg">
          {isLoading ? (
            <div className="col-12 text-align-center p-5">
              <CircularProgress></CircularProgress>
            </div>
          ) : (
            <div className="col-12 text-align-center p-3">
              <div className="no-pm col">
                <div className="col-12 no-pm pack-card-preview coach-card-background-mock pointer"></div>
              </div>
              <div className="col-12 text-align-center mt-3 m-0 p-0">
                <span className="info-card-title">
                  {"Gino" + " " + "Panino"}
                </span>
              </div>
              <div className="col-12 m-0 p-0 mt-3">
                <div className="p-0 m-0">
                  {coach.top_discipline_name !== null && (
                    <div className="col navbar-icon my-auto p-0">
                      <Chip
                        avatar={
                          <Avatar
                            alt={getDisciplineName(coach.top_discipline_name)}
                            src={getDisciplinaIcon(
                              coach.top_discipline_name,
                              coach.top_discipline_name
                            )}
                          />
                        }
                        label={getDisciplineName(coach.top_discipline_name)}
                        color="info"
                      />
                    </div>
                  )}

                  <div className="p-2 m-0 pb-0">
                    <span className="info-card-contact">Coach Skill</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
