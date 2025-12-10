import { useNavigate } from "react-router-dom";
import { IHomePageCard } from "../models/ComponentInterface";
import {
  ABOUT_US_PATH,
  COACHING_PATH,
  PROFILE_PATH,
  SCHEDA_PERSONALIZZATA_PATH,
  SCHEDA_TUTORIAL_PATH,
} from "../constants/PathConstants";
import {
  HOMEPAGE_CARD_TYPE_ABOUT_US,
  HOMEPAGE_CARD_TYPE_COACHING,
  HOMEPAGE_CARD_TYPE_PERSONAL_AREA,
  HOMEPAGE_CARD_TYPE_SCHEDA_PERSONALIZZATA,
  HOMEPAGE_CARD_TYPE_SCHEDA_TUTORIAL,
} from "../constants/TypeConstants";

export const HomePageCard: React.FC<IHomePageCard> = ({ type }) => {
  const navigate = useNavigate();

  const goToPage = () => {
    if (type === HOMEPAGE_CARD_TYPE_SCHEDA_TUTORIAL) {
      navigate(SCHEDA_TUTORIAL_PATH);
    } else if (type === HOMEPAGE_CARD_TYPE_SCHEDA_PERSONALIZZATA) {
      navigate(SCHEDA_PERSONALIZZATA_PATH);
    } else if (type === HOMEPAGE_CARD_TYPE_COACHING) {
      navigate(COACHING_PATH);
    } else if (type === HOMEPAGE_CARD_TYPE_ABOUT_US) {
      navigate(ABOUT_US_PATH);
    } else if (type === HOMEPAGE_CARD_TYPE_PERSONAL_AREA) {
      navigate(PROFILE_PATH);
    }
  };

  return (
    <div
      className={
        type === HOMEPAGE_CARD_TYPE_SCHEDA_TUTORIAL
          ? "m-auto panel little-card homepage-card-size pointer float-left col-11 zoom-in"
          : type === HOMEPAGE_CARD_TYPE_COACHING
          ? "m-auto panel little-card homepage-card-size pointer float-right col-11 zoom-in"
          : "m-auto panel little-card homepage-card-size pointer col-11 zoom-in"
      }
      onClick={() => goToPage()}
    >
      {type === HOMEPAGE_CARD_TYPE_SCHEDA_TUTORIAL && (
        <div className="col-12 m-0 p-0 row homepage-card-size">
          <div className="m-auto p-0 icon-scheda-tutorial"></div>
          <div className="homepage-card-color">
            <div className="col-12 text-align-center">
              <span className="homepage-card-title">Schede</span>
            </div>
            <div className="col-12 text-align-center">
              <span className="homepage-card-title homepage-card-title-top">
                Tutorial
              </span>
            </div>
          </div>
        </div>
      )}
      {type === HOMEPAGE_CARD_TYPE_SCHEDA_PERSONALIZZATA && (
        <div className="col-12 m-0 p-0 row homepage-card-size">
          <div className="m-auto p-0 icon-scheda-personalizzata"></div>
          <div className="homepage-card-color">
            <div className="col-12 text-align-center">
              <span className="homepage-card-title">Schede</span>
            </div>
            <div className="col-12 text-align-center">
              <span className="homepage-card-title homepage-card-title-top">
                Personalizzate
              </span>
            </div>
          </div>
        </div>
      )}
      {type === HOMEPAGE_CARD_TYPE_COACHING && (
        <div className="col-12 m-0 p-0 row homepage-card-size">
          <div className="m-auto p-0 icon-coaching"></div>
          <div className="homepage-card-color">
            <div className="col-12 text-align-center">
              <span className="homepage-card-title">Coaching</span>
            </div>
            <div className="col-12 text-align-center">
              <span className="homepage-card-title homepage-card-title-top">
                Online
              </span>
            </div>
          </div>
        </div>
      )}
      {type === HOMEPAGE_CARD_TYPE_ABOUT_US && (
        <div className="col-12 m-0 p-0 row homepage-card-size">
          <div className="m-auto p-0 icon-about-us"></div>
          <div className="homepage-card-color">
            <div className="col-12 text-align-center">
              <span className="homepage-card-title">About</span>
            </div>
            <div className="col-12 text-align-center">
              <span className="homepage-card-title homepage-card-title-top">
                Us
              </span>
            </div>
          </div>
        </div>
      )}
      {type === HOMEPAGE_CARD_TYPE_PERSONAL_AREA && (
        <div className="col-12 m-0 p-0 row homepage-card-size">
          <div className="m-auto p-0 icon-personal-area"></div>
          <div className="homepage-card-color">
            <div className="col-12 text-align-center">
              <span className="homepage-card-title">Area</span>
            </div>
            <div className="col-12 text-align-center">
              <span className="homepage-card-title homepage-card-title-top">
                Personale
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
