import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import {
  LS_USER,
  LS_USER_TYPE,
  PAGE_TYPE_SCHEDA_TUTORIAL_DETAIL,
  PAGE_TYPE_SCHEDA_TUTORIAL_DETAIL_USER,
} from "../constants/TypeConstants";
import { IPackDetail, IPackLevel, IPackLevelUser } from "../models/Pack";
import { Alert, CircularProgress } from "@mui/material";
import { Footer } from "../components/Footer";
import {
  initialPackDetail,
  initialPackLevel,
} from "../constants/InitialEntities";
import { PackCardDetailMain } from "../components/PackCardDetailMain";
import { PackCardDetailLevels } from "../components/PackCardDetailLevels";
import { PackCardDetailRequirements } from "../components/PackCardDetailRequirements";
import { PackCardDetailGoals } from "../components/PackCardDetailGoals";
import { PackCardDetailFrequency } from "../components/PackCardDetailFrequency";
import { PackCardDetailDuration } from "../components/PackCardDetailDuration";
import { PackCardDetailUtils } from "../components/PackCardDetailUtils";
import PackService from "../services/PackService";
import { useParams } from "react-router-dom";
import { PackCardDetailDescription } from "../components/PackCardDetailDescription";
import { getStorageValue } from "../services/LocalStorage";
import { isMobile } from "react-device-detect";
import { PackCardDetailWeeks } from "../components/PackCardDetailWeeks";

