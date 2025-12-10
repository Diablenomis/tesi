import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import { PAGE_TYPE_SCHEDA_TUTORIAL_DETAIL } from "../constants/TypeConstants";
import { IPackDetail, IPackLevel } from "../models/Pack";
import { CircularProgress } from "@mui/material";
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
import { PackCardDetailPrice } from "../components/PackCardDetailPrice";
import { isMobile } from "react-device-detect";

const SchedeTutorialDetailPage: React.FC = () => {
  const { packTitle } = useParams();
  const [packDetail, setPackDetail] = useState<IPackDetail>(initialPackDetail);
  const [packLevelSelected, setPackLevelSelected] =
    useState<IPackLevel>(initialPackLevel);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [levelSelected, setLevelSelected] = useState<string>("");

  useEffect(() => {
    getPackDetail();
  }, []);

  useEffect(() => {
    setPackDetailPanels();
  }, [levelSelected]);

  const getPackDetail = () => {
    setIsLoading(true);
    PackService.getPackDetail(packTitle !== undefined ? packTitle : "")
      .then((response) => {
        setPackDetail(response.data.data);
        changeLevel(response.data.data.levels[0].level);
        setIsLoading(false);
      })
      .catch((e: Error) => {
        console.error(e);
        setMessage(e.message);
        setIsLoading(false);
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const setPackDetailPanels = () => {
    packDetail.levels.forEach((level) => {
      if (level.level === levelSelected) {
        setPackLevelSelected(level);
      }
    });
  };

  const changeLevel = (levelSelected: string) => {
    setLevelSelected(levelSelected);
  };

  return (
    <div className="schede-tutorial-panel col-12 m-0">
      <div className="col m-auto py-0 row pt-4 padding-page">
        <NavBar page={PAGE_TYPE_SCHEDA_TUTORIAL_DETAIL}></NavBar>
      </div>

      {isLoading ? (
        <div className="d-flex align-items-center justify-content-center mt-5 padding-page content-container">
          <CircularProgress style={{ color: "#ffffff" }} />
        </div>
      ) : (
        <div className="content-container container-fluid no-pm">
          <div className="col m-auto py-0 row mt-4 padding-page">
            <PackCardDetailMain pack={packDetail}></PackCardDetailMain>
          </div>
          <div className="row col-12 m-0 padding-page-half">
            <div className={isMobile ? "col-12 m-0 py-0 mt-4 padding-page-half" : "col m-0 py-0 mt-4 padding-page-half"}>
              <PackCardDetailLevels
                pack={packDetail}
                levelSelected={levelSelected}
                price={packLevelSelected.price}
                changeLevel={changeLevel}
                page={PAGE_TYPE_SCHEDA_TUTORIAL_DETAIL}
              ></PackCardDetailLevels>
            </div>
            <div className="col m-0 py-0 mt-4 padding-page-half price-size">
              <PackCardDetailPrice
                pack={packDetail}
                packLevel={packLevelSelected}
                price={packLevelSelected.price}
              ></PackCardDetailPrice>
            </div>
          </div>

          <div className="row col-12 m-0 padding-page-half">
            <div className="col-lg-6 col-md-12 col-sm-12 m-0 py-0 mt-4 padding-page-half">
              <PackCardDetailRequirements
                packLevel={packLevelSelected}
              ></PackCardDetailRequirements>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 m-0 py-0 mt-4 padding-page-half">
              <PackCardDetailGoals
                packLevel={packLevelSelected}
              ></PackCardDetailGoals>
            </div>
          </div>

          <div className="row col-12 m-0 padding-page-half">
            <div className="col-lg-6 col-md-12 col-sm-12 m-0 py-0 mt-4 padding-page-half">
              <PackCardDetailUtils
                packLevel={packLevelSelected}
              ></PackCardDetailUtils>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 m-0 p-0 row">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 m-0 py-0 mt-4 padding-page-half">
                <PackCardDetailFrequency
                  packLevel={packLevelSelected}
                ></PackCardDetailFrequency>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 m-0 py-0 mt-4 padding-page-half">
                <PackCardDetailDuration
                  packLevel={packLevelSelected}
                ></PackCardDetailDuration>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="col m-auto py-0 row mt-5">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default SchedeTutorialDetailPage;
