import { Link } from "react-router-dom";
import { SERVICES_DETAILS_PATH } from "../constants/PathConstants";
import React from "react";
const accordionItems = [
  {
    id: 1,
    title: "Schede personalizzate",
    content:
      "Sono programmi d'allenamento su misura, progettati attentamente per adattarsi ai tuoi obiettivi di fitness e al tuo livello attuale di forma fisica.",
  },
  {
    id: 2,
    title: "Coaching online",
    content:
      "Con il nostro coaching online, ottieni un piano di allenamento personalizzato della durata di 5 settimane, adattato completamente alle tue esigenze e obiettivi di fitness, con la possibilità di scegliere il personal trainer e ricevere un costante supporto tramite WhatsApp.",
  },
  // {
  //   id: 3,
  //   title: "Schede tutorial - COMING SOON",
  //   content:
  //     "Sono schede preimpostate per aiutarti a raggiungere un obiettivo specifico. Ogni scheda è divisa in vari livelli di difficoltà, dal più semplice al più complesso, da scegliere in base al tuo livello attuale. ",
  // },
];

const Faq = () => {
  const [parSelected, setParSelected] = React.useState(0);
  return (
    <div className="accordion accordion-style-two md-mt-60" id="accordionOne">
      {accordionItems.map((item) => (
        <div className="accordion-item" key={item.id}>
          <div className="accordion-header" id={`heading${item.id}`}>
            <button
              className={`accordion-button ${item.id === parSelected ? "" : "collapsed"}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse${item.id}`}
              aria-expanded={item.id === parSelected ? "true" : "false"}
              aria-controls={`collapse${item.id}`}
              id="modifiche"
              onClick={() => {
                if (item.id != parSelected) {
                  setParSelected(item.id);
                } else {
                  setParSelected(0);
                }
              }}
            >
              {item.title}
            </button>
          </div>
          <div
            id={`collapse${item.id}`}
            className={`accordion-collapse collapse${
              item.id === parSelected ? " show" : ""
            }`}
            aria-labelledby={`heading${item.id}`}
            data-bs-parent="#accordionOne"
          >
            <div className="accordion-body">
              <p>{item.content}</p>
              <Link
                to={`${SERVICES_DETAILS_PATH}#${item.id}`}
                className="fw-500 tran3s"
              >
                Scopri di più
                <i className="fa-solid fa-angle-right" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Faq;
