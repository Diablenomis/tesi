import styled from "@emotion/styled";
import { Button, ButtonProps } from "react-bootstrap";
import { Seo } from "../components/Seo";
import DefaultHeader from "../components/DefaultHeader";
import Team1 from "../components/Team1";
import TeamList from "../components/TeamList";
import { Footer } from "../components/Footer";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const ColoredButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: "#a6ce24",
  color: "#ffffff",
  fontWeight: 400,
  "&:hover": {
    color: "#ffffff",
    backgroundColor: "#192b3f",
  },
}));

const TeamPage: React.FC = () => {
  const location = useLocation();
  function ScrollToCoach() {
    useEffect(() => {
      setTimeout(() => {
        const element = document.getElementById(
          decodeURIComponent(location.hash).slice(1)
        );
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 50);
      setTimeout(() => {
        const element = document.getElementById(
          decodeURIComponent(location.hash).slice(1)
        );
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 900);
    }, [location]);
    return null;
  }

  return (
    <>
      <ScrollToCoach></ScrollToCoach>
      <Seo pageTitle="About Us" />
      <DefaultHeader />
      <div className="pt-200 pb-50">
        <TeamList></TeamList>
      </div>
      <Footer></Footer>
    </>
  );
};

export default TeamPage;
