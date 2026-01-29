import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { HomePage } from "../pages/HomePage";
import SurahPage from "../pages/SurahPage/SurahPage";
import { ROUTES } from "./routes";
import JuzPage from "../pages/JuzPage/JuzPage";
import { juzPageLoader } from "../pages/JuzPage/JuzPage.loader";
import { surahPageLoader } from "../pages/SurahPage/SurahPage.loader";
import { RouteError } from "../components/common/route-error/route-error";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: ROUTES.SURAH,
        element: <SurahPage />,
        loader: surahPageLoader,
        errorElement: <RouteError />,
      },
      {
        path: ROUTES.JUZ,
        element: <JuzPage />,
        loader: juzPageLoader,
        errorElement: <RouteError />,
      },
      { path: ROUTES.ABOUT, element: <div className="bg-red-400">About</div> },
    ],
  },
]);
