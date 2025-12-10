import { useEffect, useState } from "react";
import UserService from "../services/UserService";
import { Footer } from "../components/Footer";
import DefaulHeader from "../components/DefaultHeader";
import styled from "@emotion/styled";
import { Button, ButtonProps } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const CheckEmailPage: React.FC = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const token = urlParams.get("token");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    checkEmail();
  }, []);

  const checkEmail = () => {
    if (token !== null) {
      UserService.checkEmail(token)
        .then((response) => {
          setMessage(response.data);
        })
        .catch((e: any) => {
          setMessage(e.response.data.error);
        });
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

  const navigate = useNavigate();
  return (
    <>
      <div className="schede-tutorial-panel col-12 m-0 text-align-center">
        <DefaulHeader></DefaulHeader>
        <div className="col-12 mt-300 mb-300">
          <h3 className="text-align-center">Email verificata con successo</h3>
          <div className="col-12 d-flex justify-content-center">
            <ColoredButton
              className="button-size-delete button-font-size-delete"
              onClick={() => {
                navigate("/");
              }}
            >
              Torna alla home
            </ColoredButton>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </>
  );
};

export default CheckEmailPage;
