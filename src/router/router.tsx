import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { HomePage } from "../pages/HomePage";
import { ROUTES } from "./routes";
import SurahPage from "../pages/SurahPage/SurahPage";
import JuzPage from "../pages/JuzPage/JuzPage";
import RecitersPage from "../pages/RecitersPage/RecitersPage";
import { AppErrorBoundary } from "../pages/AppErrorBoundary/AppErrorBoundary";
import ReciterDetailsPage from "../pages/ReciterDetailsPage/ReciterDetailsPage";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <App />,
    errorElement: <AppErrorBoundary />, // ✅ This wraps errors with header/footer
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.SURAH, element: <SurahPage /> },
      { path: ROUTES.JUZ, element: <JuzPage /> },
      { path: ROUTES.ABOUT, element: <div className="bg-red-400">About</div> },
      { path: ROUTES.RECITERS, element: <RecitersPage /> },
      { path: ROUTES.RECITER_DETAILS, element: <ReciterDetailsPage /> },
    ],
  },
]);
