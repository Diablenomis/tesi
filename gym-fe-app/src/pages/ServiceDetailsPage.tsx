import { Link, useLocation } from "react-router-dom";
import { Seo } from "../components/Seo";
import DefaultHeader from "../components/DefaultHeader";
import { Footer } from "../components/Footer";
import { PAGE_TYPE_SCHEDA_PERSONALIZZATA } from "../constants/TypeConstants";
import {
  COACHING_PATH,
  SCHEDA_PERSONALIZZATA_PATH,
  SCHEDA_TUTORIAL_PATH,
} from "../constants/PathConstants";
import { useEffect } from "react";

export const ServiceDetailsPage = () => {
  const location = useLocation();
  function ScrollToCoachingOnline() {
    useEffect(() => {
      setTimeout(() => {
        if (location.hash === "#2") {
          const element = document.getElementById("2");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 200);
    }, [location]);
    return null;
  }
  return (
    <>
      <ScrollToCoachingOnline />
      <DefaultHeader />
      <Seo pageTitle="Service Details" />
      <div style={{ opacity: "0" }}>a</div>
      <div className="fancy-feature-fiftyOne position-relative mt-200">
        <div className="container">
          <div className="row">
            <div className="col-lg-7" data-aos="fade-right">
              <div className="title-style-five mb-65 lg-mb-40">
                <div className="sc-title-two fst-italic position-relative">
                  I servizi di FitNexus
                </div>
                <h3 className="text-align-center">
                  CIO' CHE E' PIU' ADATTO A TE
                </h3>
              </div>
            </div>
          </div>
        </div>

        <img
          src="/images/shape/shape_172.svg"
          alt="shap"
          className="lazy-img shapes shape-two"
        />
        <img
          src="/images/shape/shape_175.svg"
          alt="shap"
          className="lazy-img shapes shape-three"
        />
      </div>

      <div className="service-details position-relative mt-100 mb-170 md-mt-50 lg-mb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-8 order-lg-0" id="1">
              <div className="service-sidebar pe-xxl-5 md-mt-60">
                <div className="service-category mb-40">
                  <h4 className="tx-dark mb-15">Services</h4>
                  <ul className="style-none">
                    <li className="current-page">
                      <a href="#1">Schede Personalizzate</a>
                    </li>
                    <li>
                      <a href="#2">Coaching online</a>
                    </li>
                    {/* <li>
                      <a href="#3">Schede tutorial</a>
                    </li> */}
                  </ul>
                </div>
                <div className="col-lg-5 ms-auto text-center text-lg-end bottoneAc">
                  <div className="text-start">
                    {" "}
                    {/* Cambiato da text-end a text-start */}
                    <Link
                      to={SCHEDA_PERSONALIZZATA_PATH}
                      className="btn-twentyOne fw-500 tran3s mb-50"
                    >
                      Acquista
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-lg-8 order-lg-1" id="1">
              <div className="service-details-meta ps-lg-5">
                <h3 className="main-title tx-dark mb-30">
                  SCHEDE PERSONALIZZATE
                </h3>
                <p className="text-lg tx-dark">
                  Personalizziamo tutto in base ai tuoi obiettivi, alla tua
                  condizione fisica e all’attrezzatura disponibile, che tu ti
                  alleni a casa, in palestra o all’aperto.
                </p>

                <p>
                  Ogni scheda include esercizi completi, dal riscaldamento allo
                  stretching, per garantirti il massimo dei risultati. Prima di
                  iniziare, ti chiederemo di compilare un questionario
                  dettagliato, così potremo creare il programma perfetto per il
                  tuo stile di vita.
                </p>
                <div className="mt-50 lg-mt-30">
                  <div className="row gx-xxl-5">
                    <div className="col-lg-6">
                      <h4 className="sub-title mb-20 tx-dark">Cosa include</h4>
                      <ul className="style-none list-item md-mb-40">
                        <li>4 settimane di allenamento</li>
                        <li>Diverse schede in base ai giorni di allenamento</li>
                        <li>
                          Ripetizioni, serie, carico, tempi di recupero, video
                          dimostrativi e consigli per ogni esercizio
                        </li>
                        <li>
                          Feedback a distanza di una settimana per migliorare
                          ancora di più le schede
                        </li>
                        <li>Accesso permanente all’area personale</li>
                        <li>Possibilità di scaricare le schede in PDF</li>
                      </ul>
                    </div>
                    <div className="col-lg-6">
                      <h4 className="sub-title mb-20 tx-dark">
                        Basi del programma
                      </h4>
                      <p className="pe-xxl-5">
                        <ul className="style-none list-item md-mb-40">
                          <li>Obiettivi personali</li>
                          <li>
                            La tua condizione fisica, considerando anche
                            eventuali problemi fisici e infortuni
                          </li>
                          <li>
                            Disponibilità in termini di tempo per l'allenamento
                            settimanale
                          </li>
                          <li>Attrezzatura a disposizione</li>
                        </ul>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="service-details position-relative mt-100 mb-170 md-mt-50 lg-mb-120"
        id="2"
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-8 order-lg-0">
              <div className="service-sidebar pe-xxl-5 md-mt-60">
                {/* <div className="service-category mb-40">
                  <h4 className="tx-dark mb-15">Services</h4>
                  <ul className="style-none">
                    <li>
                      <a href="#1">Schede Personalizzate</a>
                    </li>
                    <li className="current-page">
                      <a href="#2">Coaching online</a>
                    </li>
                    <li>
                      <a href="#3">Schede tutorial</a>
                    </li>
                  </ul>
                </div> */}
                <div className="col-lg-5 ms-auto text-center text-lg-end bottoneAc">
                  <div className="text-start">
                    {" "}
                    {/* Cambiato da text-end a text-start */}
                    <Link
                      to={COACHING_PATH}
                      className="btn-twentyOne fw-500 tran3s mb-50"
                    >
                      Acquista
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-9 col-lg-8 order-lg-1">
              <div className="service-details-meta ps-lg-5">
                <h3 className="main-title tx-dark mb-30">COACHING ONLINE</h3>
                <p className="text-lg tx-dark">
                  Il nostro Coaching Online ti offre un percorso di allenamento
                  totalmente personalizzato e completo.
                </p>

                <p>
                  Scegli il coach che preferisci e ricevi un piano su misura. Il
                  tuo personal trainer sarà sempre a disposizione tramite
                  WhatsApp o Telegram per guidarti, motivarti e correggere i
                  tuoi esercizi. Non sarai mai solo, avrai accesso continuo alle
                  tue schede e a tutte le risorse necessarie per raggiungere
                  i tuoi obiettivi.
                </p>
                <div className="mt-50 lg-mt-30">
                  <div className="row gx-xxl-5">
                    <div className="col-lg-6">
                      <h4 className="sub-title mb-20 tx-dark">Cosa include</h4>
                      <ul className="style-none list-item md-mb-40">
                        <li>5 settimane di allenamento</li>
                        <li>Diverse schede in base ai giorni di allenamento</li>

                        <li>
                          Ripetizioni, serie, carico, tempi di recupero, video
                          dimostrativi e consigli per ogni esercizio
                        </li>
                        <li>Feedback costante via chat</li>
                        <li>Accesso permanente all’area personale</li>
                        <li>Possibilità di scaricare le schede in PDF</li>
                        <li>Correzione delle esecuzioni tramite chat</li>
                        <li>
                          Check mensile tramite videochiamata o allenamento in
                          presenza a Roma
                        </li>
                        <li>Possibilità di scegliere il personal trainer</li>
                      </ul>
                    </div>
                    <div className="col-lg-6">
                      <h4 className="sub-title mb-20 tx-dark">
                        Basi del programma
                      </h4>
                      <p className="pe-xxl-5">
                        <ul className="style-none list-item md-mb-40">
                          <li>
                            Videochiamata conoscitiva o allenamento in
                            presenza a Roma
                          </li>
                          <li>Obiettivi personali</li>
                          <li>
                            La tua condizione fisica, considerando anche
                            eventuali problemi fisici e infortuni
                          </li>
                          <li>
                            Disponibilità in termini di tempo per l'allenamento
                            settimanale
                          </li>
                          <li>Attrezzatura a disposizione</li>
                        </ul>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div
        className="service-details position-relative mt-100 mb-170 md-mt-50 lg-mb-120"
        id="3"
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-8 order-lg-0">
              <div className="service-sidebar pe-xxl-5 md-mt-60">
                <div className="service-category mb-40">
                  <h4 className="tx-dark mb-15">Services</h4>
                  <ul className="style-none">
                    <li>
                      <a href="#1">Schede Personalizzate</a>
                    </li>
                    <li>
                      <a href="#2">Coaching online</a>
                    </li>
                    <li className="current-page">
                      <a href="#3">Schede tutorial</a>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-5 ms-auto text-center text-lg-end bottoneAc">
                  <div className="text-start">
                    {" "}
                    <Link
                      to={SCHEDA_TUTORIAL_PATH}
                      className="btn-twentyOne fw-500 tran3s"
                    >
                      Acquista
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-lg-8 order-lg-1">
              <div className="service-details-meta ps-lg-5">
                <h2 className="main-title tx-dark mb-30">Schede tutorial</h2>
                <p className="text-lg tx-dark">
                  Sono schede preimpostate per aiutarti a raggiungere un
                  obiettivo specifico. Ogni scheda è divisa in vari livelli di
                  difficoltà, dal più semplice al più complesso, da scegliere in
                  base al tuo livello attuale.{" "}
                </p>

                <div className="mt-50 lg-mt-30">
                  <div className="row gx-xxl-5">
                    <div className="col-lg-6">
                      <h4 className="sub-title mb-20 tx-dark">Cosa include</h4>
                      <ul className="style-none list-item md-mb-40">
                        <li>
                          Video dell’esecuzione dell’esercizio con spiegazione
                        </li>
                        <li>
                          Accesso permanente alla piattaforma e alla tua area
                          personale.
                        </li>
                      </ul>
                    </div>
                    <div className="col-lg-6">
                      <h4 className="sub-title mb-20 tx-dark">
                        Come realizzareremo la tua scheda
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div
        className="fancy-short-banner-sixteen mt-130 lg-mt-80 mb-50"
        data-aos="fade-up"
      >
        <div className="container">
          <div className="bg-wrapper pt-65 pb-65 lg-pt-40 lg-pb-40">
            <div className="row">
              <div className="col-xl-10 col-md-11 m-auto">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="text-wrapper text-center text-lg-start md-pb-30">
                      <div className="sc-title fs-18 pb-10">Sei pronto?</div>
                      <h3 className="text-white m0">INIZIA IL TUO PERCORSO</h3>
                    </div>
                  </div>
                  {/* End .col-6 */}

                  <div className="col-lg-5 ms-auto text-center text-lg-end">
                    <Link
                      to={SCHEDA_PERSONALIZZATA_PATH}
                      className="btn-twentyOne fw-500 tran3s"
                    >
                      Acquista
                    </Link>
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
