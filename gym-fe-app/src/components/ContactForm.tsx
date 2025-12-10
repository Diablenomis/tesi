import { useState } from "react";
import UserService from "../services/UserService";
import { IHelpEmail } from "../models/User";
import { Alert } from "@mui/material";

const ContactForm = () => {
  const [formData, setFormData] = useState<IHelpEmail>({
    name: "",
    email_from: "",
    text: "",
  });

  const [message, setMessage] = useState("");
  const [isMessageError, setIsMessageError] = useState(false);
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    UserService.helpEmail(formData)
      .then((response) => {
        setMessage("Abbiamo ricevuto la tua richiesta, ti contatteremo presto");
        console.groupCollapsed(response.data);
        let temp = {
          name: "",
          email_from: "",
          text: "",
        };
        setFormData(temp);
      })
      .catch((e) => {
        setIsMessageError(true);
        setMessage("C'è stato un errore, riprova tra qualche minuto");
        console.log(e.error);
        setTimeout(() => {
          setMessage("");
        }, 4000);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      {message !== "" && (
        <Alert
          className="alert-position-top"
          severity={isMessageError ? "error" : "success"}
        >
          {message}
        </Alert>
      )}
      <div className="messages" />
      <div className="row controls">
        <div className="col-12">
          <div className="input-group-meta form-group mb-20">
            <input
              type="text"
              placeholder="Your name*"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <div className="help-block with-errors" />
          </div>
        </div>
        {/* End .col-12 */}

        <div className="col-12">
          <div className="input-group-meta form-group mb-20">
            <input
              type="email"
              placeholder="Email*"
              name="email_from"
              value={formData.email_from}
              onChange={handleChange}
              required
            />
            <div className="help-block with-errors" />
          </div>
        </div>
        {/* End .col-12 */}

        <div className="col-12">
          <div className="input-group-meta form-group mb-15">
            <textarea
              placeholder="Your message*"
              name="text"
              value={formData.text}
              onChange={handleChange}
              required
            />
            <div className="help-block with-errors" />
          </div>
        </div>
        {/* End .col-12 */}

        <div className="col-12">
          <button
            type="submit"
            className="btn-twentyTwo w-100 fw-500 tran3s text-uppercase"
          >
            INVIA EMAIL
          </button>
        </div>
        {/* End .col-12 */}
      </div>
      {/* End .row */}
    </form>
  );
};

export default ContactForm;
