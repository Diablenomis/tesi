import React from "react";
import Counter from "./Counter"; // Assicurati di importare il componente Counter
import { Link } from "react-router-dom";
import { ABOUT_US_PATH } from "../constants/PathConstants";

const FancyFeature = () => {
  return (
    <div className="fancy-feature-fiftyOne position-relative mt-200">
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <div className="title-style-five mb-65 md-mb-40">
              {/* <div className="sc-title-two fst-italic position-relative">
                Cos'è FitNexus
              </div> */}
              <h3>
                PER CONCRETIZZARE I TUOI OBIETTIVI
              </h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-8 col-lg-9 ms-auto">
            <div className="ps-xxl-5">
              <h6 className="mb-30" data-aos="fade-left">
                Mission &amp; Vision.
              </h6>
              <p className="text-lg tx-dark">
                FitNexus nasce con lo scopo di aiutare a raggiungere i tuoi obiettivi
                attraverso schede personalizzate e allenamenti realizzati da
                coach specializzati in diversi settori.
              </p>
              <div className="btn-eighteen position-relative d-inline-block tx-dark">
                <Link to={ABOUT_US_PATH} className="fw-500 tran3s">
                  Scopri di più
                  <i className="fa-solid fa-angle-right" />
                </Link>
              </div>
              <div className="row">
                <Counter />
              </div>
            </div>
          </div>
        </div>
      </div>

      <img
        src="../images/shape/shape_171.svg"
        alt="shape"
        className="lazy-img shapes shape-one"
      />
      <img
        src="../images/shape/shape_172.svg"
        alt="shape"
        className="lazy-img shapes shape-two"
      />
    </div>
  );
};

export default FancyFeature;
