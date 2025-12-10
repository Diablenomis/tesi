import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import { Alert, CircularProgress } from "@mui/material";
import { useState } from "react";

const paypalScriptOptions: PayPalScriptOptions = {
  "client-id":
    "AUwpgXVQMW0BHSMwenpDD3ZgdVyVHGsoIHKuzu5l4e9HlRHwmRn08JULC7Jxhc8KDCfTym8RaENlFPy9",
  currency: "EUR",
};

const ButtonPayPal = () => {
  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();
  const [message, setMessage] = useState<string>("");
  const [isMessageError, setIsMessageError] = useState<boolean>(false);

  const paypalbuttonTransactionProps: PayPalButtonsComponentProps = {
    style: { layout: "vertical", color: "blue" },
    createOrder(data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: "0.01",
            },
          },
        ],
      });
    },
    onApprove(data, actions) {
      /**
       * data: {
       *   orderID: string;
       *   payerID: string;
       *   paymentID: string | null;
       *   billingToken: string | null;
       *   facilitatorAccesstoken: string;
       * }
       */
      return actions.order!.capture().then((details) => {
        // TODO api for adding level pack to user
        addPackLevelToUser();
      });
    },
    onError(err) {
      console.error(err);
      setIsMessageError(true);
      setMessage("Errore durante il pagamento");
      setTimeout(() => {
        setMessage("");
      }, 4000);
    },
  };

  const addPackLevelToUser = () => {
    setIsMessageError(false);
    setMessage("Scheda acquistata correttamente");
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <>
      {isPending && <CircularProgress style={{ color: "#192b3f" }} />}
      {isResolved && <PayPalButtons {...paypalbuttonTransactionProps} />}
      {isRejected && (
        <span>
          Errore con il servizio di pagamento. <br></br>Invitiamo a riprovare.
        </span>
      )}
      {message !== "" && (
        <Alert
          className="alert-position-top"
          severity={isMessageError ? "error" : "success"}
        >
          {message}
        </Alert>
      )}
    </>
  );
};

export const PaymentCard: React.FC = () => {
  return (
    <div className="cart-pack-padding m-0 col-12 payment-card row">
      <PayPalScriptProvider options={paypalScriptOptions}>
        <ButtonPayPal />
      </PayPalScriptProvider>
    </div>
  );
};
