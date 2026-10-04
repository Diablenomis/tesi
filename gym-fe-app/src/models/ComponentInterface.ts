import { IPackPreview, IPackDetail, IPackCart, IPackLevel } from "./Pack";

export interface IHomePageCard {
  type: string;
}

export interface INavBar {
  page: string;
}

export interface IPackCard {
  pack: IPackPreview;
  page: string;
}

export interface IPackCardDetailMain {
  pack: IPackDetail;
}

export interface IPackCardDetailLevels {
  pack: IPackDetail;
  levelSelected: string;
  price: string;
  page: string;
  changeLevel: (levelSelected: string) => void;
}

export interface IPackCardDetailPrice {
  pack: IPackDetail;
  price: string;
  packLevel: IPackLevel;
}

export interface IPackCardDetailLevel {
  packLevel: IPackLevel;
  page?: string;
}

export interface ICartPackCard {
  pack: IPackCart;
}

export interface ISignCard {
  show: boolean;
  onHide: () => void;
  onAuthenticated?: (email: string) => void;
}

export interface ICoachModalCard {
  show: boolean;
  coachEmail: string;
  onHide: () => void;
}

export interface IAlertSignModalCard {
  show: boolean;
  onHide: () => void;
}

export interface IFormUserCard {
  step: number;
  userForm: { question: string; answer: string }[];
  handleSelectOption: (question: string, answer: string) => void;
  handleChangeStep: (event: React.ChangeEvent<unknown>, value: number) => void;
  sendForm: () => void;
}
