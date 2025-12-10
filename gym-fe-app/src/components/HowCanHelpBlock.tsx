import { Link } from "react-router-dom";
import { ABOUT_US_PATH } from "../constants/PathConstants";
const HowCanHelpBlock = () => {
  return (
    <div className="fancy-feature-seventeen position-relative mt-4">
      <img
        src="/images/shape/shape_80.svg"
        alt="shape"
        className="lazy-img shapes shape-four"
      />
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-5 col-lg-6 ms-auto order-lg-last">
            <div className="title-style-six">
              <div className="sc-title-two fst-italic position-relative">
                Why FitNexus?
              </div>
              <h3 className=" tx-dark">
                CONQUISTA I TUOI TRAGUARDI, GRAZIE ALLA NOSTRA PIATTAFORMA.
              </h3>
            </div>
            <p className="fs-20 lh-lg pe-xxl-5 mt-60 lg-mt-30">
              Nella tua area riservata potrai accedere a tutte le tue schede,
              create su misura per i tuoi obiettivi. Avrai anche la possibilità
              di guardare video per perfezionare le tue esecuzioni.
            </p>
            <Link to={ABOUT_US_PATH} className="btn-twentyOne fw-500 ">
              Cos'è FitNexus
            </Link>
          </div>

          <div className="col-lg-6 order-lg-first">
            <div className="img-meta d-inline-block position-relative">
              <img
                src="/images/media/gruppo.png"
                alt="media"
                className="lazy-img"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowCanHelpBlock;
