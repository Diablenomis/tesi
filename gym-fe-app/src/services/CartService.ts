import http from "../http-common";
import {
  ICart,
  ICodScontoSer,
  IPaymentPack,
  IProductStripeSer,
} from "../models/Cart";

const getCartByUserId = (idUser: number) => {
  return http.get<ICart>("cart/" + idUser + "/");
};

const addToCartByUserId = (idPack: number, idUser: number) => {
  return http.post<ICart>("user/" + idUser + "/pack/" + idPack + "/");
};

const buyPack = (infoPayments: IPaymentPack) => {
  return http.post<any>("payments/schede-tutorial/", infoPayments);
};

const buyPackPers = (infoPayments: IPaymentPack) => {
  return http.post<any>("payments/scheda-personalizzata/", infoPayments);
};

const getCode = (id: string) => {
  return http.get<any>("payments/sconti/" + id);
};

const createCode = (codice: ICodScontoSer) => {
  return http.post<any>("payments/sconti/", codice);
};

const createAbbonamento = (abbonamento: IProductStripeSer) => {
  return http.post<any>("payments/abbonamenti/", abbonamento);
};

const editCode = (nomeCodice: string, codice: ICodScontoSer) => {
  return http.put<any>("payments/sconti/" + nomeCodice + "/", codice );
};

const editAbbonamento = (name: string, abbonamento: IProductStripeSer) => {
  return http.put<any>("payments/abbonamenti/" + name + "/", abbonamento);
};

const deleteAbbonamento = (name: string) => {
  return http.delete<any>("payments/abbonamenti/" + name + "/");
};

const getAllCodes = () => {
  return http.get<any>("/payments/sconti/");
};

const getAllAbbonamenti = () => {
  return http.get<any>("/payments/abbonamenti/");
};

const getClientSecret = (product_price_id: any) => {
  return http.post<any>("/payments/create-checkout-session/", product_price_id);
};

const setCancelSub = () => {
  return http.post<any>("/payments/create-customer-portal-session/",{});
};

const CartService = {
  getCartByUserId,
  addToCartByUserId,
  buyPack,
  createCode,
  getAllCodes,
  editCode,
  buyPackPers,
  createAbbonamento,
  getAllAbbonamenti,
  editAbbonamento,
  deleteAbbonamento,
  getCode,
  getClientSecret,
  setCancelSub
};

export default CartService;
