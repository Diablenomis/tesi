import React from "react";
import { Link } from "react-router-dom";
import { SERVICES_DETAILS_PATH } from "../constants/PathConstants";
const Hero = () => {
  const options = [
    { value: 0, display: "Select insurance type.." },
    { value: 1, display: "Life Insurance" },
    { value: 2, display: "Health insurance" },
    { value: 3, display: "Property insurance" },
    { value: 4, display: "Motor insurance" },
  ];

  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  return (
    <div className="hero-banner-ten position-relative zn2">
      <div className="container">
        <div className="row">
          <div
            className="col-lg-9 col-md-10 m-auto text-center"
            data-aos="fade-up"
          >
            <h2 className="">
              METTI IN MOTO IL TUO{" "}
              <span style={{ color: "#a6ce24" }}> {"\n"}CAMBIAMENTO</span>
            </h2>
            <p className="text-lg tx-dark mt-45 mb-50 lg-mt-30 lg-mb-40">
              I tuoi obiettivi. Le tue performance. I tuoi risultati.
            </p>
            <Link to={SERVICES_DETAILS_PATH} className="btn-twentyOne  fw-500 ">
              Scopri i servizi
            </Link>
          </div>
        </div>
      </div>
      <div id = "imgHomeFix">
        <img
          src="/images/media/1.png"
          alt="ilustration"
          className="lazy-img illustration-one"
          data-aos="fade-left"
        />
        <img
          src="/images/media/2.png"
          alt="ilustration"
          className="lazy-img illustration-two"
          data-aos="fade-right"
        />
      </div>
    </div>
  );
};

export default Hero;
