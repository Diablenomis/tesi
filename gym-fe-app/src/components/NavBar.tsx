import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  PAGE_TYPE_ABOUT_US,
  PAGE_TYPE_COACHING,
  PAGE_TYPE_HOMEPAGE,
  PAGE_TYPE_PROFILE,
  PAGE_TYPE_SCHEDA_PERSONALIZZATA,
  PAGE_TYPE_SCHEDA_TUTORIAL,
} from "../constants/TypeConstants";
import SchedaTutorialIconUrl from "../assets/images/scheda-tutorial.png";
import SchedaTutorialBlackIconUrl from "../assets/images/scheda-tutorial-black.png";
import SchedaPersonalizzataIconUrl from "../assets/images/scheda-personalizzata.png";
import SchedaPersonalizzataBlackIconUrl from "../assets/images/scheda-personalizzata-black.png";
import CoachingIconUrl from "../assets/images/coaching.png";
import CoachingBlackIconUrl from "../assets/images/coaching-black.png";
import ProfileIconUrl from "../assets/images/user-icon.png";
import ProfileBlackIconUrl from "../assets/images/user-icon-black.png";
import AboutUsIcon from "../assets/images/about-us-icon.png";
import AboutUsIconBlack from "../assets/images/about-us-icon-black.png";
import MenuIconUrl from "../assets/images/icon-menu.png";
import { useNavigate } from "react-router-dom";
import {
  ABOUT_US_PATH,
  COACHING_PATH,
  HOMEPAGE_PATH,
  PROFILE_PATH,
  SCHEDA_PERSONALIZZATA_PATH,
  SCHEDA_TUTORIAL_PATH,
} from "../constants/PathConstants";
import { isMobile } from "react-device-detect";
import { INavBar } from "../models/ComponentInterface";
import React, { useState } from "react";

