import { Button, ButtonProps, styled } from "@mui/material";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { SignCard } from "./SignCard";

export const AlertSignCard: React.FC = () => {
  const [isShowSignCard, setIsShowSignCard] = useState<boolean>(false);

  const openLoginModal = () => {
    setIsShowSignCard(true);
  };

  const closeLoginModal = () => {
    setIsShowSignCard(false);
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
    <div className="panel big-card col-12 m-0 p-0 relative">
      <div className="col-12 m-auto p-0 mt-5 alert-sign-card-img padding-page"></div>
      <div className="col-12 m-0 p-0 mt-5 padding-page">
        <div className="col-lg-5 col-md-5 col-sm-6 col-7 m-auto p-0 text-align-center info-card-title">
          Per usufruire di questo servizio è necessario accedere o registrarsi.
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
    </div>
  );
};
