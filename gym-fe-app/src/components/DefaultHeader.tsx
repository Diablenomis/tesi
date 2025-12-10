import { useEffect, useState } from "react";
import MainMenu from "./MainMenu";
import { Link, useLocation } from "react-router-dom";
import { HOMEPAGE_PATH, PROFILE_PATH } from "../constants/PathConstants";

const DefaulHeader = () => {
  const [navbar, setNavbar] = useState(false);
  const [path, setPath] = useState("");

  const location = useLocation();

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };
  
  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  return (
    <header
      className={`theme-main-menu sticky-menu theme-menu-eight border-bottom ${
        navbar ? "fixed" : ""
      }`}
      style={{ maxWidth: "100vw" }}
    >
      <div className="inner-content position-relative">
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo order-lg-0">
            <Link to="/" className="d-block">
              <img src="/images/logo/logorit.png" alt="logo" style={{ maxWidth: "100px" }} />
            </Link>
          </div>
          <div className="right-widget ms-auto d-flex align-items-center order-lg-3">
            <Link
              to={PROFILE_PATH}
              className="login-btn-three rounded-circle tran3s me-3"
              
            >
              <i className="bi bi-person" />
            </Link>
            <Link
              to={HOMEPAGE_PATH + "#contact-us"}
              className="btn-twentyOne fw-500 tran3s d-none d-lg-block"
            >
              Contattaci
            </Link>
          </div>{" "}
          {/* /.right-widget */}
          <MainMenu />
        </div>
      </div>
      {/* /.inner-content */}
    </header>
  );
};

export default DefaulHeader;
