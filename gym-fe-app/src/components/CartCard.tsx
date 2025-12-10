import { Alert, CircularProgress } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { initialCart } from "../constants/InitialEntities";
import { LS_USER } from "../constants/TypeConstants";
import { ICart } from "../models/Cart";
import { ICoach } from "../models/Coach";
import { IPackCart } from "../models/Pack";
import CartService from "../services/CartService";
import { getStorageValue } from "../services/LocalStorage";
import { CartPackCard } from "./CartPackCard";
import CheckoutForm from "./CheckoutForm";
import { PaymentCard } from "./PaymentCard";

export const CartCard: React.FC = () => {
  const [isCartEmpty, setIsCartEmpty] = useState<boolean>(true);
  const [cart, setCart] = useState<ICart>(initialCart);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isMessageError, setIsMessageError] = useState<boolean>(false);
  const stripePromise = loadStripe("pk_test_");

  useEffect(() => {
    getCart();
  }, []);

  const getCart = () => {
    setIsLoading(true);
    const user = getStorageValue(LS_USER);
    // CartService.getCartByUserId(user.id)
    //   .then((response: any) => {
    //     setCart(response.data);
    //     setIsLoading(false);
    //   })
    //   .catch((e: Error) => {
    //     setIsMessageError(true);
    //     setMessage(e.message);
    //     setIsLoading(false);
    //     setTimeout(() => {
    //       setMessage("");
    //     }, 4000);
    //   });
    setIsLoading(false);
  };

  return (
    <div className="panel big-card col-12 m-0 p-0 row">
      {isLoading ? (
        <div className="col-12 text-align-center m-0 p-0 mt-4 mb-4">
          <CircularProgress />
        </div>
      ) : (
        <div className="col-12 no-pm row">
          <div className="col-lg-8 col-md-12 m-0 mt-2 pt-3 pb-4 row cart-card-padding">
            <div className="col-12 no-pm">
              <span className="cart-card-title">CARRELLO</span>
            </div>
            <div className="col-12 m-0 p-0 mt-3">
              {cart.packs.length > 0 ? (
                cart.packs &&
                cart.packs.map((pack, index) => (
                  <div className="col-12 m-0 p-0 mt-2" key={index}>
                    <CartPackCard pack={pack}></CartPackCard>
                  </div>
                ))
              ) : (
                <span>NO VALUES</span>
              )}
            </div>
          </div>

          <div className="col-lg-4 col-md-12 m-0 mt-2 pt-3 pb-4 row cart-card-padding">
            <div className="col-12 m-0 p-0">
              <PaymentCard></PaymentCard>
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            </div>
          </div>
        </div>
      )}

      {message !== "" && (
        <Alert
          className="alert-position-top"
          severity={isMessageError ? "error" : "success"}
        >
          {message}
        </Alert>
      )}
    </div>
  );
};
