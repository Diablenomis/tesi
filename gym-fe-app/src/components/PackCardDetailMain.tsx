import { IconButton } from "@mui/material";
import { isMobile } from "react-device-detect";
import { IPackCardDetailMain } from "../models/ComponentInterface";
import { getBodyPartIcon } from "../services/PackLevelService";

export const PackCardDetailMain: React.FC<IPackCardDetailMain> = ({ pack }) => {
  return (
    <div className="panel big-card col-12 m-auto p-0 relative zoom-in">
      <div className="col-12 m-0 p-0 padding-page mb-3">
        <div className="col-10 m-auto text-align-center info-card-title mt-3 default-info-title">
          {/* <IconButton size={isMobile ? "small" : "medium"} disabled className="icon-title">
            <img
              className="navbar-img"
              alt={pack.icon}
              src={getBodyPartIcon(pack.icon, pack.icon)}
            />
          </IconButton> */}
          <div className="description-title">{pack.title}</div>
          <div>{pack.title_description}</div>
        </div>
        <div className="col-lg-7 col-md-9 col-sm-10 col-10 m-auto p-0 text-align-center info-card-title mt-3">
          {pack.description}
        </div>
      </div>
    </div>
  );
};
