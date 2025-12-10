import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  ABOUT_US_PATH,
  HOMEPAGE_PATH,
  SERVICES_DETAILS_PATH,
  TEAM_PATH,
} from "../constants/PathConstants";
import { useState, useEffect } from "react";
import { getStorageValue } from "../services/LocalStorage";
import { LS_USER } from "../constants/TypeConstants";

const MainMenu = () => {
  const location = useLocation();
  const [path, setPath] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const user = getStorageValue(LS_USER) || "";
    setUser(user);
  }, []);

  useEffect(() => {
    setPath(location.pathname);
  }, [location]);

  return (
    <nav className="navbar navbar-expand-lg order-lg-2">
      <button
        className="navbar-toggler d-block d-lg-none"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span />
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              to="/"
              className={"nav-link"}
              style={path === "/" ? { color: "#a6ce24" } : {}}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={SERVICES_DETAILS_PATH}
              className={`nav-link`}
              style={path === SERVICES_DETAILS_PATH ? { color: "#a6ce24" } : {}}
            >
              Servizi
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={TEAM_PATH}
              className={`nav-link`}
              style={path === TEAM_PATH ? { color: "#a6ce24" } : {}}
            >
              Team
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={ABOUT_US_PATH}
              className={`nav-link`}
              style={path === ABOUT_US_PATH ? { color: "#a6ce24" } : {}}
            >
              Cos'è FitNexus
            </Link>
          </li>
          <li className="nav-item navbar-login-logout-shortcut">
            <Link to={HOMEPAGE_PATH + "#contact-us"} className={`nav-link`}>
              Contattaci
            </Link>
          </li>
          <li className="nav-item navbar-login-logout-shortcut">
            <Link
              to={"#login-logout"}
              className={`nav-link`}
              style={path === ABOUT_US_PATH ? { color: "#a6ce24" } : {}}
            >
              Vai al {user === "" ? "login" : "logout"}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default MainMenu;
