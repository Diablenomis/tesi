import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Aos from "aos";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.scss";
import "aos/dist/aos.css";
import {
  ABOUT_US_PATH,
  CHECK_EMAIL_PATH,
  FEEDBACK_PATH,
  COACHING_PATH,
  HOMEPAGE_PATH,
  PROFILE_PATH,
  RESET_PSW_PATH,
  SCHEDA_PERSONALIZZATA_PATH,
  SCHEDA_PERS_DETAIL_USER_PATH,
  SCHEDA_TUTORIAL_DETAIL_PATH,
  SCHEDA_TUTORIAL_DETAIL_USER_PATH,
  SCHEDA_TUTORIAL_PATH,
  SERVICES_DETAILS_PATH,
  PAYMENT_PATH,
  TEAM_PATH,
  PAYMENT_SUCCEEDED_PATH,
  PAYMENT_FAILED_PATH,
} from "./constants/PathConstants";
import CheckEmailPage from "./pages/CheckEmailPage";
import CoachingPage from "./pages/CoachingPage";
import ProfilePage from "./pages/ProfilePage";
import ResetPswPage from "./pages/ResetPswPage";
import SchedaPersDetailUserPage from "./pages/SchedaPersDetailUserPage";
import SchedaPersonalizzataPage from "./pages/SchedaPersonalizzataPage";
import SchedeTutorialDetailPage from "./pages/SchedaTutorialDetailPage";
import SchedeTutorialDetailUserPage from "./pages/SchedaTutorialDetailUserPage";
import SchedeTutorialPage from "./pages/SchedeTutorialPage";
import FeedbackPage from "./pages/FeedbackPage";
import HomePage from "./pages/HomePage";
import { ServiceDetailsPage } from "./pages/ServiceDetailsPage";
import { AboutUsPage } from "./pages/AboutUsPage";
import ScrollTopBehaviour from "./components/common/ScrollTopBehavier";
import { useEffect } from "react";
import ScrollToTop from "./components/ScrollToTop";
import PaymentPage from "./pages/PaymentPage";
import TeamPage from "./pages/TeamPage";
import PaymentSucceededPage from "./pages/PaymentSucceededPage";
import PaymentFailedPage from "./pages/PaymentFailedPage";

function App() {
  useEffect(() => {
    Aos.init({
      duration: 1200,
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={<AboutUsPage></AboutUsPage>}
          path={ABOUT_US_PATH}
        ></Route>
         <Route
          element={<TeamPage></TeamPage>}
          path={TEAM_PATH}
        ></Route>
        <Route
          element={<ServiceDetailsPage></ServiceDetailsPage>}
          path={SERVICES_DETAILS_PATH}
        ></Route>
        <Route
          element={<PaymentPage></PaymentPage>}
          path={PAYMENT_PATH}
        ></Route>
        <Route
          element={<PaymentSucceededPage></PaymentSucceededPage>}
          path={PAYMENT_SUCCEEDED_PATH}
        ></Route>
        <Route
          element={<PaymentFailedPage></PaymentFailedPage>}
          path={PAYMENT_FAILED_PATH}
        ></Route>
        <Route
          element={<SchedeTutorialPage></SchedeTutorialPage>}
          path={SCHEDA_TUTORIAL_PATH}
        ></Route>
        <Route
          element={<SchedeTutorialDetailPage></SchedeTutorialDetailPage>}
          path={SCHEDA_TUTORIAL_DETAIL_PATH + "/:packTitle"}
        ></Route>
        <Route
          element={
            <SchedeTutorialDetailUserPage></SchedeTutorialDetailUserPage>
          }
          path={SCHEDA_TUTORIAL_DETAIL_USER_PATH + "/:packTitle"}
        ></Route>
        <Route
          element={<SchedaPersDetailUserPage></SchedaPersDetailUserPage>}
          path={SCHEDA_PERS_DETAIL_USER_PATH+ "/:packPersId"}
        ></Route>
        <Route
          element={<SchedaPersonalizzataPage></SchedaPersonalizzataPage>}
          path={SCHEDA_PERSONALIZZATA_PATH}
        ></Route>
        <Route
          element={<CoachingPage></CoachingPage>}
          path={COACHING_PATH}
        ></Route>
        <Route
          element={<ProfilePage></ProfilePage>}
          path={PROFILE_PATH}
        ></Route>
        <Route
          element={<CheckEmailPage></CheckEmailPage>}
          path={CHECK_EMAIL_PATH}
        ></Route>
        <Route
          element={<FeedbackPage></FeedbackPage>}
          path={FEEDBACK_PATH}
        ></Route>
        <Route
          element={<ResetPswPage></ResetPswPage>}
          path={RESET_PSW_PATH}
        ></Route>
        <Route element={<HomePage></HomePage>} path={HOMEPAGE_PATH}></Route>
        <Route
          path="*"
          element={<Navigate to={HOMEPAGE_PATH} replace />}
        ></Route>
      </Routes>
      <ScrollTopBehaviour />

      <ScrollToTop />
    </BrowserRouter>
  );
}

export default App;
