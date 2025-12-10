import { useNavigate } from "react-router-dom";
import { IPackCard } from "../models/ComponentInterface";
import { IconButton, Tooltip } from "@mui/material";
import CoachIcon from "../assets/images/coach-icon.png";
import { isMobile } from "react-device-detect";
import { useState } from "react";
import { CoachModalCard } from "./CoachModalCard";
import {
  ABOUT_US_PATH,
  COACHING_PATH,
  SCHEDA_TUTORIAL_DETAIL_PATH,
  SCHEDA_TUTORIAL_DETAIL_USER_PATH,
} from "../constants/PathConstants";
import {
  PAGE_TYPE_PROFILE,
  PAGE_TYPE_SCHEDA_TUTORIAL,
} from "../constants/TypeConstants";

export const PackCard: React.FC<IPackCard> = ({ pack, page }) => {
  const navigate = useNavigate();
  const [isShowCoachModalCard, setIsShowCoachModalCard] =
    useState<boolean>(false);
  const [coachEmail, setCoachEmail] = useState<string>("");

  const openPackDetail = (packTitle: string) => {
    if (page === PAGE_TYPE_PROFILE) {
      navigate(SCHEDA_TUTORIAL_DETAIL_USER_PATH + "/" + packTitle);
    } else if (page === PAGE_TYPE_SCHEDA_TUTORIAL) {
      navigate(SCHEDA_TUTORIAL_DETAIL_PATH + "/" + packTitle);
    }
  };

  const openCoachModal = (email: string) => {
    setIsShowCoachModalCard(true);
    setCoachEmail(email);
  };

  const closeCoachModal = () => {
    setIsShowCoachModalCard(false);
    setCoachEmail("");
  };

  return (
    <div className="panel pack-card no-pm col-12 container-fluid little-card zoom-in">
      <div
        className="col-12 m-0 py-0 row pack-card-header padding-page-little pointer"
        onClick={() => openPackDetail(pack.title)}
      >
        <div className="m-0 col row">
          <div className="col-12 no-pm pack-card-title-div">
            <span className="pack-card-title no-pm">{pack.title}</span>
          </div>
          <div className="col-12 no-pm pack-card-desciption-div">
            <span className="pack-card-description no-pm">
              {pack.title_description}
            </span>
          </div>
        </div>
      </div>
      <div className="col-12 m-0 row pack-card-body padding-pack-card">
        <div className="no-pm col">
          <div
            className="col-12 no-pm pack-card-preview pack-card-background-mock pointer"
            onClick={() => openPackDetail(pack.title)}
          ></div>
        </div>
      </div>
      {pack.coaches && pack.coaches.length > 0 && (
        <div className="col-12 py-0 m-0 mt-1 pb-2 row padding-page-little">
          <div className="col row no-pm">
            {pack.coaches &&
              pack.coaches.map((coach, index) => (
                <div
                  className="col no-pm pack-card-button-coach navbar-icon navbar-icon-center my-auto"
                  key={index}
                >
                  <Tooltip title={coach.name}>
                    <IconButton
                      onClick={() => {
                        // openCoachModal(coach.email);
                        navigate(ABOUT_US_PATH)
                      }}
                      size={isMobile ? "small" : "medium"}
                    >
                      <img
                        className="navbar-img"
                        src={CoachIcon}
                        alt={coach.name}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              ))}
          </div>
        </div>
      )}
      {coachEmail !== "" && (
        <CoachModalCard
          show={isShowCoachModalCard}
          coachEmail={coachEmail}
          onHide={closeCoachModal}
        ></CoachModalCard>
      )}
    </div>
  );
};
