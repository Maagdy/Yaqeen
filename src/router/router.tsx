import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { HomePage } from "../pages/HomePage";
import SurahPage from "../pages/SurahPage/SurahPage";
import { ROUTES } from "./routes";
import JuzPage from "../pages/JuzPage/JuzPage";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.SURAH, element: <SurahPage /> },
      { path: ROUTES.JUZ, element: <JuzPage /> },
      { path: ROUTES.ABOUT, element: <div className="bg-red-400">About</div> },
    ],
  },
]);
