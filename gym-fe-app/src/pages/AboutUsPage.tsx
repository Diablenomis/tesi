import { Seo } from "../components/Seo";
import DefaultHeader from "../components/DefaultHeader";
import { Footer } from "../components/Footer";
import Faq from "../components/Faq";
import Testimonial from "../components/Testimonial";
import Team1 from "../components/Team1";
import { Link } from "react-router-dom";
import Quote from "../components/Quote";
import Hero from "../components/Hero_aboutUsPage";
import Counter from "../components/Counter";

import ContactForm from "../components/ContactForm";
import { HOMEPAGE_SOCIAL_INSTAGRAM_URL } from "../constants/SocialConstants";
import { TEAM_PATH } from "../constants/PathConstants";
export const AboutUsPage = () => {
  const features = [
    { text: "Amazing communication." },
    { text: "Best trending designing experience." },
    { text: "Email & Live chat." },
  ];

  const starRating = Array(5)
    .fill(null)
    .map((_, index) => (
      <li key={index}>
        <i className="fa-solid fa-star" />
      </li>
    ));

  return (
    <>
      <Seo pageTitle="About Us" />
      <DefaultHeader />

      <div
        className="fancy-feature-fortySix position-relative"
        style={{ marginTop: "40% !important" }}
      >
        <div className="container mt-150">
          <div className="position-relative pt-20 pb-180 lg-pt-20 md-pb-130">
            <Quote />
            <div className="col-lg-7 col-md-9 m-auto text-center">
              <Hero />
            </div>
          </div>
          {/* <div className="row" style={{ marginTop: "-10%" }}>
            <div className="col-xxl-11 m-auto">
              <img
                src="/images/media/img_96.jpg"
                alt="shape"
                className="lazy-img main-screen-two m-auto"
              />
            </div>
          </div> */}
        </div>
      </div>

      <div style={{maxWidth:1400, margin:"auto"}}>
        <div className="col-12 col-md-11 mx-auto text-about-us">
          <h3>CHI SIAMO?</h3>
          <p className="col-12 col-md-8 p-3">
            FitNexus è una piattaforma online innovativa che offre servizi di
            allenamento personalizzato, progettati per aiutarti a raggiungere i
            tuoi obiettivi di fitness. Il nostro team è composto da cinque coach
            altamente specializzati in diversi ambiti del fitness, uniti dalla
            passione per il movimento e dalla dedizione nel supportare i nostri
            clienti nel loro percorso di crescita fisica e mentale. Grazie alla
            collaborazione con il nostro nutrizionista, siamo in grado di
            offrirti una strategia completa, per mostrarti il tuo vero
            potenziale.
          </p>
        </div>
        <div className="col-12 col-md-11 mx-auto mt-50 text-align-right d-flex text-about-us flex-column text-right">
          <h3>IL NOSTRO APPROCCIO</h3>
          <p className="col-12 col-md-8 p-3">
            Il nome FitNexus rappresenta la nostra filosofia: il
            movimento è il segreto per migliorare salute e benessere. Non ci
            limitiamo a offrire programmi di allenamento standard, ma creiamo
            percorsi personalizzati che ti aiutano a ottenere il pieno controllo
            del tuo corpo raggiungendo risultati concreti e duraturi. Con FitNexus,
            ogni allenamento è un passo verso una versione migliore di te
            stesso.
          </p>
        </div>
        <div className="col-12 col-md-11 mx-auto text-about-us mt-50">
          <h3>A CHI CI RIVOLGIAMO</h3>
          <div className="col-12 col-md-8 p-3">
            <ul>
              <li>
                Persone che già si allenano regolarmente ma che sentono di
                essere in una fase di stallo o che desiderano un approccio più
                avanzato e mirato.
              </li>
              <li>
                Chi ha obiettivi specifici, oltre al semplice dimagrimento o
                aumento della massa muscolare, e non riesce a raggiungerli da
                solo.
              </li>
              <li>
                Chi ha problemi fisici strutturali o deve recuperare da
                infortuni pregressi e ha bisogno di un programma personalizzato
                che tenga conto delle loro esigenze particolari.
              </li>
              <li>
                Coloro che hanno già provato servizi di allenamento online ma
                non sono rimasti soddisfatti dall'approccio standardizzato o
                dalla mancanza di supporto.
              </li>
            </ul>
          </div>
        </div>
        <div className="col-12 col-md-11 mx-auto mt-50 text-align-left d-flex flex-column text-right text-about-us">
          <h3>PERCHE' SCEGLIERE FitNexus?</h3>
          <div className="col-12 col-md-8 p-3">
            <ul>
              <li>
                Esperienza nel coaching online: Il coaching online richiede
                competenze specifiche, che abbiamo sviluppato attraverso anni di
                esperienza. Sappiamo come motivare e supportare i nostri clienti
                a distanza, garantendo risultati reali.
              </li>
              <li>
                Un team multidisciplinare: Dietro FitNexus non c'è un solo trainer,
                ma un team di esperti con competenze diverse, pronti a creare il
                percorso giusto per ogni tua esigenza.
              </li>
              <li>
                La nostra piattaforma offre strumenti per monitorare i
                progressi, ricevere feedback e accedere a contenuti esclusivi,
                migliorando l'esperienza di allenamento. Con il tuo aiuto
                cercheremo sempre di migliorarci.
              </li>
              <li>
                Servizi su misura: Ogni programma è personalizzato in base alle
                specifiche esigenze del cliente, garantendo un approccio unico e
                mirato per raggiungere i propri obiettivi.
              </li>
              <li>
                Unico nel suo genere: FitNexus offre un servizio innovativo, diverso
                da qualsiasi altra proposta presente sul mercato, per chi cerca
                qualità, professionalità e risultati.
              </li>
            </ul>
          </div>
        </div>
        <h3 className="text-align-center mt-100 mb-100">
          COSA ASPETTI? <br />
          Decidi il tuo piano di acquisto e iniziamo questo percorso insieme.
        </h3>
      </div>
      <div className="team-section-two position-relative pt-200 lg-pt-120">
        <div className="container">
          <div className="wrapper position-relative">
            <div className="row align-items-center">
              <div className="col-lg-5" data-aos="fade-right">
                <div className="title-style-six text-center text-lg-start pb-40 lg-pb-20 md-pb-10">
                  <h3>IL TEAM</h3>
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
          src="/images/shape/shape_172.svg"
          alt="shape"
          className="lazy-img shapes shape-one d-none d-xl-inline-block"
        />
      </div>

      {/* <div
        className="feedback-section-eleven position-relative mt-50 pt-100 pb-70 lg-pt-70 lg-pb-50"
        data-aos="fade-up"
      >
        <div className="container">
          <div className="title-style-one text-center mb-50 lg-mb-20">
            <h2 className="main-title fw-500 tx-dark m0">Dicono di noi</h2>
          </div>
        </div>
        <div className="inner-content">
          <div className="slider-wrapper">
            <div className="feedback_slider_seven">
              <Testimonial />
            </div>
          </div>
        </div>
      </div> */}

      <div className="fancy-feature-thirtyEight mt-180 lg-mt-120">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="block-style-seven" data-aos="fade-right">
                <div className="title-style-six">
                  <div className="sc-title-two text-uppercase">Servizi</div>
                  <h3>SCEGLI IL TUO PERCORSO</h3>
                </div>
                {/* /.title-style-ten */}
                <p className="fs-20 pt-10 pb-30 lg-pb-20">
                  Con FitNexus potrai avviare il percorso per il raggiungimento dei
                  tuoi obiettivi, attraverso la scelta di uno dei due servizi.
                </p>
                <div className="btn-eighteen position-relative d-inline-block tx-dark">
                  <Link to="/page-menu/about-us-v1" className="fw-500 tran3s">
                    Vai ai servizi
                    <i className="fa-solid fa-angle-right" />
                  </Link>
                </div>
              </div>
              {/* /.block-style-seven */}
            </div>
            {/* End .col-lg-5 */}
            <div className="col-lg-6 ms-auto mt-30" data-aos="fade-left">
              <Faq />
            </div>
          </div>
        </div>
        {/* /.container */}
      </div>
      <div className="fancy-short-banner-thirteen pt-170 pb-170 mt-130 lg-mt-100 lg-pt-80 lg-pb-80 ">
        <div className="container">
          <div className="bg-wrapper zn2 bg-white position-relative">
            <div className="row">
              <div className="col-xl-11 m-auto">
                <div className="row align-items-center">
                  <div className="col-lg-6 ms-auto order-lg-last">
                    <div className="text-wrapper">
                      <div
                        className="title-style-one"
                        style={{ position: "relative", bottom: 40 }}
                      >
                        <h3>
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

            <div className="shapes shape-text fw-500 fs-20 tx-dark text-center">
              Fill the <br />
              form
            </div>
            <img
              src="/images/shape/shape_90.svg"
              alt="shape"
              className="lazy-img shapes shape-one"
            />
            <img
              src="/images/shape/shape_91.svg"
              alt="shape"
              className="lazy-img shapes shape-two"
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
