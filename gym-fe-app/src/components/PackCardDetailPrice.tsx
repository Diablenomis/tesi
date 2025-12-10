import {
  Alert,
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
import {
  IPackCardDetailLevels,
  IPackCardDetailPrice,
} from "../models/ComponentInterface";
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
import { IPaymentPack } from "../models/Cart";
import { SignCard } from "./SignCard";
import { useNavigate } from "react-router-dom";
import { PAYMENT_PATH } from "../constants/PathConstants";

export const PackCardDetailPrice: React.FC<IPackCardDetailPrice> = ({
  pack,
  packLevel,
  price,
}) => {
  const [isMessageError, setIsMessageError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isShowSignCard, setIsShowSignCard] = useState<boolean>(false);

  const addPackToCart = () => {
    const user = getStorageValue(LS_USER) || "";
    if (user === "") {
      setIsShowSignCard(true);
    } else {
      buyPack(user);
    }
  };

  const buyPack = (user: string) => {
    let infoPayment: IPaymentPack = {
      payment_method_id: "fake",
      products: [
        {
          title: pack.title,
          gender: packLevel.gender,
          level: packLevel.level,
        },
      ],
    };

    CartService.buyPack(infoPayment)
      .then((response: any) => {
        setIsMessageError(false);
        setMessage("Livello acquistato");
        setTimeout(() => {
          setMessage("");
        }, 4000);
      })
      .catch((e: Error) => {
        console.log(e);
        setIsMessageError(true);
        setMessage(e.message);
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };
  const navigate = useNavigate();
  return (
    <div className="panel levels-panel-style container-fluid p-0 m-0 zoom-in">
      <div className="row no-pm">
        {isMobile && (
          <div className="col levels-title-div my-auto padding-page-half">
            <span className="text-font-big">Acquista</span>
          </div>
        )}
        <div className="col no-pm">
          <span className={isMobile ? "price-span text-font-medium padding-page-field" : "float-right price-span text-font-medium padding-page-field"}>
            {price} €
          </span>
        </div>
        <div className={isMobile ? "col navbar-icon navbar-icon-center my-auto p-0" : "col navbar-icon navbar-icon-center my-auto p-0 float-right"}>
          <Tooltip title="Acquista">
            <IconButton
              onClick={() => {
                // addPackToCart();
                navigate(PAYMENT_PATH)
              }}
              size={isMobile ? "small" : "medium"}
            >
              <img className="navbar-img" src={CartIcon} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      {message !== "" && (
        <Alert
          className="alert-position-top"
          severity={isMessageError ? "error" : "success"}
        >
          {message}
        </Alert>
      )}
      <SignCard
        show={isShowSignCard}
        onHide={() => setIsShowSignCard(false)}
      ></SignCard>
    </div>
  );
};
