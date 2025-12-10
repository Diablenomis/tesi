import http from "../http-common";
import {
  ILoginEmail,
  ILoginUser,
  ILoginUsername,
  ISignUser,
  IUser,
  IRecivedFeedback,
  IHelpEmail,
} from "../models/User";

const getUser = (username: string, password: string) => {
  return http.get<IUser>("user/");
};

const helpEmail = (emailContent: IHelpEmail) => {
  return http.post<any>("generic/help-email/", emailContent);
};

const logInUsername = (user: ILoginUsername) => {
  return http.post<any>("auth/login/", user);
};
const logInEmail = (user: ILoginEmail) => {
  return http.post<any>("auth/login/", user);
};

const signUpUserVerify = (email: string, username: string) => {
  return http.get<any>(
    "/auth/register-verify/?email=" + email + "&username=" + username
  );
};

const signUpUser = (user: ISignUser) => {
  return http.post<any>("auth/register/", user);
};

const checkEmail = (token: string) => {
  return http.get<any>("auth/email-verify/?token=" + token);
};

const feedbackWithToken = (feedbackWithToken: IRecivedFeedback) => {
  return http.post<any>("personal/feedback/", feedbackWithToken);
};

const verifyFeedbackToken = (token: string) => {
  return http.get<any>("/personal/feedback/?token=" + token);
};

const refreshTokens = (token: any) => {
  return http.post<any>("auth/token/refresh/", token);
};

const resetPsw = (email: string) => {
  let data = {
    email,
    redirect_url: "http://localhost/",
  };
  return http.post<any>("auth/request-reset-email/", data);
};

const selectCoach = (coach_email: string) => {
  return http.post<any>("/coaching-online/choise-coach/", {
    coach_email: coach_email,
  });
};
const selectNutrizionista = (name: string, email: string) => {
  return http.post<any>("/nutrizionist/choise-nutrizionist/", {
    nutritionist_email: email,
    name: name,
  });
};

const verifyTokenResetPsw = (uidb64: string, token: string) => {
  return http.get<any>("auth/reset-password/" + uidb64 + "/" + token + "/");
};

const resetPswComplete = (dataForm: any) => {
  return http.post<any>("auth/password-reset-complete/", dataForm);
};

const UserService = {
  getUser,
  signUpUser,
  selectNutrizionista,
  checkEmail,
  logInUsername,
  logInEmail,
  refreshTokens,
  resetPsw,
  verifyTokenResetPsw,
  resetPswComplete,
  feedbackWithToken,
  signUpUserVerify,
  helpEmail,
  selectCoach,
  verifyFeedbackToken,
};

export default UserService;
