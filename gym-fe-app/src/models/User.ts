export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  token: string;
}

export interface ILoginUser {
  email: string;
  password: string;
  username: string;
}

export interface IHelpEmail {
  name: string;
  email_from: string;
  text: string;
}

export interface IRecivedFeedback {
  token: string;
  critici: string;
  forti: string;
  ese_differenti: string;
  tempistiche_ok: string;
  altro: string;
}

export interface ILoginUsername {
  password: string;
  username: string;
}
export interface ILoginEmail {
  email: string;
  password: string;
}

export interface ISignUser {
  email: string;
  username: string;
  password: string;
  name: string;
  surname: string;
  gender: string;
  bday: string;
}
