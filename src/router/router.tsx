import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { ROUTES } from "./routes";
import { AppErrorBoundary, HomePage } from "@/pages";
import SurahPage from "@/pages/SurahPage/SurahPage";
import JuzPage from "@/pages/JuzPage/JuzPage";
import RecitersPage from "@/pages/RecitersPage/RecitersPage";
import ReciterDetailsPage from "@/pages/ReciterDetailsPage/ReciterDetailsPage";
import QuranPage from "@/pages/QuranPage/QuranPage";
import MushafDetailsPage from "@/pages/MushafDetailsPage/MushafDetailsPage";
import MushafSurahPage from "@/pages/MushafSurahPage/MushafSurahPage";
import RadioPage from "@/pages/RadioPage/RadioPage";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <App />,
    errorElement: <AppErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.SURAH, element: <SurahPage /> },
      { path: ROUTES.JUZ, element: <JuzPage /> },
      { path: ROUTES.ABOUT, element: <div className="bg-red-400">About</div> },
      { path: ROUTES.RECITERS, element: <RecitersPage /> },
      { path: ROUTES.RECITER_DETAILS, element: <ReciterDetailsPage /> },
      { path: ROUTES.QURAN, element: <QuranPage /> },
      { path: ROUTES.MUSHAF_DETAILS, element: <MushafDetailsPage /> },
      { path: ROUTES.MUSHAF_SURAH, element: <MushafSurahPage /> },
      { path: ROUTES.RADIO, element: <RadioPage /> },
    ],
  },
]);