const SchedeTutorialDetailUserPage: React.FC = () => {
  const { packTitle } = useParams();
  const [user, setUser] = useState<string>("");
  const [isUserAdminLoggedIn, setIsUserAdminLoggedIn] =
    useState<boolean>(false);
  const [packDetail, setPackDetail] = useState<any>(null);
  const [levelSelected, setLevelSelected] = useState<string>("");
  const [idLevelSelected, setIdLevelSelected] = useState<number>(0);
  const [packLevelSelected, setPackLevelSelected] = useState<IPackLevel>();

  const [message, setMessage] = useState<string>("");
  const [isMessageError, setIsMessageError] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getUserFromLS();
  }, []);

  useEffect(() => {
    // if (user !== "" && !isUserAdminLoggedIn) {
      getPackListByUserId();
    // }
  }, [user, isUserAdminLoggedIn]);

  useEffect(() => {
    if (packDetail && idLevelSelected !== 0) {
      getPackDetailByLevelId();
    }
  }, [packDetail, idLevelSelected]);

  useEffect(() => {
    if (packLevelSelected) {
      setIsLoading(false);
    }
  }, [packLevelSelected]);

  const getUserFromLS = () => {
    const user = getStorageValue(LS_USER) || "";
    const userType = getStorageValue(LS_USER_TYPE) || "";
    setIsUserAdminLoggedIn(userType === "coach");
    setUser(user);
  };

  const getPackListByUserId = () => {
    PackService.getPacksPreviewByUser()
      .then((response) => {
        if (response.data.data && Array.isArray(response.data.data)) {
          response.data.data.forEach((element: any) => {
            if (element.title === packTitle) {
              setPackDetail(element);
              setIdLevelSelected(element.levels[0].id);
              setLevelSelected(element.levels[0].level);
            }
          });
        }
      })
      .catch((e: Error) => {
        console.error(e);
        setMessage(e.message);
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const getPackDetailByLevelId = () => {
    setIsLoading(true);
    PackService.getPackDetailByIdLevel(idLevelSelected)
      .then((response) => {
        setIsMessageError(false)
        setMessage("Selezionato livello scheda "+ levelSelected);
        setTimeout(() => {
          setMessage("");
        }, 4000);
        setPackLevelSelected(response.data.data);
      })
      .catch((e: Error) => {
        // setPackLevelSelected(undefined);
        setIsMessageError(true)
        setMessage("Livello scheda "+ levelSelected+" non acquistato");
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const changeLevel = (levelSelected: string) => {  
    if (packDetail) {
      packDetail.levels.forEach((level: any) => {
        if (level.level === levelSelected) {
          setIdLevelSelected(level.id);
          setLevelSelected(levelSelected);
        }
      });
    }
    
  };

  return (
    <div className="schede-tutorial-panel col-12 m-0">
      <div className="col m-auto py-0 row pt-4 padding-page">
        <NavBar page={PAGE_TYPE_SCHEDA_TUTORIAL_DETAIL}></NavBar>
      </div>

      {packDetail === null ? (
        <div className="d-flex align-items-center justify-content-center mt-5 padding-page content-container">
          <CircularProgress style={{ color: "#ffffff" }} />
        </div>
      ) : (
        <div className="content-container container-fluid no-pm">
          <div className="col m-auto py-0 row mt-4 padding-page">
            <PackCardDetailMain pack={packDetail}></PackCardDetailMain>
          </div>
          <div className="row col-12 m-0 padding-page-half">
            <div
              className={
                isMobile
                  ? "col-12 m-0 py-0 mt-4 padding-page-half"
                  : "col m-0 py-0 mt-4 padding-page-half"
              }
            >
              <PackCardDetailLevels
                pack={packDetail}
                levelSelected={levelSelected}
                price={packLevelSelected?.price!}
                changeLevel={changeLevel}
                page={PAGE_TYPE_SCHEDA_TUTORIAL_DETAIL}
              ></PackCardDetailLevels>
            </div>
          </div>
          {isLoading && packLevelSelected === undefined ? (
            <div className="d-flex align-items-center justify-content-center mt-5 padding-page content-container">
              <CircularProgress style={{ color: "#ffffff" }} />
            </div>
          ) : (
            <>
              <div className="row col-12 m-0 padding-page-half">
                <div className="col-lg-8 col-md-12 col-sm-12 m-0 py-0 mt-4 padding-page-half">
                  <PackCardDetailWeeks
                    packLevel={packLevelSelected!}
                  ></PackCardDetailWeeks>
                </div>

                <div className="col-lg-4 col-md-12 col-sm-12 row no-pm">
                  <div className="col-lg-12 col-md-6 col-sm-6 m-0 py-0 mt-4 padding-page-half">
                    <PackCardDetailRequirements
                      packLevel={packLevelSelected!}
                      page={PAGE_TYPE_SCHEDA_TUTORIAL_DETAIL_USER}
                    ></PackCardDetailRequirements>
                  </div>
                  <div className="col-lg-12 col-md-6 col-sm-6 m-0 py-0 mt-4 padding-page-half">
                    <PackCardDetailGoals
                      packLevel={packLevelSelected!}
                      page={PAGE_TYPE_SCHEDA_TUTORIAL_DETAIL_USER}
                    ></PackCardDetailGoals>
                  </div>

                  <div className="col-lg-12 col-md-4 col-sm-12 m-0 py-0 mt-4 padding-page-half">
                    <PackCardDetailUtils
                      packLevel={packLevelSelected!}
                    ></PackCardDetailUtils>
                  </div>
                  <div className="col-lg-12 col-md-8 col-sm-12 m-0 p-0 row">
                    <div className="col-lg-12 col-md-6 col-sm-6 col-12 m-0 py-0 mt-4 padding-page-half">
                      <PackCardDetailFrequency
                        packLevel={packLevelSelected!}
                      ></PackCardDetailFrequency>
                    </div>
                    <div className="col-lg-12 col-md-6 col-sm-6 col-12 m-0 py-0 mt-4 padding-page-half">
                      <PackCardDetailDuration
                        packLevel={packLevelSelected!}
                      ></PackCardDetailDuration>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      <div className="col m-auto py-0 row mt-5">
        <Footer></Footer>
      </div>
      {message !== "" && (
        <Alert
          className="alert-position-top"
          severity={isMessageError ? "error" : "success"}
        >
          {message}
        </Alert>
      )}
    </div>
  );
};

export default SchedeTutorialDetailUserPage;
