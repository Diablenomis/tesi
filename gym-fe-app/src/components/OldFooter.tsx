import { Button, ButtonProps, styled } from "@mui/material";
import {
  LS_USER,
  PAGE_TYPE_PROFILE,
  PAGE_TYPE_SCHEDA_PERSONALIZZATA,
} from "../constants/TypeConstants";
import {
  HOMEPAGE_SOCIAL_INSTAGRAM,
  HOMEPAGE_SOCIAL_INSTAGRAM_URL,
  HOMEPAGE_SOCIAL_TIKTOK,
  HOMEPAGE_SOCIAL_TIKTOK_URL,
  SETTING_BLANK,
  SETTING_FEATURES,
} from "../constants/SocialConstants";
import { useEffect, useState } from "react";
import { SignCard } from "./SignCard";
import { useNavigate } from "react-router-dom";
import { ABOUT_US_PATH } from "../constants/PathConstants";
import { getStorageValue, setLogoutLS } from "../services/LocalStorage";

interface IFooter {
  page: string;
}

export const Footer: React.FC<IFooter> = ({ page }) => {
  const [isShowSignCard, setIsShowSignCard] = useState<boolean>(false);
  const [user, setUser] = useState<string>("");

  useEffect(() => {
    const user = getStorageValue(LS_USER) || "";
    setUser(user);
  }, []);

  const redirectToSocial = (type: string) => {
    if (type === HOMEPAGE_SOCIAL_INSTAGRAM) {
      window.open(
        HOMEPAGE_SOCIAL_INSTAGRAM_URL,
        SETTING_BLANK,
        SETTING_FEATURES
      );
    } else if (type === HOMEPAGE_SOCIAL_TIKTOK) {
      window.open(HOMEPAGE_SOCIAL_TIKTOK_URL, SETTING_BLANK, SETTING_FEATURES);
    }
  };

  const openLoginModal = () => {
    setIsShowSignCard(true);
  };

  const closeLoginModal = () => {
    setIsShowSignCard(false);
  };

  const logout = () => {
    setLogoutLS();
  };

  const ColoredButton = styled(Button)<ButtonProps>(({ theme }) => ({
    backgroundColor: "#a6ce24",
    color: "#ffffff",
    fontWeight: 400,
    "&:hover": {
      color: "#ffffff",
      backgroundColor: "#192b3f",
    },
    textTransform: "none",
  }));

  return (
    <div className="container-fluid no-pm footer-background footer-position">
      <div className="row m-0 padding-page">
        <div className="col no-pm row footer-social-div">
          <div
            className="homepage-icon-instagram footer-icon-size pointer p-0"
            onClick={() => redirectToSocial(HOMEPAGE_SOCIAL_INSTAGRAM)}
          ></div>
          <div
            className="homepage-icon-tiktok footer-icon-size ml-10 pointer p-0"
            onClick={() => redirectToSocial(HOMEPAGE_SOCIAL_TIKTOK)}
          ></div>
        </div>
        <div className="col m-0"></div>
        <div className="col no-pm footer-buttons-div row justify-content-end">
          {/* <TrasparentButton
            className="button-size button-font-size"
            onClick={() => goToAboutUs()}
          >
            Chi Siamo
          </TrasparentButton> */}
          <ColoredButton
            className="button-size ml-1 button-font-size"
            onClick={() => (user === "" ? openLoginModal() : logout())}
          >
            {user === "" ? "Login" : "Logout"}
          </ColoredButton>
        </div>
      </div>
      <SignCard show={isShowSignCard} onHide={closeLoginModal}></SignCard>
    </div>
  );
};
