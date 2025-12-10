import axios from "axios";
import {
  ACCESS_TOKEN,
  APPLICATION_JSON,
  VIMEO_ACCEPT,
  VIMEO_BASE_URL,
} from "./constants/ApiSettings";

const httpVimeo = axios.create({
  baseURL: VIMEO_BASE_URL,
  headers: {
    "Content-Type": APPLICATION_JSON,
    Accept: VIMEO_ACCEPT,
    Authorization: "Bearer " + ACCESS_TOKEN,
  },
});

export default httpVimeo;
