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
import { AuthPage } from "@/pages/AuthPage";
import SearchPage from "@/pages/SearchPage/SearchPage";
import ProfilePage from "@/pages/ProfilePage/ProfilePage";
import HadithsPage from "@/pages/HadithsPage/HadithsPage";
import HadithDetailsPage from "@/pages/HadithDetailsPage/HadithDetailsPage";
import FavoritesPage from "@/pages/FavoritesPage/FavoritesPage";
import PrayerTimesPage from "@/pages/PrayerTimesPage/PrayerTimesPage";
import AzkarPage from "@/pages/AzkarPage/AzkarPage";
import AboutPage from "@/pages/AboutPage/AboutPage";
import { RamadanPage } from "@/pages/RamadanPage";
import ProphetStoriesPage from "@/pages/ProphetStoriesPage/ProphetStoriesPage";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <App />,
    errorElement: <AppErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.SURAH, element: <SurahPage /> },
      { path: ROUTES.JUZ, element: <JuzPage /> },
      { path: ROUTES.ABOUT, element: <AboutPage /> },
      { path: ROUTES.RECITERS, element: <RecitersPage /> },
      { path: ROUTES.RECITER_DETAILS, element: <ReciterDetailsPage /> },
      { path: ROUTES.QURAN, element: <QuranPage /> },
      { path: ROUTES.MUSHAF_DETAILS, element: <MushafDetailsPage /> },
      { path: ROUTES.MUSHAF_SURAH, element: <MushafSurahPage /> },
      { path: ROUTES.RADIO, element: <RadioPage /> },
      { path: ROUTES.AUTH, element: <AuthPage /> },
      { path: ROUTES.SEARCH, element: <SearchPage /> },
      { path: ROUTES.PROFILE, element: <ProfilePage /> },
      { path: ROUTES.HADITHS, element: <HadithsPage /> },
      { path: ROUTES.HADITH_DETAILS, element: <HadithDetailsPage /> },
      {
        path: ROUTES.FAVORITES,
        element: <FavoritesPage />,
      },
      { path: ROUTES.PRAYER_TIMES, element: <PrayerTimesPage /> },
      { path: ROUTES.AZKAR, element: <AzkarPage /> },
      { path: ROUTES.RAMADAN, element: <RamadanPage /> },
      { path: ROUTES.PROPHET_STORIES, element: <ProphetStoriesPage /> },
    ],
  },
]);
