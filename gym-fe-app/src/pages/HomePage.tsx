import { Link, useLocation } from "react-router-dom";
import { Seo } from "../components/Seo";
import DefaulHeader from "../components/DefaultHeader";
import ContactForm from "../components/ContactForm";
import FancyFeatures from "../components/FancyFeatures";
import VideoBlock from "../components/VideoBlock";
import Team1 from "../components/Team1";
import Faq from "../components/Faq";
import HowCanHelpBlock from "../components/HowCanHelpBlock";
import Hero from "../components/Hero_homePage";
import { Footer } from "../components/Footer";
import { SERVICES_DETAILS_PATH, TEAM_PATH } from "../constants/PathConstants";
import { HOMEPAGE_SOCIAL_INSTAGRAM_URL } from "../constants/SocialConstants";
import { useEffect } from "react";

const HomePage = () => {
  function ScrollToContactUs() {
    const location = useLocation();

    useEffect(() => {
      setTimeout(() => {
        if (location.hash === "#contact-us") {
          const element = document.getElementById("contact-us");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }
        if (location.hash === "#login-logout") {
          const element = document.getElementById("login-logout");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 20);
    }, [location]);
    return null;
  }

  return (
    <>
      <ScrollToContactUs />
      <Seo pageTitle="Home" />

      <DefaulHeader />
      <Hero />
      <FancyFeatures />
      {/*<VideoBlock />*/}
      <HowCanHelpBlock />

      <div className="fancy-feature-thirtyEight mt-180 lg-mt-120">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="block-style-seven" data-aos="fade-right">
                <div className="title-style-six">
                  <div className="sc-title-two text-uppercase">Services</div>
                  <h3 className="">SCEGLI IL PERCORSO PIU' ADATTO A TE</h3>
                </div>
                {/* /.title-style-ten */}
                <p className="fs-20 pt-10 pb-30 lg-pb-20">
                  Con FitNexus potrai avviare il percorso per il raggiungimento dei
                  tuoi obiettivi, attraverso la scelta di uno dei due servizi.
                </p>
              </div>
            </div>
            <div className="col-lg-6 ms-auto mt-30" data-aos="fade-left">
              <Faq />
            </div>
          </div>
        </div>
      </div>

      <div className="team-section-two position-relative pt-200 lg-pt-120">
        <div className="container">
          <div className="wrapper position-relative">
            <div className="row align-items-center">
              <div className="col-lg-5" data-aos="fade-right">
                <div className="title-style-six text-center text-lg-start pb-40 lg-pb-20 md-pb-10">
                  <div className="title-style-five mb-65 lg-mb-40">
                    <div className="sc-title-two fst-italic position-relative">
                      Our Team
                    </div>
                  </div>
                  <h3>IL TEAM DI FIT-NEXUS</h3>
                </div>
              </div>
            </div>

            <div className="row">
              <Team1 />
            </div>
            <p
              className="cr-text text-center text-lg tx-dark mt-75 lg-mt-50"
              data-aos="fade-up"
            >
              Seguici sui nostri social
              <br></br>{" "}
              <a
                href={HOMEPAGE_SOCIAL_INSTAGRAM_URL}
                target="_blank"
                style={{ color: "#a6ce24" }}
              >
                {" "}
                <i className="bi bi-instagram" /> @fitnexus{" "}
              </a>
            </p>
            <div className="text-center md-mt-20">
              <Link
                to={TEAM_PATH}
                className="btn-twentyTwo fw-500 "
                data-aos="fade-left"
                style={{ borderRadius: "35px" }}
              >
                Il team
              </Link>
            </div>
          </div>
        </div>

        <img
          src="../images/shape/shape_172.svg"
          alt="shape"
          className="lazy-img shapes shape-one d-none d-xl-inline-block"
        />
      </div>

      <div
        className="fancy-short-banner-thirteen pt-170 pb-170 mt-130 lg-mt-100 lg-pt-80 lg-pb-80 "
        id="contact-us"
      >
        <div className="container">
          <div className="bg-wrapper zn2 bg-white position-relative">
            <div className="row">
              <div className="col-xl-11 m-auto">
                <div className="row align-items-center">
                  <div className="col-lg-6 ms-auto order-lg-last ">
                    <div className="text-wrapper">
                      <div
                        className="title-style-one"
                        style={{ position: "relative", bottom: 40 }}
                      >
                        <h3 className="main-title fw-500 tx-dark m0">
                          NON SAI CHE PERCORSO INTRAPRENDERE O HAI PROBLEMI CON
                          LA PIATTAFORMA?
                        </h3>
                      </div>
                      <p
                        className="fs-20 tx-dark pt-20 m0"
                        style={{ position: "relative", bottom: 40 }}
                      >
                        Siamo disponibili per consigliarti il percorso più
                        adatto a te. Se hai bisogno di assistenza, inviaci un
                        messaggio, un operatore ti risponderà il prima possibile
                      </p>
                    </div>
                  </div>
                  <div className="col-xl-5 col-lg-6 order-lg-first">
                    <div className="form-style-two md-mb-40">
                      <ContactForm />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default HomePage;
