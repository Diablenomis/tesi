import {
  LS_USER_TYPE,
  LS_USER,
  PAGE_TYPE_PROFILE,
  PAGE_TYPE_SCHEDA_TUTORIAL,
  LS_IS_ADMIN,
  LS_IS_COACH,
} from "../constants/TypeConstants";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { SetStateAction, useEffect, useState } from "react";
import { getStorageValue } from "../services/LocalStorage";
import { AlertSignCard } from "../components/AlertSignCard";
import { IPackPers, IPackPreview } from "../models/Pack";
import { Button, ButtonProps, CircularProgress, styled } from "@mui/material";
import { PackCard } from "../components/PackCard";
import PackService from "../services/PackService";
import AdminPage from "./AdminPage";
import { DefaultInfoCard } from "../components/DefaultInfoCard";
import {
  PROFILE_PATH,
  SCHEDA_PERSONALIZZATA_PATH,
  SCHEDA_PERS_DETAIL_USER_PATH,
  SCHEDA_TUTORIAL_PATH,
} from "../constants/PathConstants";
import { useNavigate } from "react-router-dom";
import CoachPage from "./CoachPage";
import AdminCreateCodes from "../components/AdminCreateCodes";
import DefaultHeader from "../components/DefaultHeader";
import { Seo } from "../components/Seo";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isCoach, setIsCoach] = useState<boolean>(false);
  const [packList, setPackList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [packPersList, setPackPersList] = useState<any>([]);
  const [packPers, setPackPers] = useState<IPackPers | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUserFromLS();
  }, []);

  useEffect(() => {
    if (user !== "" && !isCoach) {
      getPackPersByUserId();
      getPackListByUserId();
    }
    if (user !== "") {
      getPackPersByUserId();
      getPackListByUserId();
    }
  }, [user, isCoach]);

  const getUserFromLS = () => {
    const user = getStorageValue(LS_USER) || "";
    const userType = getStorageValue(LS_USER_TYPE) || "";
    if(getStorageValue(LS_IS_ADMIN)==="yes")
    {
      setIsAdmin(true)
    }
    else
    {
      setIsAdmin(false)
    }

    if(getStorageValue(LS_IS_COACH) === "yes")
    {
      setIsCoach(true)
    }
    else
    {
      setIsCoach(false)
    }
    setUser(user);
  };

  const getPackListByUserId = () => {
    setIsLoading(true);
    PackService.getPacksPreviewByUser()
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

  const getPackPersByUserId = () => {
    setIsLoading(true);
    PackService.getConnectionPers("")
      .then((response) => {
        setPackPersList(response.data.data);
        setIsLoading(false);
      })
      .catch((e: Error) => {
        setPackPers(null);
        console.error(e);
        setMessage(e.message);
        setIsLoading(false);
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  const openPackPersDetail = (id: string) => {
    navigate(SCHEDA_PERS_DETAIL_USER_PATH + "/" + id);
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
    <div className="schede-tutorial-panel col-12 m-0">
      <Seo pageTitle="Schede personalizzate" />
      <DefaultHeader />
      <div style={{ height: "200px" }}></div>

      {isLoading ? (
        <div className="d-flex align-items-center justify-content-center mt-5 padding-page content-container">
          <CircularProgress style={{ color: "#ffffff" }} />
        </div>
      ) : (
        user !== "" &&
        !isCoach &&
        !isAdmin && (
          <div className="col-12 p-30">
            <h2 className="text-align-center">Il tuo percorso</h2>
            {/* <h4 className="text-align-center">
              I tuoi servizi al {new Date().toLocaleDateString("it-IT")}
            </h4> */}
            <div className="persPack-section mb-50 mx-auto ">
              {packPersList && packPersList.length > 0 ? (
                packPersList.map((scheda: any) => {
                  return (
                    <div
                      className="home-page-intro-card container-scheda-personalizzata"
                      onClick={() => openPackPersDetail(scheda.id)}
                    >
                      <h5 className="color-white">Scheda personalizzata</h5>

                      <span className="color-white">{scheda.name}</span>
                    </div>
                  );
                })
              ) : (
                <div className="col-md-12 col-sm-6  col-12 m-0 py-0 mt-4 padding-page-half">
                  <div className="col-12 no-pm pack-card-title-div d-flex flex-column align-items-center justify-content-center">
                    <span className="font-weight-bald">
                      {"Non hai schede personalizzate"}
                    </span>
                    <ColoredButton
                      onClick={() => {
                        navigate(SCHEDA_PERSONALIZZATA_PATH);
                      }}
                    >
                      Acquista ora
                    </ColoredButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {isCoach && <CoachPage></CoachPage>}
      {isAdmin && (
        <>
          <AdminPage></AdminPage>
          <hr />
        </>
      )}

      {user === "" && (
        <div className="col m-auto py-0 row mt-4 padding-page content-container">
          <AlertSignCard></AlertSignCard>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProfilePage;
