import { Link } from "react-router-dom";
import React from "react";
import { ABOUT_US_PATH } from "../constants/PathConstants";

const Hero_aboutUsPage = () => {
  return (
    <>
      <p className="text-lg mb-20 pt-20 lg-mb-30">
        Il tuo piano personalizzato tutto in un'unica piattaforma
      </p>

      {/* <p className="text-align-center">
        Il nome FitNexus rappresenta la nostra filosofia: il
        movimento è il segreto per migliorare salute e benessere. Non ci
        limitiamo a offrire programmi di allenamento standard, ma creiamo
        percorsi personalizzati che ti aiutano a ottenere il pieno controllo del
        tuo corpo raggiungendo risultati concreti e duraturi. Con FitNexus, ogni
        allenamento è un passo verso una versione migliore di te stesso.
      </p> */}
      {/* <Link to={ABOUT_US_PATH} className="btn-twentyOne fw-500 tran3s ">
        Vedi tutorial
      </Link> */}
    </>
  );
};

export default Hero_aboutUsPage;
