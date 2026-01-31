import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage, useTheme } from "../../hooks";
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
} from "@mui/icons-material";
import { Drawer, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigation = useNavigate();
  const handleLanguageToggle = () => {
    changeLanguage(language === "en" ? "ar" : "en");
  };
  const isRtl = language === "ar";
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigationItems = [
    { icon: <MenuBook />, label: t("navigation.quran"), href: "/quran" },
    { icon: <Mic />, label: t("navigation.reciters"), href: "/reciters" },
    { icon: <Radio />, label: t("navigation.radio"), href: "/radio" },
  ];

  return (
    <>
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-background border-b border-border">
        {/* Left: Hamburger Menu (Mobile Only) + Logo/Title */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          onClick={() => {
            navigation("/");
          }}
        >
          {/* Hamburger Menu Button - Show below 769px */}
          <Box
            component="div"
            sx={{
              display: { sm: "flex", md: "none" },
              "@media (min-width: 769px)": {
                display: "none",
              },
            }}
          >
            <IconButton
              onClick={toggleDrawer}
              ariaLabel="Open menu"
              icon={<MenuIcon className="w-7 h-7 text-text-primary" />}
              variant="ghost"
              label=""
              className="p-1"
            />
          </Box>

          <img
            src={Logo}
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
            alt="Logo"
          />
          <h2 className="font-bold text-primary text-lg sm:text-2xl lg:text-3xl">
            {t("app.title")}
          </h2>
        </div>

        {/* Center: Navigation Icons - Visible from 769px and up */}
        <Box
          component="nav"
          sx={{
            display: "none",
            "@media (min-width: 769px)": {
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
            variant="ghost"
            size="md"
            ariaLabel={t("navigation.quran")}
          />

          <IconButton
            icon={<Mic />}
            label={t("navigation.reciters")}
            onClick={() => navigation("/reciters")}
            variant="ghost"
            size="md"
            ariaLabel={t("navigation.reciters")}
          />

          <IconButton
            icon={<Radio />}
            label={t("navigation.radio")}
            onClick={() => navigation("/radio")}
            variant="ghost"
            size="md"
            ariaLabel={t("navigation.radio")}
          />
        </Box>

        {/* Right: Sign Up, Language & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sign Up Button - Hidden below 769px */}
          <Box
            component="button"
            className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-primary text-white hover:opacity-90 transition-opacity"
            aria-label="Sign Up"
            sx={{
              display: "none",
              "@media (min-width: 769px)": {
                display: "block",
              },
            }}
          >
            {t("auth.signup")}
          </Box>

          {/* Language Toggle */}
          <button
            onClick={handleLanguageToggle}
            className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-background text-text-primary hover:bg-border transition-all"
            aria-label={t("language.toggle")}
          >
            {language === "en" ? "عربي" : "EN"}
          </button>

          {/* Theme Toggle */}
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

      {/* Mobile Drawer - Show from 0-768px */}
      <Drawer
        anchor={isRtl ? "right" : "left"}
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          display: "block",
          "@media (min-width: 769px)": {
            display: "none",
          },
          "& .MuiDrawer-paper": {
            width: 280,
            backgroundColor: "var(--color-background)",
            color: "var(--color-text-primary)",
          },
        }}
      >
        <div className="flex flex-col h-full bg-background">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <img src={Logo} className="w-10 h-10" alt="Logo" />
              <h2 className="font-bold text-primary text-lg">
                {t("app.title")}
              </h2>
            </div>
            <IconButton
              onClick={toggleDrawer}
              icon={<Close className="text-text-primary" />}
              variant="ghost"
              label=""
              className="p-1 text-text-primary"
            />
          </div>

          {/* Navigation Items */}
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

          {/* Divider */}
          <div className="border-t border-border mx-4" />

          {/* Actions in Drawer */}
          <div className="flex flex-col p-4 gap-3">
            {/* Sign Up Button */}
            <button
              className="w-full px-4 py-3 text-sm font-medium rounded-lg bg-primary text-white hover:opacity-90 transition-opacity"
              aria-label="Sign Up"
            >
              {t("auth.signup")}
            </button>

            {/* Theme Toggle */}
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
