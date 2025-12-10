import { PAGE_TYPE_COACHING } from "../constants/TypeConstants";
import { NavBar } from "../components/NavBar";
import { CoachingInfoCard } from "../components/CoachingInfoCard";
import { Footer } from "../components/Footer";
import { useEffect, useState } from "react";
import { ICoach } from "../models/Coach";
import { CoachCardContacts } from "../components/CoachCardContact";
import { CircularProgress } from "@mui/material";
import CoachService from "../services/CoachService";
import DefaultHeader from "../components/DefaultHeader";
import { Seo } from "../components/Seo";

const CoachingPage: React.FC = () => {
  const [coachList, setCoachList] = useState<any>([]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getCoachList();
  }, []);

  const getCoachList = () => {
    setIsLoading(true);
    CoachService.getAllCoaches()
      .then((response) => {
        setCoachList(response.data.data);
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
      <Seo pageTitle="Schede personalizzate" />
      <DefaultHeader />
      <div style={{ height: "200px" }}></div>

      {isLoading ? (
        <div className="d-flex align-items-center justify-content-center mt-5 padding-page">
          <CircularProgress style={{ color: "#ffffff" }} />
        </div>
      ) : (
        <div className="content-container">
          <div className="col m-auto py-0 row mt-1 justify-content-start padding-page-half">
            {coachList && coachList.length > 0 ? (
              coachList &&
              coachList.map((coach: any, index: number) => (
                coach.top_discipline_name != "nutrizionista" &&
                <div
                  className="col-md-3 col-sm-12 m-0 py-0 mt-4 padding-page-half"
                  key={index}
                >
                  <CoachCardContacts coach={coach}></CoachCardContacts>
                </div>
              ))
            ) : (
              <span>NO VALUES</span>
            )}
          </div>
          <br />
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

export default CoachingPage;
