import { Link, useLocation, useNavigate } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import {
  HOMEPAGE_SOCIAL_FACEBOOK_URL,
  HOMEPAGE_SOCIAL_INSTAGRAM_URL,
} from "../constants/SocialConstants";
import {
  ABOUT_US_PATH,
  HOMEPAGE_PATH,
  PROFILE_PATH,
  SERVICES_DETAILS_PATH,
  TEAM_PATH,
} from "../constants/PathConstants";
import { getStorageValue, setLogoutLS } from "../services/LocalStorage";
import styled from "@emotion/styled";
import { Button, ButtonProps } from "react-bootstrap";
import { useEffect, useState } from "react";

import { LS_USER, LS_IS_CUSTOMER } from "../constants/TypeConstants";
import { SignCard } from "./SignCard";
import { loadStripe } from "@stripe/stripe-js";
import CartService from "../services/CartService";

const ColoredButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: "#a6ce24",
  color: "#ffffff",
  fontWeight: 400,
  "&:hover": {
    color: "#ffffff",
    backgroundColor: "#192b3f",
  },
  textTransform: "none",
  height: "fit-content",
}));

const ColoredButtonDelete = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: "grey",
  color: "#ffffff",
  fontWeight: 400,
  "&:hover": {
    color: "#ffffff",
    backgroundColor: "#cc0029",
  },
  border: "none",
  height: "fit-content",
  // paddingBottom:15,
}));

const stripePromise = loadStripe(
  "pk_live_51MdzX7KGVwCjDJH8yNXm79uItxbet5JDkidSoKbytC5UdxP4hz8cHO41zBEYp6k9b3bfqt0yzUOVVTkfxHmIfiVF00721Mbu5H"
);

export const Footer = () => {
  const [isShowSignCard, setIsShowSignCard] = useState<boolean>(false);
  const [user, setUser] = useState<string>("");
  const [isCustomer, setIsCustomer] = useState<boolean>(false);

  const openLoginModal = () => {
    setIsShowSignCard(true);
  };

  const closeLoginModal = () => {
    setIsShowSignCard(false);
  };
  const location = useLocation();
  const links = [
    {
      id: 1,
      title: "Links",
      column: "col-lg-2 col-md-3 col-sm-6 mb-30",
      items: [
        { label: "Home", href: HOMEPAGE_PATH },
        { label: "Cos'è FitNexus", href: ABOUT_US_PATH },
        { label: "Il nostro team", href: TEAM_PATH },
        { label: "Servizi", href: SERVICES_DETAILS_PATH },
      ],
    },
    {
      id: 2,
      title: "Services",
      column: "col-lg-3 col-md-4 col-sm-6 mb-30",
      items: [
        { label: "Schede personalizzate", href: `${SERVICES_DETAILS_PATH}#1` },
        { label: "Coaching online", href: `${SERVICES_DETAILS_PATH}#2` },
        // { label: "Schede tutorial", href: `${SERVICES_DETAILS_PATH}#3` },
        // { label: "Come usare la web app", href: "/service-details" },
      ],
    },
  ];

  const socialIcons = [
    {
      iconClass: "fab fa-facebook-f",
      link: HOMEPAGE_SOCIAL_FACEBOOK_URL,
    },
    {
      iconClass: "fab fa-instagram",
      link: HOMEPAGE_SOCIAL_INSTAGRAM_URL,
    },
  ];

  const logout = () => {
    setLogoutLS();
  };

  const handleCancelSub = async () => {
    try {
      const stripe = await stripePromise;

      if (stripe) {
        CartService.setCancelSub()
          .then((response) => {
            window.location.href = response.data.portal_session_id;
          })
          .catch((e) => {
            console.error("Error redirecting to customer portal - inside -", e);
          });
      } else {
        console.error("Stripe not loaded properly");
      }
    } catch (error) {
      console.error("Error redirecting to customer portal", error);
    }
  };

  useEffect(() => {
    const user = getStorageValue(LS_USER) || "";
    setUser(user);
    if (getStorageValue(LS_IS_CUSTOMER) === "yes") {
      console.log("è un customer");
      setIsCustomer(true);
    } else {
      setIsCustomer(false);
    }
  }, []);

  const navigate = useNavigate();

  return (
    <div className="footer-style-ten theme-basic-footer p-0 position-relative mt-50">
      <SignCard show={isShowSignCard} onHide={closeLoginModal}></SignCard>

      {/* <CookieConsent
        location="bottom"
        buttonText="Accetto"
        cookieName="CookiesAccepted"
        style={{ background: "#020202" }}
        buttonStyle={{
          color: "#ffffff",
          backgroundColor: "#a6ce24",
          fontSize: "13px",
        }}
        expires={150}
      >
        Questo sito utilizza i cookie per migliorare l'esperienza dell'utente.
      </CookieConsent> */}

      <div className="row justify-content-between pb-50">
        <div className=" justify-content-evenly d-flex col-12 align-items-center pt-100  flex-wrap">
          <div className="flex-column d-flex align-items-center justify-content-between col-10 col-md-4">
            <img src="/images/logo/logo-bianco.png" alt="logo" width={"50%"}  className="mb-30"/>

            {location.pathname === PROFILE_PATH && (
              <ColoredButton
                // className="button-size ml-1 button-font-size"
                onClick={() => (user === "" ? openLoginModal() : logout())}
                style={
                  user !== ""
                    ? { backgroundColor: "red", borderColor: "red" }
                    : {}
                }
                className={user === "" ? "" : "fixed-login-logout-button"}
                id="login-logout"
              >
                {user === "" ? "Login" : "Logout"}
              </ColoredButton>
            )}

            {location.pathname !== PROFILE_PATH && (
              <ColoredButton
                // className="button-size ml-1 button-font-size"
                onClick={() => (user === "" ? openLoginModal() : logout())}
                style={
                  user !== ""
                    ? { backgroundColor: "red", borderColor: "red" }
                    : {}
                }
                className={"show-mobile"}
                id="login-logout"
              >
                {user === "" ? "Login" : "Logout"}
              </ColoredButton>
            )}

            <br />
            {isCustomer && (
              <ColoredButtonDelete
                // className="button-size-sub ml-1 button-font-size"
                onClick={() => handleCancelSub()}
              >
                {"Gestisci abbonamento"}
              </ColoredButtonDelete>
            )}
            <br />
            <h3 className="text-white">Contattaci</h3>
            <p className="text-white opacity-75 text-align-center">
              info@fitnexus.com
            </p>
            <p className="text-white opacity-75 text-align-center">
              P.IVA: 17723831008
            </p>
          </div>

          {links.map((link) => (
            <div key={link.id} className="col-4">
              <h5 className="footer-title text-white fw-500">{link.title}</h5>
              <ul className="footer-nav-link style-none">
                {link.items.map((item, i) => (
                  <li key={i}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* <div className="col-xl-3 col-lg-4 col-md-5 mb-30">
              <h5 className="footer-title text-white fw-500">Info</h5>
              <ul className="d-flex social-icon style-none">
                {socialIcons.map((icon, index) => (
                  <li key={index}>
                    <a
                      href={icon.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className={icon.iconClass} />
                    </a>
                  </li>
                ))}
              </ul>
            </div> */}
      </div>
    </div>
  );
};
