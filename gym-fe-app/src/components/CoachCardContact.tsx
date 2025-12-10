import { Alert, Avatar, Chip, IconButton, Tooltip } from "@mui/material";
import { isMobile } from "react-device-detect";
import { Link, useNavigate } from "react-router-dom";
import {
  ABOUT_US_PATH,
  PAYMENT_PATH,
  PROFILE_PATH,
  SCHEDA_PERSONALIZZATA_PATH,
  TEAM_PATH,
} from "../constants/PathConstants";
import { ICoach } from "../models/Coach";
import {
  getDisciplinaIcon,
  getDisciplineName,
} from "../services/PackLevelService";
import { LS_USER_TYPE, SUB_TYPES } from "../constants/TypeConstants";
import teamMembers from "../data/team";
import UserService from "../services/UserService";
import { useState } from "react";
import { getStorageValue } from "../services/LocalStorage";

interface ICoachCard {
  coach: ICoach;
}

export const CoachCardContacts: React.FC<ICoachCard> = ({ coach }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const handleSelection = (coach_email: string) => {
    const user = getStorageValue(LS_USER_TYPE) || "";
    if (user === "") {
      navigate(PROFILE_PATH);
    } else if (coach.number_students < coach.max_coaching) {
      UserService.selectCoach(coach_email)
        .then((response) => {
          const subType = SUB_TYPES.coaching_online;
          navigate(PAYMENT_PATH, { state: { subType } });
        })
        .catch((e) => {
          setTimeout(() => {
            setMessage("");
          }, 4000);
        });
    } else {
      setMessage("Coach non selezionable");
      setTimeout(() => {
        setMessage("");
      }, 4000);
    }
  };

  return (
    <div className="col-12 row m-0 p-0 panel little-card text-align-center zoom-in">
      <div
        className="col-12 m-0 row pack-card-body padding-pack-card pointer"
        onClick={() => {
          handleSelection(coach.email);
        }}
      >
        {message !== "" && (
          <Alert className="alert-position-top" severity={"error"}>
            {message}
          </Alert>
        )}
        <div className="no-pm col">
          <img
            src={
              teamMembers.find(
                (dataCoach) =>
                  dataCoach.name === coach.name + " " + coach.surname
              )?.imgSrc || ""
            }
            style={{ borderRadius: 15 }}
          ></img>
          {/* <div className="col-12 no-pm pack-card-preview coach-card-background-mock pointer"></div> */}
        </div>
      </div>
      <div className="col-12 text-align-center pointer">
        <span className="info-card-title">
          {coach.name + " " + coach.surname}
        </span>
      </div>

      <div
        className="col-12 m-0 pb-3 pt-1 padding-page-half background-white pointer"
        onClick={() => {
          handleSelection(coach.email);
        }}
      >
        <div className="col-12 no-pm">
          <div className="p-0 m-0">
            {coach.top_discipline_name !== null && (
              <div className="col navbar-icon my-auto p-0">
                <Chip
                  // avatar={
                  //   <Avatar
                  //     alt={getDisciplineName(coach.top_discipline_name)}
                  //     src={getDisciplinaIcon(
                  //       coach.top_discipline_name,
                  //       coach.top_discipline_name
                  //     )}
                  //   />
                  // }
                  label={
                    "Posti disponibili: " +
                    (coach.max_coaching - coach.number_students)
                  }
                  color="default"
                  style={{ backgroundColor: "#e8f2ff", cursor: "pointer" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-12 m-0 p-0 pt-3 pb-3 info-card-footer">
        {/* <div className="col-12 m-0 p-0 row padding-page">
          <div className="col m-0 text-align-center info-card-sub">
            Telefono : {coach.number}
          </div>
        </div>
        <div className="col-12 m-0 p-0 mt-1 row padding-page">
          <div className="col m-0 text-align-center info-card-contact">
            Mail : {coach.email}
          </div>
        </div> */}
        <Link to={TEAM_PATH + "#"+coach.name+coach.surname} className="fw-500 tran3s">
          Scopri di più
          <i className="fa-solid fa-angle-right" />
        </Link>
      </div>
    </div>
  );
};
