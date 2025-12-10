import React, { useEffect, useState } from "react";
import {
  CardCvcElement,
  CardElement,
  CardExpiryElement,
  CardNumberElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import CartService from "../services/CartService";
import { IPaymentPack } from "../models/Cart";
import { initialIPaymentPack } from "../constants/InitialEntities";
import styled from "@emotion/styled";
import { Button, ButtonProps } from "react-bootstrap";

import { LS_USER } from "../constants/TypeConstants";
import "../assets/css/paymentForm.css";
import { Alert, TextField } from "@mui/material";

const PaymentForm: React.FC = () => {
  const [infoPayments, setInfoPayments] =
    useState<IPaymentPack>(initialIPaymentPack);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>(LS_USER);
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [cost, setCost] = useState<number>(150);
  const [originalCost, setOriginalCost] = useState<number>(150);
  const [discount, setDiscount] = useState<number>(0);
  const [isDiscountPercentual, setIsDiscountPercentual] =
    useState<boolean>(false);
  const [isSelectingCode, setIsSelectingCode] = useState<null | boolean>(false);
  const [code, setCode] = useState<string>("");
  const [isCodeValid, setIsCodeValid] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isMessageError, setIsMessageError] = useState<boolean>(false);

  // useEffect(() => {
  //   if (infoPayments.payment_method_id !== "") {
  //     CartService.buyPackPers(infoPayments)
  //       .then((response) => {
  //         console.log(response);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // }, [infoPayments]);
  useEffect(() => {
    setCost(
      isDiscountPercentual ? cost - (cost * discount) / 100 : cost - discount
    );
  }, [discount]);
  const stripe = useStripe();
  const elements = useElements();

  const handleCodeInput = (event: any) => {
    let newCode = event.target.value;
    setCode(newCode);
  };
  const handleSelectCode = () => {
    CartService.getCode(code)

      .then((response: any) => {
        setIsSelectingCode(null);
        let code = response.data.data;
        setDiscount(Number(code.sconto));
        setIsDiscountPercentual(code.percentuale);

        setIsMessageError(false);
        setMessage("Codice sconto utilizzato con successo");
        setTimeout(() => {
          setMessage("");
        }, 4000);
      })
      .catch((error: any) => {
        setIsSelectingCode(false);
        console.log(error);
        setIsMessageError(true);
        setMessage("Errore nell'utilizzo del codice");
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };
  // Handle form submission.
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return null;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  const ColoredButton = styled(Button)<ButtonProps>(({ theme }) => ({
    backgroundColor: "#a6ce24",
    color: "#ffffff",
    fontWeight: 400,
    "&:hover": {
      color: "#ffffff",
      backgroundColor: "#192b3f",
    },
  }));

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      {message !== "" && (
        <Alert
          className="alert-position-top"
          severity={isMessageError ? "error" : "success"}
        >
          {message}
        </Alert>
      )}
      <div className="col-8 mx-auto">
        <div className="row g-4">
          {/* <div className="col-md-6">
            <span>Payment Method</span>
            <div className="card">
              <div className="accordion" id="accordionExample">
                <div className="card">
                  <div
                    id="collapseTwo"
                    className="collapse"
                    aria-labelledby="headingTwo"
                    data-parent="#accordionExample"
                  >
                    <div className="card-body">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Paypal email"
                      />
                    </div>
                  </div>
                </div>

                <div className="card ">
                  <div className="card-header p-0">
                    <button
                      className="btn btn-light full-width btn-block text-left p-3 rounded-0"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <span>Credit card</span>
                        <div className="icons flex">
                          <img
                            src="https://i.imgur.com/2ISgYja.png"
                            width="30"
                          />
                          <img
                            src="https://i.imgur.com/W1vtnOV.png"
                            width="30"
                          />
                          <img
                            src="https://i.imgur.com/35tC99g.png"
                            width="30"
                          />
                          <img
                            src="https://i.imgur.com/2ISgYja.png"
                            width="30"
                          />
                        </div>
                      </div>
                    </button>
                  </div>

                  <div
                    id="collapseOne"
                    className="collapse show p-3"
                    aria-labelledby="headingOne"
                    data-parent="#accordionExample"
                  >
                    <CardElement
                      id="card-element"
                      onChange={handleChange}
                      options={CARD_ELEMENT_OPTIONS}
                    />
                    
                    <div className="card-errors" role="alert">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

            <PaymentElement></PaymentElement>
          <div className="col-md-6">
            <span>Summary</span>

            <div className="card">
              {/* <div className="d-flex justify-content-between p-3">
                <div className="d-flex flex-column">
                  <span>Costo iniziale</span>
                </div>

                <div className="mt-1">
                  <sup className="super-price">{cost} €</sup>
                </div>
              </div>

              <hr className="mt-0 line" /> */}

              {/* <div className="p-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Coupon applicato</span>
                  {isDiscountPercentual ? (
                    <span>- {discount}%</span>
                  ) : (
                    <span>- {discount}€</span>
                  )}
                </div>

                <div className="d-flex justify-content-between">
                  <span>Sconto applicato</span>
                  <span>
                    -{" "}
                    {isDiscountPercentual
                      ? (originalCost * discount) / 100
                      : discount}{" "}
                    €
                  </span>
                </div>
              </div> */}

              <hr className="mt-0 line" />

              <div className="p-3 d-flex justify-content-between">
                <div className="d-flex flex-column">
                  <span>Costo finale</span>
                </div>
                <span>{cost} €</span>
              </div>

              <div className="p-3 text-center">
                {/* <div>
                  {isSelectingCode === false && (
                    <ColoredButton
                      onClick={() => {
                        setIsSelectingCode(true);
                      }}
                      className="submit-btn mx-auto"
                    >
                      Have a promo code?
                    </ColoredButton>
                  )}
                  <br />
                  {isSelectingCode && (
                    <div className="text-center">
                      <TextField
                        className="col-11"
                        label="Codice sconto"
                        size="small"
                        onChange={handleCodeInput}
                        name="code"
                      />
                      <ColoredButton
                        onClick={() => {
                          handleSelectCode();
                        }}
                        className="submit-btn mx-auto mt-1"
                      >
                        Use the promo code
                      </ColoredButton>
                    </div>
                  )}
                </div> */}
                <br />
                <ColoredButton disabled={!stripe} type="submit" className="submit-btn mx-auto">
                  Submit Payment
                </ColoredButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    
  );
};

export default PaymentForm;
