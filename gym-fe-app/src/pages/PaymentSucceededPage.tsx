import { Link } from "react-router-dom";
import DefaulHeader from "../components/DefaultHeader";
import { Footer } from "../components/Footer";

const PaymentSucceededPage: React.FC = () => {
  return (
    <>
      <DefaulHeader></DefaulHeader>
      <div className="row col-12 text-align-center center mt-150">
        <p className="text-lg tx-dark mt-45 lg-mt-30 lg-mb-40">
          Pagamento effettuato
        </p>
        <div className=" m-auto">
          <Link
            to="/"
            className="btn-twentyOne fw-500 "
          >
            Homepage
          </Link>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default PaymentSucceededPage;
