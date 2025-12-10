import {
  Avatar,
  Badge,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import CartIcon from "../assets/images/cart-icon.png";
import { isMobile } from "react-device-detect";
import { IPackCardDetailLevels } from "../models/ComponentInterface";
import CartService from "../services/CartService";
import { useEffect, useState } from "react";
import { getStorageValue } from "../services/LocalStorage";
import {
  LS_USER,
  PAGE_TYPE_SCHEDA_TUTORIAL_DETAIL,
} from "../constants/TypeConstants";
import { IUser } from "../models/User";
import { initialUser } from "../constants/InitialEntities";
import { getLevelIcon, getLevelName } from "../services/PackLevelService";
import GroupLevels from "../assets/images/icon-group-levels.png";

export const PackCardDetailLevels: React.FC<IPackCardDetailLevels> = ({
  pack,
  levelSelected,
  changeLevel,
  page,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLevel = (levelSelected: string) => {
    changeLevel(levelSelected);
  };

  return (
    <div className="panel levels-panel-style container-fluid p-0 m-0 zoom-in">
      <div className="row no-pm">
        <div className="col levels-title-div padding-page-half">
          <span className="text-font-big title-centered">Livelli</span>
        </div>

        <div className="col m-0 row padding-page-field">
          {!isMobile &&
            pack.levels &&
            pack.levels.map((level, index) => (
              <div className="col navbar-icon my-auto p-0" key={index}>
                <Tooltip title={getLevelName(level.level)}>
                  <IconButton
                    onClick={() => {
                      handleChangeLevel(level.level);
                    }}
                    size={isMobile ? "small" : "medium"}
                  >
                    <img
                      alt={level.level}
                      className="navbar-img"
                      src={getLevelIcon(levelSelected, level.level)}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            ))}

          {isMobile &&
            pack.levels &&
            pack.levels.map((level, index) => (
              <div className="col navbar-icon my-auto p-0" key={index}>
                <Tooltip title={getLevelName(level.level)}>
                  <IconButton
                    onClick={() => {
                      handleChangeLevel(level.level);
                    }}
                    size={isMobile ? "small" : "medium"}
                  >
                    <img
                      alt={level.level}
                      className="navbar-img"
                      src={getLevelIcon(levelSelected, level.level)}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
