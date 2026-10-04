import { Console, debug } from "console";
import {
  LS_ACCESS_TOKEN,
  LS_REFRESH_TOKEN,
  LS_USER,
  LS_USER_TYPE,
  LS_IS_ADMIN,
  LS_IS_COACH,
  LS_IS_CUSTOMER,
} from "../constants/TypeConstants";

export const getStorageValue = (key: string) => {
  const saved = localStorage.getItem(key);
  return saved;
};

export const setLoginLS = (value: any, reload = true) => {
  localStorage.setItem(LS_USER, value.email);
  localStorage.setItem(LS_ACCESS_TOKEN, value.tokens.access);
  localStorage.setItem(LS_REFRESH_TOKEN, value.tokens.refresh);

  if (value.is_admin) {
    localStorage.setItem(LS_USER_TYPE, "admin");
    localStorage.setItem(LS_IS_ADMIN, "yes");
  } else {
    localStorage.setItem(LS_IS_ADMIN, "no");
  }

  if (value.is_coatch) {
    
    localStorage.setItem(LS_USER_TYPE, "coach");
    localStorage.setItem(LS_IS_COACH, "yes");
  } else {
    localStorage.setItem(LS_IS_COACH, "no");
  }
  if (!value.is_coatch && !value.is_admin) {
    localStorage.setItem(LS_USER_TYPE, "user");
  }
  if (value.is_subscription) {
    localStorage.setItem(LS_IS_CUSTOMER, "yes");
  } else {
    localStorage.setItem(LS_IS_CUSTOMER, "no");
  }
  if (reload) window.location.reload();
};

export const setLogoutLS = (reload = true) => {
  localStorage.removeItem(LS_USER);
  localStorage.removeItem(LS_ACCESS_TOKEN);
  localStorage.removeItem(LS_REFRESH_TOKEN);
  localStorage.removeItem(LS_USER_TYPE);
  localStorage.removeItem(LS_IS_ADMIN);
  localStorage.removeItem(LS_IS_COACH);
  localStorage.removeItem(LS_IS_CUSTOMER);
  if (reload) window.location.reload();
};