export const NavBar: React.FC<INavBar> = ({ page }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  return (
    <div className="panel navbar-style container-fluid padding-page-half-navbar m-0">
      {!isMobile && (
        <div className="row no-pm">

          {page === PAGE_TYPE_HOMEPAGE ? (
            <div
              className="col navbar-logo pointer no-pm"
              onClick={() => {
                navigate(HOMEPAGE_PATH);
              }}
            ></div>
          ) : (
            <div
              className="col navbar-logo-black pointer no-pm"
              onClick={() => {
                navigate(HOMEPAGE_PATH);
              }}
            ></div>
          )}
          <div className="col no-pm"></div>
          {/* <div className="col navbar-icon navbar-icon-center my-auto p-0">
            <Tooltip title="Schede Tutorial">
              <IconButton
                onClick={() => {
                  navigate(SCHEDA_TUTORIAL_PATH);
                }}
                size={isMobile ? "small" : "medium"}
              >
                {page === PAGE_TYPE_SCHEDA_TUTORIAL ? (
                  <img className="navbar-img" src={SchedaTutorialIconUrl} alt="Scheda Tutorial"/>
                ) : (
                  <img
                    className="navbar-img"
                    src={SchedaTutorialBlackIconUrl}
                    alt="Scheda tutorial"
                  />
                )}
              </IconButton>
            </Tooltip>
          </div> */}
          
          <div className="col navbar-icon navbar-icon-center my-auto p-0">
            <Tooltip title="Scheda Personalizzata">
              <IconButton
                onClick={() => {
                  navigate(SCHEDA_PERSONALIZZATA_PATH);
                }}
                size={isMobile ? "small" : "medium"}
              >
                {page === PAGE_TYPE_SCHEDA_PERSONALIZZATA ? (
                  <img
                    className="navbar-img"
                    src={SchedaPersonalizzataIconUrl}
                    alt="Scheda Personalizzata"
                  />
                ) : (
                  <img
                    className="navbar-img"
                    src={SchedaPersonalizzataBlackIconUrl}
                    alt="Scheda Personalizzata"
                  />
                )}
              </IconButton>
            </Tooltip>
          </div>
          <div className="col navbar-icon navbar-icon-center my-auto p-0">
            <Tooltip title="Coaching">
              <IconButton
                onClick={() => {
                  navigate(COACHING_PATH);
                }}
                size={isMobile ? "small" : "medium"}
              >
                {page === PAGE_TYPE_COACHING ? (
                  <img className="navbar-img" src={CoachingIconUrl} alt="Coaching"/>
                ) : (
                  <img className="navbar-img" src={CoachingBlackIconUrl} alt="Coaching"/>
                )}
              </IconButton>
            </Tooltip>
          </div>
          <div className="col navbar-icon navbar-icon-center my-auto p-0">
            <Tooltip title="About Us">
              <IconButton
                onClick={() => {
                  navigate(ABOUT_US_PATH);
                }}
                size={isMobile ? "small" : "medium"}
              >
                {page === PAGE_TYPE_ABOUT_US ? (
                  <img className="navbar-img" src={AboutUsIcon} alt="About Us"/>
                ) : (
                  <img className="navbar-img" src={AboutUsIconBlack} alt="About Us"/>
                )}
              </IconButton>
            </Tooltip>
          </div>
          <div className="col navbar-icon navbar-icon-center my-auto p-0">
            <Tooltip title="Area Personale">
              <IconButton
                onClick={() => {
                  navigate(PROFILE_PATH);
                }}
                size={isMobile ? "small" : "medium"}
              >
                {page === PAGE_TYPE_PROFILE ? (
                  <img className="navbar-img" src={ProfileIconUrl} alt="Area Personale"/>
                ) : (
                  <img className="navbar-img" src={ProfileBlackIconUrl} alt="Area Personale"/>
                )}
              </IconButton>
            </Tooltip>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="row no-pm">
          {page === PAGE_TYPE_HOMEPAGE ? (
            <div
              className="col navbar-logo pointer no-pm"
              onClick={() => {
                navigate(HOMEPAGE_PATH);
              }}
            ></div>
          ) : (
            <div
              className="col navbar-logo-black pointer no-pm"
              onClick={() => {
                navigate(HOMEPAGE_PATH);
              }}
            ></div>
          )}
          <div className="col no-pm"></div>
          {page !== PAGE_TYPE_HOMEPAGE && (
            <div className="col navbar-icon navbar-icon-center my-auto p-0">
              <IconButton size={isMobile ? "small" : "medium"}>
                {page === PAGE_TYPE_SCHEDA_TUTORIAL && (
                  <img className="navbar-img" src={SchedaTutorialIconUrl} alt="Scheda Tutorial"/>
                )}
                {page === PAGE_TYPE_COACHING && (
                  <img className="navbar-img" src={CoachingIconUrl} alt="Scheda Personalizzata"/>
                )}
                {page === PAGE_TYPE_SCHEDA_PERSONALIZZATA && (
                  <img className="navbar-img" src={SchedaPersonalizzataIconUrl} alt="About Us"/>
                )}
                {page === PAGE_TYPE_ABOUT_US && (
                  <img className="navbar-img" src={AboutUsIcon} alt="About Us"/>
                )}
                {page === PAGE_TYPE_PROFILE && (
                  <img className="navbar-img" src={ProfileIconUrl} alt="Area Personale"/>
                )}
              </IconButton>
            </div>
          )}
          <div className="col navbar-icon navbar-icon-center my-auto p-0">
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <img className="navbar-img" src={MenuIconUrl} alt="Menu"></img>
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  navigate(SCHEDA_TUTORIAL_PATH);
                }}
              >
                <ListItemIcon>
                  <img className="navbar-img" src={SchedaTutorialIconUrl} alt="Scheda Tutorial"/>
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{fontSize: '14px'}} >Scheda Tutorial</ListItemText>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  navigate(SCHEDA_PERSONALIZZATA_PATH);
                }}
              >
                <ListItemIcon>
                  <img className="navbar-img" src={SchedaPersonalizzataIconUrl} alt="Scheda Personalizzata"/>
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{fontSize: '14px'}}>Scheda Personalizzata</ListItemText>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  navigate(COACHING_PATH);
                }}
              >
                <ListItemIcon>
                  <img className="navbar-img" src={CoachingIconUrl} alt="Coaching"/>
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{fontSize: '14px'}}>Coaching Online</ListItemText>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  navigate(ABOUT_US_PATH);
                }}
              >
                <ListItemIcon>
                  <img className="navbar-img" src={AboutUsIcon} alt="About Us"/>
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{fontSize: '14px'}}>About Us</ListItemText>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  navigate(PROFILE_PATH);
                }}
              >
                <ListItemIcon>
                  <img className="navbar-img" src={ProfileIconUrl} alt="Area Personale"/>
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{fontSize: '14px'}}>Area Personale</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        </div>
      )}
    </div>
  );
};
