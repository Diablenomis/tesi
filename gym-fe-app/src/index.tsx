import "./index.css";
import "./assets/css/theme.css";
import "./assets/css/media.scss";
import '@fontsource/public-sans';
import 'animate.css';

import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
