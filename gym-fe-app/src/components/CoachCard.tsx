import { Avatar, Chip } from "@mui/material";
import {
  HOMEPAGE_SOCIAL_INSTAGRAM,
  HOMEPAGE_SOCIAL_INSTAGRAM_URL,
  HOMEPAGE_SOCIAL_TIKTOK,
  HOMEPAGE_SOCIAL_TIKTOK_URL,
  SETTING_BLANK,
  SETTING_FEATURES,
} from "../constants/SocialConstants";
import { ICoach } from "../models/Coach";
import {
  getDisciplinaIcon,
  getDisciplineName,
} from "../services/PackLevelService";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";

interface ICoachCard {
  coach: ICoach;
  isLeft: boolean;
}

export const CoachCard: React.FC<ICoachCard> = ({ coach, isLeft }) => {
  const [dimension, setDimension] = useState<number>(window.innerWidth);
  
  useEffect(() => {
    setDimension(window.innerWidth);
    window.addEventListener("resize", updateDimension);
  }, []);

  const updateDimension = () => {
    setDimension(window.innerWidth);
  };
  
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

  return (
    <>
      {isMobile || dimension < 750 ? (
        <div className="col-12 row m-0 p-0 mb-3 text-align-center box-shadow-hidden justify-content-between">
          <>
            <div className="col-12 m-0 mb-3 row pack-card-body padding-pack-card bg-gray-left">
              <div className="no-pm col">
                <div className="col-12 no-pm coach-card-image coach-card-background-mock"></div>
              </div>
            </div>
            <div className="col-12 text-align-left m-0 panel zoom-in little-card provaboh px-2">
              <div className="col-12 row m-0 p-0 pt-2 panel">
                <div className="col default-info-title text-align-center">
                  <span className="">{coach.name + " " + coach.surname}</span>
                </div>
              </div>
              <div className="col-12 m-0 p-0 pt-2">
                <div className="p-0 m-0">
                  <span className="info-card-contact">{coach.coach_exp}</span>
                </div>
              </div>
              <div className="col pb-3 px-3 row coach-card-social-div flex1 align-self-end align-items-end">
                <div
                  className="homepage-icon-instagram coach-social-icon-size pointer p-0"
                  onClick={() => redirectToSocial(HOMEPAGE_SOCIAL_INSTAGRAM)}
                ></div>
                <div
                  className="homepage-icon-tiktok coach-social-icon-size ml-10 pointer p-0"
                  onClick={() => redirectToSocial(HOMEPAGE_SOCIAL_TIKTOK)}
                ></div>
              </div>
            </div>
          </>
        </div>
      ) : (
        <div className="col-12 row m-0 p-0 text-align-center box-shadow-hidden justify-content-between">
          {isLeft ? (
            <>
              <div className="col-4 m-0 row pack-card-body padding-pack-card bg-gray-left">
                <div className="no-pm col">
                  <div className="col-12 no-pm coach-card-image coach-card-background-mock"></div>
                </div>
              </div>
              <div className="col-7 text-align-left m-0 panel zoom-in little-card provaboh px-2">
                <div className="col-12 row m-0 p-0 pt-3 panel">
                  <div className="col default-info-title text-align-center">
                    <span className="">{coach.name + " " + coach.surname}</span>
                  </div>
                </div>
                <div className="col-12 m-0 p-0 pt-2">
                  <div className="p-0 m-0">
                    <span className="info-card-contact">{coach.coach_exp}</span>
                  </div>
                </div>
                <div className="col pb-3 px-3 row coach-card-social-div flex1 align-self-end align-items-end">
                  <div
                    className="homepage-icon-instagram coach-social-icon-size pointer p-0"
                    onClick={() => redirectToSocial(HOMEPAGE_SOCIAL_INSTAGRAM)}
                  ></div>
                  <div
                    className="homepage-icon-tiktok coach-social-icon-size ml-10 pointer p-0"
                    onClick={() => redirectToSocial(HOMEPAGE_SOCIAL_TIKTOK)}
                  ></div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="col-7 text-align-left m-0 panel zoom-in little-card provaboh px-2">
                <div className="col-12 row m-0 p-0 pt-3">
                  <div className="col default-info-title text-align-center">
                    <span className="">{coach.name + " " + coach.surname}</span>
                  </div>
                  <div className="col-12 m-0 p-0 pt-2">
                    <div className="p-0 m-0">
                      <span className="info-card-contact">
                        {coach.coach_exp}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col pb-3 px-3 row coach-card-social-div flex1 align-self-end align-items-end">
                  <div
                    className="homepage-icon-instagram coach-social-icon-size pointer p-0"
                    onClick={() => redirectToSocial(HOMEPAGE_SOCIAL_INSTAGRAM)}
                  ></div>
                  <div
                    className="homepage-icon-tiktok coach-social-icon-size ml-10 pointer p-0"
                    onClick={() => redirectToSocial(HOMEPAGE_SOCIAL_TIKTOK)}
                  ></div>
                </div>
              </div>
              <div className="col-4 m-0 row pack-card-body padding-pack-card bg-gray-left">
                <div className="no-pm col">
                  <div className="col-12 no-pm coach-card-image coach-card-background-mock"></div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
