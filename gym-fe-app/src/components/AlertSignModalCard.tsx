import { Button, ButtonProps, CircularProgress, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { initialCoach } from "../constants/InitialEntities";
import {
  IAlertSignModalCard,
  ICoachModalCard,
} from "../models/ComponentInterface";
import { ILoginUser, ISignUser } from "../models/User";
import { getStorageValue } from "../services/LocalStorage";
import { isMobile } from "react-device-detect";
import { ICoach } from "../models/Coach";
import { SignCard } from "./SignCard";
import { LS_USER } from "../constants/TypeConstants";

export const AlertSignModalCard: React.FC<IAlertSignModalCard> = ({
  show,
  onHide,
}) => {
  const [isShowSignCard, setIsShowSignCard] = useState<boolean>(false);

  const openLoginModal = () => {
    setIsShowSignCard(true);
  };

  const closeLoginModal = () => {
    setIsShowSignCard(false);
    verifyUserLoggedIn();
  };

  const verifyUserLoggedIn = () => {
    const user = getStorageValue(LS_USER);
    if (user !== null && user !== undefined) {
      onHide();
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
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Body>
        <div className="col-12 m-auto p-0 mt-5 alert-sign-card-img padding-page"></div>
        <div className="col-12 m-0 p-0 mt-5 padding-page">
          <div className="col-lg-5 col-md-5 col-sm-6 col-7 m-auto p-0 text-align-center info-card-title">
            Per usufruire di questo servizio è necessario accedere o
            registrarsi.
          </div>
        </div>
        <div className="col-12 m-0 p-0 pt-4 pb-4 text-align-center">
          <ColoredButton
            className="button-size ml-1 button-font-size"
            onClick={() => openLoginModal()}
          >
            Accedi
          </ColoredButton>
        </div>
        <SignCard show={isShowSignCard} onHide={closeLoginModal}></SignCard>
      </Modal.Body>
    </Modal>
  );
};
