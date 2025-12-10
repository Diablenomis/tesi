import { IPackCart } from "./Pack";

export interface ICart {
  id: number;
  userId: number;
  packs: IPackCart[];
  totalPrice: number;
}

export interface IPaymentPack {
  payment_method_id: string;
  products: IProductSer[];
}

export interface IProductStripeSer {
  nome:string,
  prezzo:number,
  conto_mesi:number
}

export interface ICodScontoSer
{
  codice?:string,
  sconto: string,
  percentuale:boolean,
  inizioValidita:string,
  fineValidita:string,
  massimoUsi:number
}

export interface IProductSer {
  title: string;
  level: string;
  gender: string;
}
