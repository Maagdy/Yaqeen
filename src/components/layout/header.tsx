import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth, useLanguage, useTheme } from "../../hooks";
import { IconButton } from "../common";
import { Logo } from "../../assets/images";
import {
  MenuBook,
  Mic,
  Radio,
  DarkMode,
  LightMode,
  Menu as MenuIcon,
  Close,
  Person,
  Logout,
  Bookmarks,
  AutoStories,
  Info,
} from "@mui/icons-material";
import MosqueIcon from "@mui/icons-material/Mosque";
import { Drawer, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import DarkModeIcon from "@mui/icons-material/DarkMode";
export function Header() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, isRtl } = useLanguage();
  const path = useLocation().pathname;
  const navigation = useNavigate();
  const { user, signOut } = useAuth();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleLanguageToggle = () => {
    changeLanguage(language === "en" ? "ar" : "en");
  };
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    setDrawerOpen(false);
    navigation("/");
  };

  const navigationItems = [
    { icon: <MenuBook />, label: t("navigation.quran"), href: "/quran" },
    { icon: <Mic />, label: t("navigation.reciters"), href: "/reciters" },
    { icon: <Radio />, label: t("navigation.radio"), href: "/radio" },
    { icon: <MenuBook />, label: t("navigation.hadiths"), href: "/hadiths" },
    {
      icon: <AutoStories />,
      label: t("navigation.azkar"),
      href: "/azkar",
    },
    {
      icon: <Bookmarks />,
      label: t("navigation.favorites"),
      href: "/favorites",
    },
    {
      icon: <MosqueIcon />,
      label: t("navigation.prayer_times"),
      href: "/prayer-times",
    },
    {
      icon: <AutoStories />,
      label: t("navigation.prophet_stories"),
      href: "/prophet-stories",
    },
    {
      icon: <Info />,
      label: t("navigation.about"),
      href: "/about",
    },
    {
      icon: <DarkModeIcon />,
      label: t("navigation.ramadan"),
      href: "/ramadan",
    },
  ];

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <>
      <header
        className={`flex sticky top-0 z-1000 items-center justify-between sm:px-6 lg:px-8 py-3 sm:py-2 bg-background border-b border-border transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center gap-1">
          <Box
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={toggleDrawer}
              ariaLabel="Open menu"
              icon={<MenuIcon className="w-7 h-7 text-text-primary" />}
              variant="default"
              label=""
              className="py-1"
            />
            <Person
              sx={{
                display: { xs: "block", md: "none" },
                color: "text-primary",
                cursor: "pointer",
              }}
              onClick={() => {
                navigation("/profile");
                setDrawerOpen(false);
              }}
            />
          </Box>

          <div
            className={`flex items-center justify-center ${isRtl ? "ml-2" : "-ml-2"} sm:ml-0  cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 min-[960px]:static min-[960px]:transform-none min-[960px]:translate-0 select-none`}
            onClick={() => {
              navigation("/");
            }}
          >
            <img
              src={Logo}
              className="-ml-2 w-20 h-20 lg:w-18 lg:h-18 object-contain sm:-mt-1"
              alt="Logo"
            />
            <h2 className="font-bold -ml-2 text-primary text-2xl lg:text-3xl whitespace-nowrap leading-none pt-1">
              {t("app.title")}
            </h2>
          </div>
        </div>

        <Box
          component="nav"
          sx={{
            display: "none",
            "@media (min-width: 960px)": {
              display: "flex",
            },
            alignItems: "center",
            gap: { xs: 1, lg: 2 },
          }}
        >
          <IconButton
            icon={<MenuBook />}
            label={t("navigation.quran")}
            onClick={() => navigation("/quran")}
            variant="default"
            size="md"
            className={`${path === "/quran" ? "text-primary!" : ""}`}
            ariaLabel={t("navigation.quran")}
          />

          <IconButton
            icon={<Mic className="mt-1" />}
            label={t("navigation.reciters")}
            onClick={() => navigation("/reciters")}
            variant="default"
            size="md"
            className={`${path === "/reciters" ? "text-primary!" : ""}`}
            ariaLabel={t("navigation.reciters")}
          />

          <IconButton
            icon={<Radio />}
            label={t("navigation.radio")}
            onClick={() => navigation("/radio")}
            variant="default"
            size="md"
            className={`${path === "/radio" ? "text-primary!" : ""}`}
            ariaLabel={t("navigation.radio")}
          />
        </Box>

        <div className="flex items-center sm:gap-3 z-10 relative">
          <Box
            component="div"
            sx={{
              display: "none",
              "@media (min-width: 960px)": {
                display: "block",
              },
            }}
          >
            {user ? (
              <button
                onClick={() => navigation("/profile")}
                className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-sm font-medium rounded-lg bg-background text-text-primary border border-border hover:bg-border transition-all flex items-center gap-2"
                aria-label="Profile"
              >
                <Person className="w-4 h-4" />
                {t("auth.profile")}
              </button>
            ) : (
              <button
                onClick={() => navigation("/auth")}
                className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-sm font-medium rounded-lg bg-primary text-white hover:opacity-90 transition-opacity"
                aria-label="Sign Up"
              >
                {t("auth.signup")}
              </button>
            )}
          </Box>

          <button
            onClick={handleLanguageToggle}
            className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-sm font-medium rounded-lg bg-background text-text-primary hover:bg-border transition-all"
            aria-label={t("language.toggle")}
          >
            {language === "en" ? "عربي" : "EN"}
          </button>

          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 text-text-primary hover:opacity-80 transition-opacity rounded-lg"
            aria-label={t("theme.toggle")}
          >
            {theme === "light" ? (
              <DarkMode className="w-5 h-5" />
            ) : (
              <LightMode className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      <Drawer
        anchor={isRtl ? "right" : "left"}
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          display: "block",

          "& .MuiDrawer-paper": {
            width: 280,
            backgroundColor: "var(--color-background)",
            color: "var(--color-text-primary)",
          },
        }}
      >
        <div className="flex flex-col h-full bg-background">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center">
              <img
                src={Logo}
                className="w-full h-10"
                alt="Logo"
                loading="lazy"
              />
              <h2 className="font-bold text-primary text-lg">
                {t("app.title")}
              </h2>
            </div>
            <IconButton
              onClick={toggleDrawer}
              icon={<Close className="text-text-primary" />}
              variant="default"
              label=""
              className="p-1 text-text-primary"
            />
          </div>

          <nav className="flex flex-col p-4 gap-2">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  navigation(item.href);
                  toggleDrawer();
                }}
                className="flex items-center gap-4 p-3 rounded-lg text-text-primary hover:bg-border hover:text-primary transition-all w-full text-left"
              >
                <span className="w-6 h-6 text-text-primary">{item.icon}</span>
                <span className="text-base font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="border-t border-border mx-4" />

          <div className="flex flex-col p-4 gap-3">
            {user ? (
              <>
                <button
                  onClick={() => {
                    navigation("/profile");
                    setDrawerOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium rounded-lg bg-background text-text-primary border border-border hover:bg-border transition-all"
                  aria-label="Profile"
                >
                  <Person className="w-4 h-4" />
                  {t("auth.profile")}
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium rounded-lg bg-background text-text-primary border border-border hover:bg-border transition-all"
                  aria-label="Profile"
                >
                  <Logout className="w-4 h-4" />
                  {t("auth.signout")}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  toggleDrawer();
                  navigation("/auth");
                }}
                className="w-full px-4 py-3 text-sm font-medium rounded-lg bg-primary text-white hover:opacity-90 transition-opacity"
                aria-label="Sign Up"
              >
                {t("auth.signup")}
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium rounded-lg bg-background text-text-primary border border-border hover:bg-border transition-all"
              aria-label={t("theme.toggle")}
            >
              {theme === "light" ? (
                <>
                  <DarkMode className="w-5 h-5" />
                  <span>{t("theme.dark")}</span>
                </>
              ) : (
                <>
                  <LightMode className="w-5 h-5" />
                  <span>{t("theme.light")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
