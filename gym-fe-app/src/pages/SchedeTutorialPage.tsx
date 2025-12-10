import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import { PAGE_TYPE_SCHEDA_TUTORIAL } from "../constants/TypeConstants";
import { IPackPreview } from "../models/Pack";
import { PackCard } from "../components/PackCard";
import { CircularProgress } from "@mui/material";
import { Footer } from "../components/Footer";
import PackService from "../services/PackService";
import { DefaultInfoCard } from "../components/DefaultInfoCard";
import { SCHEDA_TUTORIAL_PATH } from "../constants/PathConstants";

const SchedeTutorialPage: React.FC = () => {
  const [packList, setPackList] = useState<IPackPreview[]>([]);
  const [discipline, setDiscipline] = useState<string>("all");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getPackList();
  }, []);

  const getPackList = () => {
    setIsLoading(true);
    PackService.getPacksPreview(discipline)
      .then((response) => {
        setPackList(response.data.data);
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

  return (
    <div className="schede-tutorial-panel col-12 m-0">
      <div className="col m-auto py-0 row pt-4 padding-page">
        <NavBar page={PAGE_TYPE_SCHEDA_TUTORIAL}></NavBar>
      </div>

      {isLoading ? (
        <div className="d-flex align-items-center justify-content-center mt-5 padding-page content-container">
          <CircularProgress style={{ color: "#ffffff" }} />
        </div>
      ) : (
        <div className="content-container">
          <div className="col m-auto py-0 row mt-4 padding-page">
            <DefaultInfoCard type={SCHEDA_TUTORIAL_PATH}></DefaultInfoCard>
          </div>
          <div className="col m-auto py-0 row mt-1 padding-page-half content-container">
            {packList.length > 0 ? (
              packList &&
              packList.map((pack, index) => (
                <div
                  className="col-md-4 col-sm-6 col-12 m-0 py-0 mt-4 padding-page-half"
                  key={index}
                >
                  <PackCard
                    pack={pack}
                    page={PAGE_TYPE_SCHEDA_TUTORIAL}
                  ></PackCard>
                </div>
              ))
            ) : (
              <span>NO VALUES</span>
            )}
          </div>
        </div>
      )}
      {!isLoading && (
        <div className="col m-auto py-0 row mt-5">
          <Footer></Footer>
        </div>
      )}
    </div>
  );
};

export default SchedeTutorialPage;
