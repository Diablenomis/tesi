import axios from "axios";
import { APPLICATION_JSON, BASE_URL } from "./constants/ApiSettings";
import { LS_ACCESS_TOKEN, LS_REFRESH_TOKEN } from "./constants/TypeConstants";
import { setLogoutLS } from "./services/LocalStorage";
import UserService from "./services/UserService";

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": APPLICATION_JSON,
  },
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LS_ACCESS_TOKEN);
    if (config.url?.includes("auth/login")) {
      config.headers!["Authorization"] = "";
      delete axios.defaults.headers.common["Authorization"];
    } else {
      if (token) {
        config.headers!["Authorization"] = "Bearer " + token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (!originalConfig.url.includes("auth/login") && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          let refresh = {
            refresh: localStorage.getItem(LS_REFRESH_TOKEN),
          };
          UserService.refreshTokens(refresh)
            .then((response: any) => {
              const accessToken = response.data.access;
              const refreshToken = response.data.refresh;
              localStorage.setItem(LS_ACCESS_TOKEN, accessToken);
              localStorage.setItem(LS_REFRESH_TOKEN, refreshToken);
              return http(originalConfig);
            })
            .catch((e: Error) => {
              setLogoutLS();
            });
        } catch (_error) {
          setLogoutLS();
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  }
);

export default http;
