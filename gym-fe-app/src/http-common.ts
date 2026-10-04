import axios from "axios";
import { APPLICATION_JSON, BASE_URL } from "./constants/ApiSettings";
import { LS_ACCESS_TOKEN, LS_REFRESH_TOKEN } from "./constants/TypeConstants";
import { setLogoutLS } from "./services/LocalStorage";

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": APPLICATION_JSON,
  },
});

let pendingRefresh: Promise<string> | null = null;

const refreshAccessToken = () => {
  if (!pendingRefresh) {
    pendingRefresh = (async () => {
      const refresh = localStorage.getItem(LS_REFRESH_TOKEN);
      if (!refresh) throw new Error("Sessione scaduta");
      // A separate request prevents a rejected refresh from refreshing itself.
      const response = await axios.post(`${BASE_URL}auth/token/refresh/`, { refresh });
      const { access, refresh: rotatedRefresh } = response.data;
      if (!access) throw new Error("Risposta di rinnovo non valida");
      localStorage.setItem(LS_ACCESS_TOKEN, access);
      // SimpleJWT normally returns only the access token.
      if (rotatedRefresh) localStorage.setItem(LS_REFRESH_TOKEN, rotatedRefresh);
      return access as string;
    })().finally(() => { pendingRefresh = null; });
  }
  return pendingRefresh;
};

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LS_ACCESS_TOKEN);
    if (config.url?.includes("auth/login") || config.url?.includes("auth/token/refresh")) {
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
    if (originalConfig && !originalConfig.url?.includes("auth/login") &&
        !originalConfig.url?.includes("auth/token/refresh") && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          await refreshAccessToken();
        } catch (refreshError: any) {
          if (!localStorage.getItem(LS_REFRESH_TOKEN) || refreshError.response?.status === 401) {
            // Let the page offer login while retaining the user's in-memory work.
            setLogoutLS(false);
            return Promise.reject(err);
          }
          return Promise.reject(refreshError);
        }
        return http(originalConfig);
      }
    }
    return Promise.reject(err);
  }
);

export default http;
