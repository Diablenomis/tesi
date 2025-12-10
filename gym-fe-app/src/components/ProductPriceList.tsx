import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CartService from "../services/CartService";
import { IProductStripeSer } from "../models/Cart";
import { SUB_TYPES } from "../constants/TypeConstants";
interface Nutrizionista {
  prodRef: string;
  selected: boolean;
}

const ProductPriceList = ({
  handleSelect,
  subType,
}: {
  handleSelect: (
    product_price_id: string,
    nutrizionistaInfo: {
      send: boolean;
      name: string;
      email: string;
    }
  ) => void;
  subType: string;
}) => {
  const [products, setProducts] = useState([]);
  const [nutrizionistaList, setNutrizionistaList] = useState<Nutrizionista[]>(
    []
  );

  useEffect(() => {
    CartService.getAllAbbonamenti()
      .then((response) => {
        let temp = response.data.products;
        temp = temp.filter((prodotto: any) =>
          prodotto.name.startsWith(subType)
        );
        temp = temp.map((prodotto: any) => {
          if (prodotto.name.startsWith(subType)) {
            return {
              ...prodotto,
              name: prodotto.name.replace(subType, ""),
            };
          }
          return prodotto;
        });

        setProducts(temp);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const colors = ["#FFF7EB", "#E2F2FD", "#FFEBEB"];

  useEffect(() => {
    // Crea un array di oggetti nutrizionista iniziali
    const temp: Nutrizionista[] = products.map((prodotto: any) => ({
      prodRef: prodotto.id,
      selected: false,
    }));
    setNutrizionistaList(temp);
  }, [products]);

  const handleCheckboxChange = (prodRef: string) => {
    // Crea una copia dell'array nutrizionistaList in temp
    const temp = [...nutrizionistaList];

    // Modifica l'elemento specifico nella copia
    const updatedList = temp.map((item) =>
      item.prodRef === prodRef ? { ...item, selected: !item.selected } : item
    );

    // Imposta lo stato con la lista aggiornata
    setNutrizionistaList(updatedList);
  };
  return (
    <div className="d-flex col-12 justify-content-evenly flex-wrap pb-50 pt-50">
      {products &&
        products.map((product: any, productIndex) => (
          <div
            className="col-10 col-md-3 subscription-container big-card mb-50 d-flex flex-column justify-content-evenly"
            key={product.id}
          >
            <h2 className="">{product.name}</h2>
            <div className="pack-details text-uppercase fs-14">
              {product.description}
            </div>
            <div
              className="top-banner align-items-center justify-content-evenly d-md-flex"
              style={{ background: colors[productIndex] }}
            >
              <div className="price fw-500">
                <h3 className="m-0 p-3">
                  €{product.prices[0].unit_amount / 100}
                </h3>
              </div>

              {/* <div className="text-align-left">
                <span>Per editor, monthly</span>
                <em className="d-block">
                  €
                  {Math.floor(
                    product.prices[0].unit_amount /
                      100 /
                      product.prices[0].interval_count
                  )}
                </em>
              </div> */}
            </div>
            <div className="col-12 mt-20">
              <input
                type="checkbox"
                checked={
                  nutrizionistaList?.find((item) => item.prodRef === product.id)
                    ?.selected ?? false
                }
                onChange={() => {
                  handleCheckboxChange(product.id);
                }}
              />{" "}
              <b>Voglio ricevere informazioni sui piani nutrizionali (gratuitamente)</b>
            </div>

            {subType === SUB_TYPES.scheda_personalizzata && (
              <ul className="subscription-details mb-4 text-align-left pricing-table-list-ul">
                <li className="subscription-duration text-dark pt-10 pricing-table-list">
                🗸 Piano di allenamento personalizzato dalla durata di{" "}
                  {product.prices[0].interval_count}{" "}
                  {product.prices[0].interval_count > 1 ? "mesi" : "mese"}
                </li>
                <li className="subscription-duration text-dark pt-10 text-align-left pricing-table-list ">
                🗸 Compilazione di un questionario dettagliato per creare il
                  piano di allenamento perfetto per te sulla base di:
                  <div className="col-12 d-flex justify-content-end">
                    <ul
                      className="p-0 m-0"
                      style={{
                        textAlign: "left",
                        width: "90%",
                        listStylePosition: "outside",
                      }}
                    >
                      <li>Obiettivi personali</li>
                      <li>
                        La tua condizione fisica, considerando anche eventuali
                        problemi fisici e infortuni
                      </li>
                      <li>
                        Disponibilità in termini di tempo per l'allenamento
                        settimanale
                      </li>
                      <li>Attrezzatura a disposizione</li>
                    </ul>
                  </div>
                </li>
                <li className="subscription-duration text-dark pt-10 pricing-table-list">
                🗸 Feedback a distanza di una settimana per eventuali migliorie
                </li>

                <li className="subscription-duration text-dark pt-10 pricing-table-list">
                🗸 Feedback a distanza di una settimana per eventuali migliorie
                </li>
                <li className="subscription-duration text-dark pt-10 pricing-table-list">
                🗸 Area personale con accesso permanente dove poter
                  visualizzare le tue schede e i video dimostrativi degli
                  esercizi da svolgere
                </li>
              </ul>
            )}
            {subType === SUB_TYPES.coaching_online && (
              <ul className="subscription-details mb-4 text-align-left pricing-table-list-ul">
                <li className="subscription-duration text-dark pt-10 pricing-table-list">
                🗸 Piano di allenamento personalizzato dalla durata di{" "}
                  {product.prices[0].interval_count}{" "}
                  {product.prices[0].interval_count > 1 ? "mesi" : "mese"}
                </li>
                <li className="subscription-duration text-dark pt-10">
                🗸 Videochiamata conoscitiva per creare il piano di allenamento
                  perfetto per te sulla base di:
                  <div className="col-12 d-flex justify-content-end">
                    <ul
                      className="p-0 m-0"
                      style={{
                        textAlign: "left",
                        width: "80%",
                        listStylePosition: "inside",
                      }}
                    >
                      <li>Obiettivi personali</li>
                      <li>
                        La tua condizione fisica, considerando anche eventuali
                        problemi fisici e infortuni
                      </li>
                      <li>
                        Disponibilità in termini di tempo per l'allenamento
                        settimanale
                      </li>
                      <li>Attrezzatura a disposizione</li>
                    </ul>
                  </div>
                </li>
                <li className="subscription-duration text-dark pt-10">
                🗸 Feedback costante con il coach scelto tramite Whatsapp o
                  Telegram
                </li>

                <li className="subscription-duration text-dark pt-10">
                🗸 Feedback a distanza di una settimana per eventuali migliorie
                </li>
                <li className="subscription-duration text-dark pt-10">
                  🗸 Area personale con accesso permanente dove poter
                  visualizzare le tue schede e i video dimostrativi degli
                  esercizi da svolgere
                </li>
              </ul>
            )}
            <button
              onClick={() =>
                handleSelect(product.prices[0].id, {
                  send:
                  nutrizionistaList?.find((item) => item.prodRef === product.id)
                  ?.selected ?? false,
                  name: "Maurizio Soricen",
                  email: "maurizio@getyourmovement.com",
                })
              }
              className="subscription-price-btn btn btn-primary w-80 py-2 "
              style={{ backgroundColor: "#3bc1c4", borderColor: "#3bc1c4" }}
            >
              Acquista ora
            </button>
          </div>
        ))}
    </div>
  );
};

export default ProductPriceList;
