import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage, useTheme } from "../../hooks";
import {
  navigationLinks,
  networkLinks,
  popularLinks,
} from "../../utils/constants";

export function Footer() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();

  const handleLanguageToggle = () => {
    changeLanguage(language === "en" ? "ar" : "en");
  };

  const footerNav = [
    {
      header: t("footer.navigate"),
      array: navigationLinks,
    },
    {
      header: t("footer.network"),
      array: networkLinks,
    },
    {
      header: t("footer.popular-links"),
      array: popularLinks,
    },
  ];

  return (
    <footer className="bg-surface items-center py-12 flex flex-col border-t-2 border-primary">
      <div className="lg:flex justify-between w-[90%] max-w-7xl">
        <div className="mb-8 lg:mb-0 flex flex-col lg:max-w-md">
          <Link
            to="/"
            className="text-2xl w-fit font-bold mb-3 text-primary hover:opacity-80 transition-opacity"
          >
            {t("app.title")}
          </Link>
          <h2 className="text-lg mb-3 font-semibold text-text-primary">
            {t("footer.subtitle")}
          </h2>
          <p className="text-text-secondary leading-relaxed">
            {t("footer.description")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between lg:gap-16 xl:gap-28 mb-8 lg:mb-0">
          {footerNav.map((nav) => (
            <div
              key={nav.header}
              className="mb-6 sm:mb-0 text-center sm:text-left"
            >
              <h3 className="font-bold text-text-primary mb-4 text-base">
                {nav.header}
              </h3>
              <ul className="space-y-3">
                {nav.array.map((link) => {
                  const isExternal = (link as any).external;
                  const translatedText = t(link.text, { defaultValue: link.text });

                  return (
                    <li key={link.text}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-secondary hover:text-primary transition-colors text-sm"
                        >
                          {translatedText}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-text-secondary hover:text-primary transition-colors text-sm"
                        >
                          {translatedText}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-[90%] max-w-7xl flex-col sm:flex-row justify-between sm:gap-x-4 items-center pt-8 mt-8 border-t border-border">
        <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 mb-4 sm:mb-0">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-primary transition-colors text-sm font-medium"
          >
            {t("footer.sitemap")}
          </a>
          <Link
            to="/about"
            className="text-text-secondary hover:text-primary transition-colors text-sm font-medium"
          >
            {t("footer.about")}
          </Link>
          <a
            href="https://github.com/Maagdy/Yaqeen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-primary transition-colors text-sm font-medium"
          >
            {t("footer.feedback")}
          </a>
        </div>

        <div className="flex items-center flex-col sm:flex-row gap-4">
          <p className="text-text-secondary text-sm">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>

          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg bg-background text-text-primary hover:bg-primary hover:text-white transition-all flex items-center gap-2 border border-border shadow-sm"
              aria-label={t("theme.toggle")}
            >
              {theme === "light" ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                  <span className="text-sm font-medium">{t("theme.dark")}</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    {t("theme.light")}
                  </span>
                </>
              )}
            </button>

            <button
              onClick={handleLanguageToggle}
              className="px-4 py-2 rounded-lg bg-background text-text-primary hover:bg-primary hover:text-white transition-all flex items-center gap-2 border border-border shadow-sm"
              aria-label={t("language.toggle")}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
              <span className="text-sm font-medium">
                {language === "en" ? "عربي" : "English"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
