import { ICartPackCard } from "../models/ComponentInterface";
import { IconButton, Tooltip } from "@mui/material";
import CoachIcon from "../assets/images/coach-icon.png";
import { isMobile } from "react-device-detect";
import { RemoveCircleOutline } from "@mui/icons-material";
import { useState } from "react";
import { CoachModalCard } from "./CoachModalCard";

export const CartPackCard: React.FC<ICartPackCard> = ({ pack }) => {
  const [isShowCoachModalCard, setIsShowCoachModalCard] =
    useState<boolean>(false);
  const [coachEmail, setCoachEmail] = useState<string>("");

  const openPackDetail = () => {};
  const openCoachModal = (email: string) => {
    setIsShowCoachModalCard(true);
    setCoachEmail(email);
  };
  const closeCoachModal = () => {
    setIsShowCoachModalCard(false);
    setCoachEmail("");
  };

  return (
    <div className="no-pm col-12 container-fluid cart-pack-card">
      <div className="col-12 row no-pm">
        <div className="col cart-pack-img-flex cart-pack-padding">
          <div className="cart-pack-img"></div>
        </div>
        <div className="col m-0 row cart-pack-padding">
          <div
            className="cart-pack-card-header row col-12 no-pm pointer"
            onClick={() => {
              openPackDetail();
            }}
          >
            <div className="col m-auto pack-card-level-icon-size pack-card-petto-icon footer-icon-size"></div>
            <div className="m-0 col row">
              <div className="col-12 no-pm cart-pack-card-title-div">
                <span className="pack-card-title no-pm">{pack.title}</span>
              </div>
            </div>
          </div>
          <div className="col-12 p-0 m-0 mt-1">
            <hr className="col-12 no-pm" />
          </div>

          <div className="col-12 m-0 p-0 mt-2 row">
            <div className="col row no-pm">
              <span className="pack-card-footer-title no-pm">Coach</span>
              {pack.coaches &&
                pack.coaches.map((coach, index) => (
                  <div
                    className="col no-pm pack-card-button-coach navbar-icon navbar-icon-center my-auto"
                    key={index}
                  >
                    <Tooltip title={coach.name}>
                      <IconButton
                        onClick={() => {
                          openCoachModal(coach.email);
                        }}
                        size={isMobile ? "small" : "medium"}
                      >
                        <img className="navbar-img" src={CoachIcon} />
                      </IconButton>
                    </Tooltip>
                  </div>
                ))}
            </div>

            <div className="col row no-pm pack-card-footer-price-div">
              <span className="col-12 pack-card-footer-title no-pm text-align-right">
                Prezzo
              </span>
              <span className="col-12 pack-card-footer-title no-pm text-align-right">
                {pack.price} €
              </span>
            </div>
          </div>
        </div>
        <div className="col m-auto p-0 cart-pack-card-icon-minus">
          <IconButton size={isMobile ? "small" : "medium"}>
            <RemoveCircleOutline color="primary" />
          </IconButton>
        </div>
      </div>
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
