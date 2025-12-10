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
        const prodotti = response.data.products ?? [];
        const normalizedSubType = subType.replace(/-/g, "_");
        const prodottiFiltrati = prodotti.filter((prodotto: any) => {
          const normalizedName = (prodotto.name || "").replace(/-/g, "_");
          return normalizedName.startsWith(normalizedSubType);
        });
        const prodottiPerPrezzo = prodottiFiltrati.flatMap((prodotto: any) => {
          const nomeSenzaPrefix = prodotto.name
            .replace(`${subType}_`, "")
            .replace(`${subType}-`, "")
            .replace(subType, "")
            .replace(`${normalizedSubType}_`, "")
            .replace(`${normalizedSubType}-`, "")
            .replace(normalizedSubType, "");
          return (prodotto.prices || []).map((price: any) => ({
            ...prodotto,
            name: `${(nomeSenzaPrefix || prodotto.name).trim()} ${price.interval_count} ${
              price.interval === "month"
                ? price.interval_count > 1
                ? "mesi"
                : "mese"
                : price.interval
            }`.trim(),
            price,
          }));
        });

        setProducts(prodottiPerPrezzo);
        console.log(prodottiPerPrezzo);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [subType]);
  const colors = ["#FFF7EB", "#E2F2FD", "#FFEBEB"];

  useEffect(() => {
    // Crea un array di oggetti nutrizionista iniziali
    const temp: Nutrizionista[] = products.map((prodotto: any) => ({
      prodRef: prodotto.price?.id || prodotto.id,
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
            key={`${product.id}-${product.price?.id ?? productIndex}`}
          >
            <h4 className="">{product.name}</h4>
            <div className="pack-details text-uppercase fs-14">
              {product.description}
            </div>
            <div
              className="top-banner align-items-center justify-content-evenly d-md-flex"
              style={{ background: colors[productIndex] }}
            >
              <div className="price fw-500">
                <h3 className="m-0 p-3">
                  €{product.price.unit_amount / 100}
                </h3>
              </div>

              {/* <div className="text-align-left">
                <span>Per editor, monthly</span>
                <em className="d-block">
                  €
                  {Math.floor(
                    product.price.unit_amount /
                      100 /
                      product.price.interval_count
                  )}
                </em>
              </div> */}
            </div>
            <div className="col-12 mt-20">
              <input
                type="checkbox"
                checked={
                  nutrizionistaList?.find(
                    (item) => item.prodRef === (product.price?.id || product.id)
                  )
                    ?.selected ?? false
                }
                onChange={() => {
                  handleCheckboxChange(product.price?.id || product.id);
                }}
              />{" "}
              <b>Voglio ricevere informazioni sui piani nutrizionali (gratuitamente)</b>
            </div>

            {subType === SUB_TYPES.scheda_personalizzata && (
              <ul className="subscription-details mb-4 text-align-left pricing-table-list-ul">
                <li className="subscription-duration text-dark pt-10 pricing-table-list">
                🗸 Piano di allenamento personalizzato dalla durata di{" "}
                  {product.price.interval_count}{" "}
                  {product.price.interval_count > 1 ? "mesi" : "mese"}
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
                  {product.price.interval_count}{" "}
                  {product.price.interval_count > 1 ? "mesi" : "mese"}
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
                handleSelect(product.price.id, {
                  send:
                  nutrizionistaList?.find(
                    (item) => item.prodRef === (product.price?.id || product.id)
                  )?.selected ?? false,
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
