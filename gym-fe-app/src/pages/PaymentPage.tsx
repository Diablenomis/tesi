import { loadStripe } from "@stripe/stripe-js";

import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import PaymentForm from "../components/PaymentForm";
import { useEffect, useState } from "react";
import CartService from "../services/CartService";
import ProductPriceList from "../components/ProductPriceList";
import PaymentSucceededPage from "./PaymentSucceededPage";
import DefaulHeader from "../components/DefaultHeader";
import { Footer } from "../components/Footer";
import { SUB_TYPES } from "../constants/TypeConstants";
import { useLocation } from "react-router-dom";
import Pricing from "../components/Pricing";
import UserService from "../services/UserService";

const stripePromise = loadStripe(
  "pk_test_51ScYghACR9X4275ewckZ3SM1CZv62ULCamVgtjNr9bcypUDitalHzyibjKHhHjTBwQFE8gdGUj9SgurolDvbRC3X00gfhJA6rR"
);

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const { subType } = location.state || {};
  const [product_price_id, setProduct_price_id] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    if (product_price_id !== "") {
      let body = {
        product_price_id,
      };
      CartService.getClientSecret(body)
        .then((response) => {
          setSessionId(response.data.client_secret);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [product_price_id]);

  useEffect(() => {
    if (sessionId !== "") {
      stripeCheckout();
    }
  }, [sessionId]);

  const stripeCheckout = async () => {
    const stripe = await stripePromise;
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });
      if (error) {
        console.error("Error redirecting to Stripe Checkout", error);
      }
    } else {
      console.error("Stripe not loaded properly");
    }
  };

  return (
    <>
      <DefaulHeader></DefaulHeader>
      <div className="fancy-feature-thirtyEight mt-180 lg-mt-120">
        <ProductPriceList
          handleSelect={(product_price_id: string, nutrizionistaInfo: any) => {
            if (nutrizionistaInfo.send) {
              UserService.selectNutrizionista(
                nutrizionistaInfo.name,
                nutrizionistaInfo.email
              );
            }
            setProduct_price_id(product_price_id);
          }}
          subType={subType}
        ></ProductPriceList>
        {/* <Pricing></Pricing> */}
      </div>
      <Footer></Footer>
    </>
  );
};

export default PaymentPage;
